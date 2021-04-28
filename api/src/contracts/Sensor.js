const ethereumProvider = require("../services/ethereumProvider");
const sensorABI = require("./abi/Sensor.json");
const { SENSOR_ADDRESS } = process.env;

class Sensor {
  contract = null;
  start = async () => {
    this.contract = await ethereumProvider.getContractInstance(
      sensorABI,
      SENSOR_ADDRESS
    );
  };
  getContractAddress = () => this.contract.options.address;
  getContractABI = () => sensorABI;
  insertMeasure = async (from, fromPK, measures) => {
    try {
      let action = await this.contract.methods
        .insertMeasure(measures)
        .encodeABI();

      const trx = {
        from,
        to: this.contract.options.address,
        gas: "3000000",
        gasPrice: 200000000000,
        data: action,
      };
      const trxAddress = await ethereumProvider.executeTransaction(trx, fromPK);
      return trxAddress;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
module.exports = Sensor;
