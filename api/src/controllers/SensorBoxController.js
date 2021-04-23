const DB = require("../config/database");
const DateProvider = require("../utils/DateProvider");
const StringProvider = require("../utils/StringProvider");

class SensorBoxController {
  init = async (req, res) => {
    try {
      DB.connect();
      await DB.query("BEGIN");
      let {
        ida,
        idsb,
        type,
        timestamp: timestampRequest,
        geolocation: { latitude, longitude, timezone },
        url,
        sensors,
      } = req.body;
      ida = BigInt(ida);
      idsb = BigInt(idsb);
      latitude = parseFloat(latitude);
      longitude = parseFloat(longitude);
      let {
        /*timestamp,*/
        timestamp2Response,
      } = DateProvider.validTimestamp(timestampRequest);
      // Check if type message is w or write
      if (type.toLowerCase() !== "w" && type.toLowerCase() !== "write") {
        throw {
          error: 1,
          message: "Message init can't have type different of 'write' or 'w'",
        };
      }

      let application = await DB.query(
        "SELECT * FROM applications WHERE ida = $1",
        [ida]
      );
      if (!application.rows[0]) throw { message: "Aplicação inválida (ida) " };

      let sensorBox = await DB.query(
        "SELECT * FROM sensor_boxes WHERE idsb = $1",
        [idsb]
      );
      if (!sensorBox.rows[0]) {
        sensorBox = await DB.query(
          `INSERT INTO sensor_boxes(idsb, url, location, application_id, contract_id) 
          VALUES($1, $2, POINT($3,$4), $5,$6) RETURNING *`,
          [idsb, url, latitude, longitude, application.rows[0].id, 1]
        );
      }

      // Mapping data sensors
      sensors = sensors.map((val, id) => {
        // Check if data name is string
        if (
          typeof val.data.name === "string" ||
          val.data.name instanceof String
        ) {
          // Check if data values is array
          if (Array.isArray(val.data.values)) {
            // Remove spaces, accent, special character, put in lower case
            val.data.name = StringProvider.formatString(val.data.name, {
              all: true,
            });

            // Create value key
            val.data.value = {};

            // Put data in key value
            val.data.value.data = val.data.values.map((v) => {
              // Remove spaces, accent, special character, put in lower case
              v.idv = StringProvider.formatString(v.idv, { all: true });

              // Remove spaces, accent, special character, put in lower case
              v.type = StringProvider.formatString(v.type, { all: true });

              return v;
            });
            // Delete values data
            delete val.data["values"];
            // Return formated data
            return val.data;
          }
          throw {
            error: 4,
            message:
              "Sensors error: " + val.data.name + " values isn't an array",
          };
        }
        throw {
          error: 5,
          message: "Sensors error: Invalid name. " + (id + 1) + "º position",
        };
      });
      sensors = await Promise.all(
        sensors.map(
          async (sensor) =>
            await DB.query(
              `
                  INSERT INTO sensors(name, value, contract_id)
                  VALUES($1,$2,$3)  RETURNING *
              `,
              [sensor.name, sensor.value, 1]
            )
        )
      );

      await Promise.all(
        sensors.map(
          async (sensor) =>
            await DB.query(
              `
                  INSERT INTO sensor_boxes_sensors(sensor_box_id, sensor_id)
                  VALUES($1,$2)  RETURNING *
              `,
              [sensorBox.rows[0].id, sensor.rows[0].id]
            )
        )
      );
      await DB.query("COMMIT");
      DB.end();
      return res.send("init");
    } catch (error) {
      console.log(error);
      await DB.query("ROLLBACK");

      return res.status(400).send(error);
    }
  };
  response = (req, res) => {
    return res.send("response");
  };
  trap = (req, res) => {
    return res.send("trap");
  };
}
module.exports = SensorBoxController;
