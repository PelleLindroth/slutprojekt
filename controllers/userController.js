const { MissingCredentials } = require("../errors");
const { Op } = require("sequelize");
const User = require("../models/userModel");
const Task = require("../models/taskModel");

const authenticate = async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    res.json(user);
  } catch (error) {
    console.log(error.errorMessage);
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      throw new MissingCredentials(["email", "password", "name"]);
    }
    const newUser = await User.create({ email, password, name, role });
    res.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    next(error);
  }
};

const getOwnAccount = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (req.user.role === "admin") {
      res.json({ name: user.name, email: user.email, role: user.role });
    } else {
      const tasks = await Task.findAll({
        where: {
          [Op.or]: [{ workerId: req.user.id }, [{ clientId: req.user.id }]],
        },
      });
      res.json({ name: user.name, email: user.email, role: user.role, tasks });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
  createUser,
  getOwnAccount,
};
