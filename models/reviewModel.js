const db = require("../database/connection");
const { DataTypes } = require("sequelize");

const Review = db.define(
  "Review",
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Rating cannot be lower than 1'
        },
        max: {
          args: 10,
          msg: 'Rating cannot be higher than 10'
        }
      }
    }
  },
  { timestamps: true }
);

module.exports = Review;
