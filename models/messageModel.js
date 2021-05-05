const db = require("../database/connection");
const { DataTypes } = require("sequelize");

const Message = db.define(
  "Message",
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Message;
