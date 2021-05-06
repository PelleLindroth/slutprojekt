const express = require("express");
const userRoutes = express.Router();
const userController = require("../controllers/userController");
const authToken = require("../middleware/authToken");
const authRoles = require("../middleware/authRole");
const User = require("../models/userModel");
const { Unauthorized } = require("../errors/index");

// userRoutes.get(
//   "/users",
//   authToken,
//   authRoles(["client", "admin"]),
//   async (req, res, next) => {
//     try {
//       console.log(req.user);
//       // throw new Unauthorized()
//       const users = await User.findAll();
//       res.json({ users });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

userRoutes.post("/authenticate", userController.authenticate);

userRoutes.post(
  "/users",
  authToken,
  authRoles(["admin"]),
  userController.createUser
);

userRoutes.get("/me", authToken, userController.getOwnAccount);

module.exports = userRoutes;
