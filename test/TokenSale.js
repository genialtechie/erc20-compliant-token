const TokenSale = artifacts.require('TokenSale');

let instance;

beforeEach(async function(){
    //create contract instance
    instance = await TokenSale.deployed();
});

contract('Token Sale Contract', function(accounts){
    it('deploy contract and check price', async function(){
        const price = await instance.tokenPrice.call();
        assert.equal(price, 100000000000000000n);
    })
});