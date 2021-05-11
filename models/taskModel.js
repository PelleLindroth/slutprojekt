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
    clientId: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    workerId: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Task;
