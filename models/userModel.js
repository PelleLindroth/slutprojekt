const db = require("../database/connection");
const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Task = require("./taskModel");
const Message = require("./messageModel");
const { InvalidCredentials, Unauthorized, TokenExpired } = require('../errors/index')

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

User.belongsToMany(Task, { through: { model: Message, unique: false } });
Task.belongsToMany(User, { through: { model: Message, unique: false } });

User.beforeCreate((user) => {
  user.password = bcrypt.hashSync(user.password, 10)
})

User.authenticate = async ({ email, password }) => {

  const user = await User.findOne({ where: { email } })
  if (!user) {
    throw new InvalidCredentials()
  }

  const valid = bcrypt.compareSync(password, user.password)

  if (!valid) {
    throw new InvalidCredentials()
  }

  const payload = { email, id: user.id, role: user.role }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  }

}

User.validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenExpired();
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Unauthorized();
    } else {
      throw error;
    }
  }
}

module.exports = User;
