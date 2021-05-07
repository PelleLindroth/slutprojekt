const {
  MissingCredentials,
  ResourceNotFound,
  Teapot,
  Forbidden,
} = require("../errors");
const { Op, where } = require("sequelize");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Message = require("../models/messageModel");

const createTask = async (req, res, next) => {
  try {
    const { title, clientEmail } = req.body;
    const workerId = req.user.id;
    if (!title || !clientEmail) {
      throw new MissingCredentials(["title", "clientEmail"]);
    }
    const client = await User.findOne({ where: { email: clientEmail } });
    if (!client) {
      throw new ResourceNotFound("Client");
    }
    const task = await Task.create({ title, workerId, clientId: client.id });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

const getClientsTasks = async (req) => {
  try {
    const clientId = req.user.id;
    const clientTasks = await Task.findAll({ where: { clientId } });
    if (!clientTasks.length) {
      throw new ResourceNotFound("Tasks");
    }
    return { tasks: clientTasks };
  } catch (error) {
    return error;
  }
};

const getWorkerTasks = async (req) => {
  try {
    const workerId = req.user.id;
    const { filter, search } = req.query;
    let filterObject = {};
    let clients;

    if (search) {
      clients = await User.findAll({
        where: { name: { [Op.substring]: search }, role: "client" },

        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      if (!clients.length) {
        throw new ResourceNotFound("Clients");
      }
      clients = clients.map((client) => client.dataValues.id);
    }

    if (!filter && !search) {
      filterObject = { where: { workerId } };
    } else if (filter && !search) {
      filterObject = {
        where: { workerId, done: filter === "done" ? true : false },
      };
    } else if (!filter && search) {
      filterObject = {
        where: {
          workerId,
          clientId: clients,
        },
      };
    } else if (filter && search) {
      filterObject = {
        where: {
          workerId,
          clientId: clients,
          done: filter === "done" ? true : false,
        },
      };
    } else {
      filterObject = {
        where: {
          workerId,
          clientId: clients,
        },
      };
    }

    const workerTasks = await Task.findAll(filterObject);

    if (!workerTasks.length) {
      throw new ResourceNotFound("Tasks");
    }
    return { tasks: workerTasks };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTask,
  getClientsTasks,
  getWorkerTasks,
};
