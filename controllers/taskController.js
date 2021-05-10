const {
  MissingCredentials,
  ResourceNotFound,
  Teapot,
  Forbidden,
  InvalidCredentials,
  InvalidQueryParams,
  Unauthorized
} = require("../errors");
const { Op, where } = require("sequelize");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Message = require("../models/messageModel");
const taskRoutes = require("../routes/taskRoutes");

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

const getTasks = async (req, res, next) => {
  switch (req.user.role) {
    case 'client':
      getClientsTasks(req, res, next)
      break
    case 'worker':
      getWorkerTasks(req, res, next)
      break
  }
}

const getTasksById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id)
    if (!task) throw new ResourceNotFound('Task')

    if (req.user.role === 'client' && req.user.id !== task.clientId) {
      throw new Unauthorized()
    }

    res.json({ task })
  } catch (error) {
    next(error)
  }
}

const getClientsTasks = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const clientTasks = await Task.findAll({ where: { clientId } });
    if (!clientTasks.length) {
      throw new ResourceNotFound("Tasks");
    }
    res.json({ tasks: clientTasks })
  } catch (error) {
    next(error);
  }
};

const getWorkerTasks = async (req, res, next) => {
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

    if (filter) {
      if (filter !== 'done' && filter !== 'incomplete') {
        throw new InvalidQueryParams('Valid filter params: done or incomplete')
      }
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
    res.json({ tasks: workerTasks });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.destroy({ where: { id: req.params.id } })

    // Check if related messages are deleted, else refactor
    if (!task) throw new ResourceNotFound('Task')

    res.json({ message: `Task with id ${req.params.id} DESTROYED!` })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  createTask,
  getTasks,
  getTasksById,
  getClientsTasks,
  getWorkerTasks,
  deleteTask
};
