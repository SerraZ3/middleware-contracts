require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");

const Web3 = require("web3");

const { abi, evm } = require("./compile");

const provider = new HDWalletProvider({
  mnemonic: { phrase: process.env.mnemonic },
  providerOrUrl:
    "https://rinkeby.infura.io/v3/f1b4efb5cfb34c188aa9434cc7097fa5",
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const deploymentAccount = accounts[0];
  const privateKey = provider.wallets[
    accounts[0].toLowerCase()
  ].privateKey.toString("hex");

  console.log("Conta usada para o deploy ", accounts[0]);

  try {
    let contract = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
        arguments: [
          "dht11",
          "0x7A2Acd9aceA56CB52DeFd5232Bf4574ac66A1b8B",
          [
            ["temperatura", 2, 0, 0, 0],
            ["umidade", 2, 0, 0, 0],
          ],
          "0x7A2Acd9aceA56CB52DeFd5232Bf4574ac66A1b8B",
        ],
      })
      .encodeABI();

    let transactionObject = {
      gas: 9000000,
      data: contract,
      from: deploymentAccount,
    };
    let signedTransactionObject = await web3.eth.accounts.signTransaction(
      transactionObject,
      "0x" + privateKey
    );
    let result = await web3.eth.sendSignedTransaction(
      signedTransactionObject.rawTransaction
    );
    console.log("Contract deployed to", result.contractAddress);
  } catch (error) {
    console.log(error);
  }

  provider.engine.stop();
};

deploy();
