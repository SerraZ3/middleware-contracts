const { Pool } = require("pg");
let dbConfig = require("../config/database");
const Hash = require("../utils/HashProvider");
const walletProvider = require("../services/walletProvider");
const { WALLET_PASSWORD } = process.env;
const { sign } = require("jsonwebtoken");
const authConfig = require("../config/auth");
const pool = new Pool(dbConfig);

class UserController {
  login = async (req, res) => {
    const { email, password } = req.body;

    const DB = await pool.connect();
    try {
      if (!email || !password) throw { message: "Preencha os campos" };

      const user = await DB.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (!user.rows[0]) throw { message: "Email ou senha incorretos" };

      const passwordMatched = await Hash.compareHash(
        password,
        user.rows[0].password
      );
      if (!passwordMatched) throw { message: "Email ou senha incorretos" };

      const { secret, expiresIn } = authConfig.jwt;
      const token = sign({}, secret, {
        subject: `${user._id}`,
        expiresIn,
      });

      return res
        .status(200)
        .json({ message: "Logado com sucesso", token, user: user.rows[0] });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    } finally {
      DB.release(true);
    }
  };
  create = async (req, res) => {
    const { email, password } = req.body;
    const DB = await pool.connect();

    try {
      if (!email || !password) throw { message: "Preencha os campos" };

      await DB.query("BEGIN");

      const checkEmail = await DB.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      );
      if (checkEmail.rows[0]) throw { message: "Email ja existente" };

      const newPassword = await Hash.generateHash(password);
      const newUser = await DB.query(
        "INSERT INTO users(email, password, active) VALUES($1, $2, $3) RETURNING *",
        [email, newPassword, true]
      );

      if (!newUser.rows[0]) throw { message: "Erro na criação do usuário" };

      const accountWallet = walletProvider.createAccount();
      const accountEncrypted = accountWallet.encrypt(WALLET_PASSWORD);
      // walletProvider.decrypt(teste, WALLET_PASSWORD);
      const newWallet = await DB.query(
        "INSERT INTO wallets(keystorejsonv3, user_id) VALUES($1, $2) RETURNING *",
        [accountEncrypted, newUser.rows[0].id]
      );
      if (!newWallet.rows[0]) throw { message: "Erro na criação da carteira" };

      await DB.query("COMMIT");

      return res.status(200).send("Sucesso");
    } catch (error) {
      await DB.query("ROLLBACK");

      console.log(error);
      return res.status(400).send(error);
    } finally {
      DB.release(true);
    }
  };
}

module.exports = UserController;
