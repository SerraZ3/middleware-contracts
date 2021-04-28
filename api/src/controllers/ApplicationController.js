const { Pool } = require("pg");
let dbConfig = require("../config/database");
const DateProvider = require("../utils/DateProvider");
const StringProvider = require("../utils/StringProvider");
const walletProvider = require("../services/walletProvider");
const { WALLET_PASSWORD } = process.env;
const Middleware = require("../contracts/Middleware");
const pool = new Pool(dbConfig);

class ApplicationController {
  create = async (req, res) => {
    let { ida, user_id, auth, contractSettings } = req.body;
    const middleware = new Middleware();
    middleware.start();

    const DB = await pool.connect();
    try {
      await DB.query("BEGIN");

      let contract = await DB.query(
        `INSERT INTO contract_settings(data_size, period, last_reading, next_reading, storage_type) 
        VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [
          contractSettings.data_size,
          contractSettings.period,
          contractSettings.last_reading,
          contractSettings.next_reading,
          contractSettings.storage_type,
        ]
      );
      console.log(contract.rows[0]);
      let userWallet = await DB.query(
        "SELECT * FROM wallets WHERE user_id = $1 LIMIT 1",
        [user_id]
      );

      userWallet = await walletProvider.decrypt(
        userWallet.rows[0].keystorejsonv3,
        WALLET_PASSWORD
      );
      console.log(userWallet);
      let a = await walletProvider.getBalance(userWallet.address);
      console.log(a);
      let applictionAddress = await middleware.createApplication(
        userWallet.address,
        userWallet.privateKey,
        ida
      );
      console.log(applictionAddress);

      // let application = await DB.query(
      //   `INSERT INTO contract_settings(data_size, period, last_reading, next_reading, storage_type)
      //   VALUES($1, $2, $3, $4, $5) RETURNING *`,
      //   [
      //     contractSettings.data_size,
      //     contractSettings.period,
      //     contractSettings.last_reading,
      //     contractSettings.next_reading,
      //     contractSettings.storage_type,
      //   ]
      // );
      await DB.query("COMMIT");

      return res.send("Rota de inicialização");
    } catch (error) {
      await DB.query("ROLLBACK");

      console.log(error);
      return res.status(400).send(error);
    } finally {
      DB.release(true);
    }
  };
}
module.exports = ApplicationController;
