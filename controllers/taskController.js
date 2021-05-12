const {
  MissingCredentials,
  ResourceNotFound,
  Forbidden,
  InvalidRequest,
  Unauthorized,
  UnsupportedFileType,
} = require("../errors");
const { Op } = require("sequelize");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const Message = require("../models/messageModel");
const Image = require("../models/imageModel");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const { findAll } = require("../models/imageModel");


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

const getClientsTasks = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const clientTasks = await Task.findAll({ where: { clientId }, include: {model:Image, attributes: {exclude:["createdAt", "updatedAt", "TaskId"]}} });
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
    let includeImage = {model:Image, attributes: {exclude:["createdAt", "updatedAt", "TaskId"]}}

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
      filterObject = { where: { workerId }, include: includeImage };
    } else if (filter && !search) {
      filterObject = {
        where: { workerId, done: filter === "done" ? true : false },
        include: includeImage
      };
    } else if (!filter && search) {
      filterObject = {
        where: {
          workerId,
          clientId: clients,
        },
        include: includeImage
      };
    } else if (filter && search) {
      filterObject = {
        where: {
          workerId,
          clientId: clients,
          done: filter === "done" ? true : false,
        },
        include: includeImage
      };
    } else {
      filterObject = {
        where: {
          workerId,
          clientId: clients,
        },
        include: includeImage
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


const getTasksById = async (req, res, next) => {
  try {
    let includeImage = {model:Image, attributes: {exclude:["createdAt", "updatedAt", "TaskId"]}}
    const task = await Task.findByPk(req.params.id, {include: includeImage});

    if (!task) throw new ResourceNotFound("Task");

    if (req.user.role === "client" && req.user.id !== task.clientId) {
      throw new Unauthorized();
    }

    res.json({ task });
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

    const image = await Image.create({title: newFileName, TaskId: task.id})

    res.json( {image} )

  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const id = req.params.id
    
    const image = await Image.findByPk(id)
    
    if(!image){
      throw new ResourceNotFound('Image')
    }
    const task = await Task.findByPk(image.TaskId)

    if (req.user.id != task.workerId) {
      throw new Forbidden()
    }

    await image.destroy()

    const filePath = path.join("uploads", image.title);
    fs.unlinkSync(filePath);
        
    res.json({message: `image with id: ${id} deleted.`})
  } catch (error) {
    next(error)
  }
}

const addMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      throw new InvalidBody(["content"]);
    }
    const UserId = +req.user.id;
    const role = req.user.role;
    const TaskId = +req.params.id;
    const task = await Task.findByPk(TaskId);

    if (
      (role === "client" && task.clientId !== UserId) ||
      (role === "worker" && task.workerId !== UserId)
    ) {
      throw new Forbidden();
    }

    const response = await Message.create({ content, UserId, TaskId });

    res.json({ message: response });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const TaskId = +req.params.id;
    const userId = +req.user.id;
    const role = req.user.role;
    const per_page = req.query.per_page || 5;
    const page = req.query.page || 1;
    const offset = (page - 1) * per_page;
    const task = await Task.findByPk(TaskId);

    if (!task) {
      throw new ResourceNotFound("Task");
    }

    if (
      (role === "client" && task.clientId !== userId) ||
      (role === "worker" && task.workerId !== userId)
    ) {
      throw new Forbidden();
    }

    const response = await Message.findAndCountAll({
      where: { TaskId },
      order: [["createdAt", "DESC"]],
      limit: per_page,
      offset: offset,
    });

    if (!response.rows.length) {
      throw new ResourceNotFound("Messages");
    }

    res.json({ messages: response.rows, messageCount: response.count });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const UserId = req.user.id;

    const message = await Message.findByPk(id);

    if (!message) {
      throw new ResourceNotFound("Message");
    }
    if (message.UserId !== UserId) {
      throw new Forbidden();
    }

    await message.destroy();

    res.json({ message: `Message with ID ${id} deleted successfully` });
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
  deleteImage,
  addMessage,
  getMessages,
  deleteMessage,
};
