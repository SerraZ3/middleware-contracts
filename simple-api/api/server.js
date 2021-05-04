const express = require("express");
const app = express();
const cors = require("cors");
const port = 3333;

app.use(cors());
app.use(express.json());

const readings = [];
const hashSensor = "d5b863c277fb1c6475eebef50278ff59";
app.post("/insert-data", function (req, res) {
  var { hash, temperature, humidity } = req.body;
  const timestamp = new Date().getTime();

  try {
    // Se o hash não for igual ao do sensor
    if (hashSensor !== hash) throw { message: "Inválid Hash" };

    if (!temperature && !humidity)
      throw { message: "Empty temperature or humidity" };

    // Remove o ponto flutuante multiplicando por 100.
    // Os dois ultimos digitos são as casas decimais
    // Solidity não aceita float
    temperature = temperature.toFixed(2) * 100;
    humidity = humidity.toFixed(2) * 100;

    readings.push({ temperature, humidity, timestamp });
    res.status(201).json({ message: "Success!" });
  } catch (error) {
    res.status(400).json({ message: "Error", error });
  }
});
app.get("/get-data", function (req, res) {
  res.json({ data: readings });
});
app.listen(port, () => {
  console.log(`Servidor rondando na porta ${port}`);
});
