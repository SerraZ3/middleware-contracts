const path = require("path");
const fs = require("fs");
const solc = require("solc");

const sensorFile = "Sensor.sol";

const SensorPath = path.resolve(__dirname, "contracts", sensorFile);

const datas = [
  {
    file: sensorFile,
    name: "Sensor",
  },
];

const sourceSensor = fs.readFileSync(SensorPath, "utf8");

var input = {
  language: "Solidity",
  sources: {
    [sensorFile]: {
      content: sourceSensor,
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
module.exports = contratoCompilado.contracts[sensorFile].Sensor;
