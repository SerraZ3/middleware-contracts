const express = require("express");
const routes = express.Router();
const user = require("./user");
const sensorBox = require("./sensorBox");
const application = require("./application");
const sensor = require("./sensor");

routes.use("/user", user);
routes.use("/sensor-box", sensorBox);
routes.use("/application", application);
routes.use("/sensor", sensor);

module.exports = routes;
