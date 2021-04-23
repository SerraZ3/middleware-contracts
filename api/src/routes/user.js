const express = require("express");
const routes = express.Router();
const UserController = require("../controllers/UserController");

const userController = new UserController();

routes.post("/login/", userController.login);
routes.post("/create/", userController.create);

module.exports = routes;
