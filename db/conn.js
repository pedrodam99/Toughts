const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "gajopa99", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso");
} catch (err) {
  console.log("Não foi possivel estabelecer uma conexão, erro: ", err);
}

module.exports = sequelize;
