const express = require("express");
const routes = express.Router();
const SensorController = require("../controllers/SensorController");

const sensorController = new SensorController();

routes.post("/insert-measure", sensorController.insertMeasure);

module.exports = routes;
