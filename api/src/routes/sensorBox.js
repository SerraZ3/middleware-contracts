const express = require("express");
const routes = express.Router();
const SensorBoxController = require("../controllers/SensorBoxController");

const sensorBoxController = new SensorBoxController();

routes.post("/init", sensorBoxController.init);
routes.post("/response", sensorBoxController.response);
routes.post("/trap", sensorBoxController.trap);

module.exports = routes;
