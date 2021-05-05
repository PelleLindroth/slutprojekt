const db = require("../database/connection");
const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Task = require("./taskModel");
const Message = require("./messageModel");

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    unique: {
      args: true,
      msg: "Email already exists",
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    enum: ["client", "worker", "admin"],
    defaultValue: "client",
  },
});

User.belongsToMany(Task, { through: Message });
Task.belongsToMany(User, { through: Message });

module.exports = User;
