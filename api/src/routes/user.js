const express = require("express");
const routes = express.Router();
const UserController = require("../controllers/UserController");
const userController = new UserController();

// http://localhost:3000/user/listar
routes.post("/login/", userController.login);

// http://localhost:3000/user/criar
// routes.get("/criar", userController.criar);

module.exports = routes;
