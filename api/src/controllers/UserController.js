const DB = require("../config/database");
const Hash = require("../utils/HashProvider");
const walletProvider = require("../services/walletProvider");
const { sign } = require("jsonwebtoken");
const authConfig = require("../config/auth");
const { WALLET_PASSWORD } = process.env;

class UserController {
  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) throw { message: "Preencha os campos" };
      DB.connect();
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
      DB.end();
      return res
        .status(200)
        .json({ message: "Logado com sucesso", token, user: user.rows[0] });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  };
  create = async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) throw { message: "Preencha os campos" };
      DB.connect();
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
      DB.end();

      return res.status(200).send("Sucesso");
    } catch (error) {
      await DB.query("ROLLBACK");

      console.log(error);
      return res.status(400).send(error);
    }
  };
}

module.exports = UserController;
