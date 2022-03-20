const assert = require("minimalistic-assert");

const MyIco = artifacts.require('MyIco');

let instance;

beforeEach(async function(){
    //create contract instance
    instance = await MyIco.deployed();
});

contract('My Ico', function(accounts){
    it('check contract values on contract deployment', async function(){
        //read values
        const totalSupply = await instance.totalSupply.call();
        const name = await instance.name.call();
        const symbol = await instance.symbol.call();
        
        //check values
        assert.equal(totalSupply, 1000);
        assert.equal(name, "Token");
        assert.equal(symbol, "MTK");
    });

    it('check balance of deployer', async function(){
        const balance = await instance.balanceOf(accounts[0]);
        assert.equal(balance, 1000);
    });

    it('test transfer function ', async function(){
        try{
            //test exception by sending more coins than total supply
           await instance.transfer.call(accounts[1], 10000);
        } 
        catch(error) {
            //handle exception and check if error contains revert
            assert.fail;
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            //check if call returns a boolean
            const success = await instance.transfer.call(accounts[1], 100);
            assert.equal(success, true, 'boolean is returned');
        }
        finally {
            //transfers 100 tokens from account[0] to [1]
            const transfer = await instance.transfer(accounts[1], 100, {from: accounts[0]});
            //log receipt to console
            console.log(`You just sent ${transfer.logs[0].args._amount}HBO from ${transfer.logs[0].args._from} to ${transfer.logs[0].args._to}`);
            //check balances
            const balance1 = await instance.balanceOf(accounts[1]);
            assert.equal(balance1, 100);
            const balance2 = await instance.balanceOf(accounts[0]);
            assert.equal(balance2, 900);
        }
    });
    it('test approve and allowance', async function(){
        //test if it returns bool
        const success = await instance.approve.call(accounts[1], 100);
        assert.equal(success, true, 'boolean is returned');

        const approve = await instance.approve(accounts[1], 100, {from: accounts[0]});
        //log receipt to console
        console.log(`You just approved ${approve.logs[0].args.amount}HBO to ${approve.logs[0].args.spender}`);

        const allowance = await instance.allowance(accounts[0], accounts[1]);
        assert.equal(allowance, 100);
    });
    it('test transfer from function ', async function(){
        try{
            await instance.approve(accounts[1], 10);
            //test exception by sending more coins than approved
            await instance.transferFrom.call(accounts[0], accounts[2], 10000, {from: accounts[1]});
        } 
        catch(error) {
            //handle exception and check if error contains revert
            assert.fail;
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            //check if call returns a boolean
            const success = await instance.transferFrom.call(accounts[0], accounts[2], 10, {from: accounts[1]});
            assert.equal(success, true, 'boolean is returned');
        }
        finally {
            //transfers 100 tokens from account[0] to [2] using accounts[1]
            const transfer = await instance.transferFrom(accounts[0], accounts[2], 10, {from: accounts[1]});
            //log receipt to console
            console.log(`You just approved and sent ${transfer.logs[0].args._amount}HBO from ${transfer.logs[0].args._from} to ${transfer.logs[0].args._to}`);
            //check balances
            const balance1 = await instance.balanceOf(accounts[0]);
            assert.equal(balance1, 890);
            const balance2 = await instance.balanceOf(accounts[2]);
            assert.equal(balance2, 10);
            //check allowance
            const allowance = await instance.allowance(accounts[0], accounts[1]);
            assert.equal(allowance, 0);
        }
    });
});