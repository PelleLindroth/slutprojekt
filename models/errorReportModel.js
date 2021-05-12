const db = require("../database/connection");
const { DataTypes } = require("sequelize");

const ErrorReport = db.define("ErrorReport", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

module.exports = ErrorReport;
