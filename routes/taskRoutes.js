const express = require("express");
const taskRoutes = express.Router();
const taskController = require("../controllers/taskController");
const authToken = require("../middleware/authToken");
const authRoles = require("../middleware/authRole");
const authRedirect = require("../middleware/authRedirect");
const Task = require("../models/taskModel");

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
  authRedirect()
);

module.exports = taskRoutes;
