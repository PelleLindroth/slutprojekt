const {
  MissingCredentials,
  ResourceNotFound,
  Teapot,
  Forbidden,
  InvalidCredentials,
  InvalidRequest,
  Unauthorized,
  UnsupportedFileType,
} = require("../errors");
const { Op, where } = require("sequelize");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Message = require("../models/messageModel");
const taskRoutes = require("../routes/taskRoutes");
const path = require("path");
const { v4: uuid } = require("uuid");

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
    case "client":
      getClientsTasks(req, res, next);
      break;
    case "worker":
      getWorkerTasks(req, res, next);
      break;
  }
};

const getTasksById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new ResourceNotFound("Task");

    if (req.user.role === "client" && req.user.id !== task.clientId) {
      throw new Unauthorized();
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

const getClientsTasks = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const clientTasks = await Task.findAll({ where: { clientId } });
    if (!clientTasks.length) {
      throw new ResourceNotFound("Tasks");
    }
    res.json({ tasks: clientTasks });
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
      if (filter !== "done" && filter !== "incomplete") {
        throw new InvalidRequest("Valid filter params: done or incomplete");
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
    const task = await Task.destroy({ where: { id: req.params.id } });

    if (!task) throw new ResourceNotFound("Task");

    res.json({ message: `Task with id ${req.params.id} DESTROYED!` });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;

    if (done && done !== "true" && done !== "false") {
      throw new InvalidRequest("Please mark done true or false");
    }

    const task = await Task.findByPk(id);

    if (!task) {
      throw new ResourceNotFound("Task");
    }
    if (req.user.id !== task.workerId) {
      throw new Unauthorized();
    }

    title && (task.title = title);
    done && (task.done = done);

    const response = await task.save();

    res.json({ task: response });
  } catch (error) {
    next(error);
  }
};

const addImage = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      throw new ResourceNotFound("Task");
    }

    if (task.workerId !== req.user.id) {
      throw new Forbidden();
    }

    const file = req.files.image;

    if (!file) {
      throw new InvalidRequest("Please upload an image file");
    }

    if (!file.mimetype.startsWith("image")) {
      throw new UnsupportedFileType("Only image files accepted");
    }

    const extension = path.extname(file.name);
    const newFileName = uuid() + extension;
    const outputPath = path.join("uploads", newFileName);

    file.mv(outputPath);

    task.image = newFileName;
    const response = await task.save();

    res.json({ task: response });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTasksById,
  getClientsTasks,
  getWorkerTasks,
  deleteTask,
  updateTask,
  addImage,
};
