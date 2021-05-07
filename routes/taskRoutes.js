const express = require("express");
const taskRoutes = express.Router();
const taskController = require("../controllers/taskController");
const authToken = require("../middleware/authToken");
const authRoles = require("../middleware/authRole");


taskRoutes.post("/tasks", authToken, authRoles(["worker"]), taskController.createTask)




module.exports = taskRoutes