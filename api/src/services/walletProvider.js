const web3 = require("./web3Provider")();

module.exports = {
  createAccount: () => web3.eth.accounts.create(),
  decrypt: (encryptedPrivateKey, password) =>
    web3.eth.accounts.decrypt(encryptedPrivateKey, password),
};
