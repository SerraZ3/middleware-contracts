const express = require("express");
const app = express();
const port = 3333;
const routes = require("./src/routes");

app.use(express.json());

// dd-mm-year-hh-mm-ss
app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Rondando na porta ${port}`);
});
