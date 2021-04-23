require("dotenv").config();
const { INFURA_LINK, NODE_ENV } = process.env;

/**
 * @name web3Provider
 * @description Serviço para criar um objeto web3 com o devido provider de teste ou produção
 * @module
 */
const web3Provider = () => {
  const Web3 = require("web3");
  if (NODE_ENV === "dev" || NODE_ENV === "prod") {
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_LINK));
    return web3;
  }
  if (NODE_ENV === "test") {
    const ganache = require("ganache-cli");
    const web3 = new Web3(ganache.provider());
    return web3;
  }
};

module.exports = web3Provider;
