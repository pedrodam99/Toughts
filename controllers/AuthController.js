const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //comparando as senhas
    if (password != confirmpassword) {
      req.flash("message", "As senhas não são iguais, tente novamente");
      res.render("auth/register");

      return;
    }

    //vendo se usuário já existe
    const checkIfUserExists = await User.findOne({ where: { email: email } });

    if (checkIfUserExists) {
      req.flash("message", "Esse email já pertence a uma conta, tente outro.");
      res.render("auth/register");

      return;
    }

    //criar a senha para jogar no banco
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      req.session.userid = createdUser.id;

      req.flash("message", "Cadastrado com sucesso.");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    // ver se o usuário existe
    const user = await User.findOne({ where: { email: email } });
    
    if (!user) {
      req.flash("message", "Usuário ou Senha incorretos!");
      res.render("auth/login");
      
      return;
    }
    
    // ver se a senha está certa
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Usuário ou Senha incorretos!");
      res.render("auth/login");

      return;
    }

    req.session.userid = user.id;

    req.flash("message", "Autenticação realizada com sucesso.");

    req.session.save(() => {
      res.redirect("/");
    });
  }
};
