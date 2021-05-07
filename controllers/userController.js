const { MissingCredentials, ResourceNotFound, Teapot } = require("../errors");
const { Op, where } = require("sequelize");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const bcrypt = require("bcryptjs");

const authenticate = async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    res.json(user);
  } catch (error) {
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
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });

    if (req.user.role === "admin") {
      res.json({ user });
    } else {
      const tasks = await Task.findAll({
        where: {
          [Op.or]: [{ workerId: req.user.id }, [{ clientId: req.user.id }]],
        },
      });
      res.json({ user, tasks });
    }
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query
    let filterObject = {}

    if (!role && !search) {
      filterObject = { attributes: { exclude: ['password'] } }

    } else if (role && !search) {
      if (!['client', 'admin', 'worker'].includes(role)) {
        throw new ResourceNotFound('User')
      }
      filterObject = { where: { role }, attributes: { exclude: ['password'] } }

    } else if (!role && search) {
      filterObject = { where: { name: { [Op.substring]: search } }, attributes: { exclude: ['password'] } }
    } else if (role && search) {
      filterObject = { where: { name: { [Op.substring]: search }, role }, attributes: { exclude: ['password'] } }
    }

    const users = await User.findAll(filterObject)
    if (!users.length) { throw new ResourceNotFound('Users') }
    res.json(users)

  } catch (error) {
    next(error)
  }
}

const getById = async (req, res ,next) => {
  try{

    const id = req.params.id
    const user = await User.findByPk(id, {attributes: {exclude: ['password', 'createdAt', 'updatedAt']}})
    if(!user){
      throw new ResourceNotFound('User')
    }
    res.json(user)

  }catch(error){
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try{
    let id;
    if (req.body.password && !req.body.confirmPassword) {
      throw new MissingCredentials('confirmPassword')
    }
    if (req.body.password && req.body.password !== req.body.confirmPassword) {
      throw new Teapot()
    }
    if (req.params.id && req.user.role === 'admin') {
      id = req.params.id
    }else{
      id = req.user.id
    } 

    const updates = Object.keys(req.body).reduce((updateObj, key) => {
      updateObj[key] = req.body[key]
      return updateObj
    }, {})

    if(updates.password){
      updates.password = bcrypt.hashSync(updates.password, 10)
    }
    if (updates.role && !req.params.id) {
      delete updates.role
    }
    if (Object.keys(updates).length === 0) {
      throw new MissingCredentials(['Fields to update'])
    }

    const update = await User.update(updates, {where: {id}} )
    if (update[0] == 0) {
      throw new ResourceNotFound('User')
    }
    res.json({message: 'success!'})

  }catch(error){
    next(error)
  }
}


module.exports = {
  authenticate,
  createUser,
  getOwnAccount,
  getUsers,
  getById,
  updateUser,
};
