const ethereumProvider = require("../services/ethereumProvider");
const middlewareABI = require("./abi/Middleware.json");
const { MIDDLEWARE_ADDRESS } = process.env;

class Middleware {
  contract = null;
  start = async (address) => {
    this.contract = await ethereumProvider.getContractInstance(
      middlewareABI,
      MIDDLEWARE_ADDRESS
    );
  };
  createApplication = async (from, fromPK, ida) => {
    try {
      console.log(this.contract.methods);
      console.log();
      let action = this.contract.methods.createApplication(ida).encodeABI();

      const trx = {
        from,
        to: this.contract.options.address,
        gas: "3000000",
        gasPrice: 200000000000,
        data: action,
      };
      console.log(trx);
      const trxAddress = await ethereumProvider.executeTransaction(trx, fromPK);
      return trxAddress;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  createSensorBox = async (from, fromPK, ida, idsb) => {
    const trx = {
      from,
      to: this.contract.options.address,
      gas: "3000000",
      data: this.contract.methods.createSensorBox(ida, idsb).encondeABI(),
    };
    try {
      const trxAddress = await ethereumProvider.executeTransaction(trx, fromPK);
      return trxAddress;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  createSensor = async (
    from,
    fromPK,
    ida,
    idsb,
    sensorName,
    settingsMeasure
  ) => {
    const trx = {
      from,
      to: this.contract.options.address,
      gas: "3000000",
      data: this.contract.methods
        .createSensor(ida, idsb, sensorName, settingsMeasure)
        .encondeABI(),
    };
    try {
      const trxAddress = await ethereumProvider.executeTransaction(trx, fromPK);
      return trxAddress;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
module.exports = Middleware;
