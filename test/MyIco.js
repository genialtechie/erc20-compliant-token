const MyIco = artifacts.require('MyIco');

contract('My Ico', function(accounts){
    it('deploy contract', async function(){
        const instance = await MyIco.deployed()
        const totalSupply = await instance.totalSupply.call()

        assert.equal(totalSupply, 1000);
    })
})