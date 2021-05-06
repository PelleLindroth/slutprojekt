const { Sequelize } = require("sequelize");
const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database/ingebrabygg.sqlite",
});

module.exports = db;
