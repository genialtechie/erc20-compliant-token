const MyIco = artifacts.require("MyIco");
const TokenSale = artifacts.require("TokenSale");
const tokenPrice = 100000000000000000n;

module.exports = function (deployer) {
  //deploy contract and set values
  deployer.then(async () =>{
    await deployer.deploy(MyIco, 1000);
    await deployer.deploy(TokenSale, MyIco.address, tokenPrice);
  });
};
