const express = require("express");
const routes = express.Router();
const user = require("./user");
const sensorBox = require("./sensorBox");

routes.use("/user", user);
routes.use("/sensor-box", sensorBox);

module.exports = routes;
