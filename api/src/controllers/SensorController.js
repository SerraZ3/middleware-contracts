const Sensor = require("../contracts/Sensor");

class SensorController {
  insertMeasure = async (req, res) => {
    let { measures, address, privateKey } = req.body;
    const sensor = new Sensor();
    try {
      await sensor.start();
      const transaction = await sensor.insertMeasure(
        address,
        `0x${privateKey}`,
        measures
      );
      const contractAddress = await sensor.getContractAddress();

      return res.status(201).json({ transaction, contractAddress });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  };
}
module.exports = SensorController;
