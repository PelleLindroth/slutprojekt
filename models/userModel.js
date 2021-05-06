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
    type: DataTypes.ENUM("client", "worker", "admin"),
    defaultValue: "client",
  },
});

User.belongsToMany(Task, { through: Message });
Task.belongsToMany(User, { through: Message });


User.beforeCreate((user, options) => {
  user.password = bcrypt.hashSync(user.password, 10)
})

// User.authenticate = async ({ email, password }) => {
//   const user = await User.findOne({ where: { email } })
//   if (!user) return ({ success: false, message: 'Invalid credentials. Please check your email' })

//   const valid = bcrypt.compareSync(password, user.password)

//   if (valid) {
//     const payload = { email, id: user.id }
//     const token = jwt.sign(payload, process.env.JWT_SECRET)
//     return { success: true, user: { id: user.id, name: user.name, email: user.email, favoriteMix: user.favoriteMix }, token }
//   } else {
//     return ({ success: false, message: 'Access denied. Your email and password don\'t match' })
//   }
// }

module.exports = User;
