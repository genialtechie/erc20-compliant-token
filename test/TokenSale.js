const TokenSale = artifacts.require('TokenSale');
const Token = artifacts.require('MyIco');

let instance, tokenInstance;

beforeEach(async function(){
    //create contract instance
    instance = await TokenSale.deployed();
});

contract('Token Sale Contract', function(accounts){
    const tokenPrice = 100000000000000000n;
    const admin = accounts[0];
    const buyer = accounts[1];
    const buyer2 = accounts[2];
    it('deploy contract and check price', async function(){
        const price = await instance.tokenPrice.call();
        assert.equal(price, tokenPrice);
    });

    it('test exceptions', async function(){
        //test exceptions
        try{
            // try{
            //     await instance.buyTokens(10000, {from: buyer, value: 10000 * Number(tokenPrice)});
            // }
            // catch(error) {
            //     assert.fail;
            //     assert(error.message.indexOf('revert') >= 0, 'you cannot buy that many tokens')
            // }
            await instance.buyTokens(10, {from: buyer, value: 1});
        }
        catch(error) {
            assert.fail;
            assert(error.message.indexOf('revert') >= 0, 'error message must equal revert');

        }
    });

    it('facilitate buying tokens', async function(){
        tokenInstance = await Token.deployed();
        await tokenInstance.transfer(instance.address, 500, {from: admin});
        const transfer = await instance.buyTokens(10, {from: buyer2, value: 10 * Number(tokenPrice)});
        assert.equal(transfer.logs.length, 1);
        //log receipt to console
        console.log(`You just bought ${transfer.logs[0].args._amount}HBO to ${transfer.logs[0].args._to}`);
        const tokensSold = await instance.tokensSold.call();
        assert.equal(tokensSold, 10);

        await instance.buyTokens(10, {from: buyer, value: 10 * Number(tokenPrice)});
        const contractBalance = await tokenInstance.balanceOf(instance.address);
        assert.equal(contractBalance, 490);
    });

    it('end sale', async function(){
        tokenInstance = await Token.deployed();
        try{

            //try ending sale from different account
            await instance.endSale({from: buyer});
        }
        catch(error){
            assert.fail;
            assert(error.message.indexOf('revert') >= 0, 'error must contain revert');
        }
        // end sale from admin
        const end = await instance.endSale({from: admin});
        assert.ok(end);
        const bal = await tokenInstance.balanceOf(admin);
        assert.equal(bal, 990)
    })
});