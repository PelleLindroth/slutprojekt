const db = require("../database/connection");
const { DataTypes } = require("sequelize");

const Image = db.define(
    "Image",
    {
        title:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = Image