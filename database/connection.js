const { Sequelize } = require("sequelize");
const db = new Sequelize({
  dialect: "sqlite",
  storage: "./ingebrabygg.sqlite",
});

module.exports = db;
