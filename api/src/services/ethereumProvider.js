const web3 = require("./web3Provider")();

module.exports = {
  getContractInstance: async (abi, contractAddress) =>
    await new web3.eth.Contract(abi, contractAddress),
  executeTransaction: async (trx, fromPK) => {
    const signedTrx = await web3.eth.accounts.signTransaction(trx, fromPK);

    const trxAddress = await web3.eth.sendSignedTransaction(
      signedTrx.rawTransaction
    );
    return trxAddress;
  },
  encodeFunctionCall: async (interface, params) =>
    await web3.eth.abi.encodeFunctionCall(interface, params),
};
