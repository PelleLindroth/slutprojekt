const db = require("../database/connection");
const { DataTypes } = require("sequelize");

const Task = db.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
      defaultValue: "Untitled task",
    },
    image: {
      type: DataTypes.STRING,
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Task;
