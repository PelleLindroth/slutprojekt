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

taskRoutes.post(
  "/tasks/:id/image",
  authToken,
  authRoles(["worker"]),
  taskController.addImage
);

taskRoutes.post(
  "/tasks/:id/error",
  authToken,
  authRoles(["client"]),
  taskController.addErrorReport
);

taskRoutes.post(
  "/errors/:id/image",
  authToken,
  authRoles(["client"]),
  taskController.addImageToErrorReport
);

taskRoutes.post(
  "/tasks/:id/messages",
  authToken,
  authRoles(["worker", "client"]),
  taskController.addMessage
);

taskRoutes.post(
  "/tasks/:id/review",
  authToken,
  authRoles(["client"]),
  taskController.addReview
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

taskRoutes.get(
  "/tasks/:id/messages",
  authToken,
  authRoles(["client", "worker"]),
  taskController.getMessages
);

taskRoutes.get('/reviews', authToken, authRoles(['admin']), taskController.getReviews)

taskRoutes.patch(
  "/tasks/:id",
  authToken,
  authRoles(["worker"]),
  taskController.updateTask
);

taskRoutes.delete(
  "/tasks/:id",
  authToken,
  authRoles(["admin"]),
  taskController.deleteTask
);

taskRoutes.delete(
  "/images/:id",
  authToken,
  authRoles(["worker"]),
  taskController.deleteImage
);

taskRoutes.delete(
  "/messages/:id",
  authToken,
  authRoles(["client", "worker"]),
  taskController.deleteMessage
);

module.exports = taskRoutes;
