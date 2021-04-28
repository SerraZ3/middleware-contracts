const path = require("path");
const fs = require("fs");
const solc = require("solc");

const middlewareFile = "Middleware.sol";
const applicationFile = "Application.sol";
const sensorFile = "Sensor.sol";
const sensorBoxFile = "SensorBox.sol";

const MiddlewarePath = path.resolve(__dirname, "contracts", middlewareFile);
const ApplicationPath = path.resolve(__dirname, "contracts", applicationFile);
const SensorPath = path.resolve(__dirname, "contracts", sensorFile);
const SensorBoxPath = path.resolve(__dirname, "contracts", sensorBoxFile);

const datas = [
  {
    file: middlewareFile,
    name: "Middleware",
  },
  {
    file: applicationFile,
    name: "Application",
  },
  {
    file: sensorFile,
    name: "Sensor",
  },
  {
    file: sensorBoxFile,
    name: "SensorBox",
  },
];

const sourceMiddleware = fs.readFileSync(MiddlewarePath, "utf8");
const sourceApplication = fs.readFileSync(ApplicationPath, "utf8");
const sourceSensor = fs.readFileSync(SensorPath, "utf8");
const sourceSensorBox = fs.readFileSync(SensorBoxPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    [middlewareFile]: {
      content: sourceMiddleware,
    },
    [applicationFile]: {
      content: sourceApplication,
    },
    [sensorFile]: {
      content: sourceSensor,
    },
    [sensorBoxFile]: {
      content: sourceSensorBox,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

let contratoCompilado = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log("Imprimindo ABIs");
// datas.map((data) =>
//   console.log(
//     data.name,
//     JSON.stringify(
//       contratoCompilado.contracts[data.file][data.name].abi,
//       null,
//       4
//     )
//   )
// );
// console.log(contratoCompilado.contracts);
// console.log(contratoCompilado.contracts[middlewareFile].Middleware);
module.exports = contratoCompilado.contracts[middlewareFile].Middleware;
