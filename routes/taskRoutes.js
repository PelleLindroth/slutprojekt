const express = require("express");
const taskRoutes = express.Router();
const taskController = require("../controllers/taskController");
const authToken = require("../middleware/authToken");
const authRoles = require("../middleware/authRole");

taskRoutes.post(
  "/tasks",
  authToken,
  authRoles(["worker"]),
  taskController.createTask
);

taskRoutes.get(
  "/tasks",
  authToken,
  authRoles(["client", "worker"]),
  taskController.getTasks
);

taskRoutes.get(
  "/tasks/:id",
  authToken,
  authRoles(["client", "worker"]),
  taskController.getTasksById
);

taskRoutes.delete(
  "/tasks/:id",
  authToken,
  authRoles(["admin"]),
  taskController.deleteTask
);

taskRoutes.patch(
  "/tasks/:id",
  authToken,
  authRoles(["worker"]),
  taskController.updateTask
);

taskRoutes.post(
  "/tasks/:id/image",
  authToken,
  authRoles(["worker"]),
  taskController.addImage
);

taskRoutes.post(
  "/tasks/:id/messages",
  authToken,
  authRoles(["worker", "client"]),
  taskController.addMessage
);

module.exports = taskRoutes;
