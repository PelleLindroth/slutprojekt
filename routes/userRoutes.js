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

userRoutes.patch("/users/:id", authToken, authRoles(["admin"]), userController.updateUser)

userRoutes.patch("/me", authToken, userController.updateUser)

userRoutes.delete("/users/:id", authToken, authRoles(["admin"]), userController.deleteUser)



module.exports = userRoutes;
