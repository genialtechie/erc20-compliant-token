const MyIco = artifacts.require("MyIco");

module.exports = function (deployer) {
  //deploy contract and set supply to 1000
  deployer.deploy(MyIco, 1000);
};
