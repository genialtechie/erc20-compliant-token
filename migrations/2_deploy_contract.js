const MyIco = artifacts.require("MyIco");

module.exports = function (deployer) {
  deployer.deploy(MyIco, 1000);
};
