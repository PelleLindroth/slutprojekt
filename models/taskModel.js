const db = require("../database/connection");
const { DataTypes } = require("sequelize");
const Image = require("./imageModel");
const ErrorReport = require("./errorReportModel");
const Review = require("./reviewModel");

const Task = db.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
      defaultValue: "Untitled task",
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    clientId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    workerId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Task.hasMany(Image);
Image.belongsTo(Task);

Task.hasMany(ErrorReport);
ErrorReport.belongsTo(Task);

Task.hasOne(Review, { unique: true });
Review.belongsTo(Task, { unique: true });

module.exports = Task;
