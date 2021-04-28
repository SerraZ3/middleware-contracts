const express = require("express");
const routes = express.Router();
const ApplicationController = require("../controllers/ApplicationController");

const applicationController = new ApplicationController();

routes.post("/", applicationController.create);

module.exports = routes;
