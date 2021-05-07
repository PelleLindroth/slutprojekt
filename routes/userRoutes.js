const express = require("express");
const userRoutes = express.Router();
const userController = require("../controllers/userController");
const authToken = require("../middleware/authToken");
const authRoles = require("../middleware/authRole");

userRoutes.post("/authenticate", userController.authenticate);

userRoutes.post(
  "/users",
  authToken,
  authRoles(["admin"]),
  userController.createUser
);

userRoutes.get("/me", authToken, userController.getOwnAccount);

userRoutes.get("/users", authToken, authRoles(["worker", "admin"]), userController.getUsers)

userRoutes.get("/users/:id", authToken, userController.getById)

module.exports = userRoutes;
