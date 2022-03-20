App = {
    web3Provider: null,
    contracts: {},
    currentAccount: null,

    initWeb3: async function(){
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
            // Request account access
            await ethereum.request({method: 'eth_requestAccounts'});
            //if accounts are succesfully accessed, change UI
            $('#landing ,#loading').addClass('hide');
            $('#mint').removeClass('hide');
            } catch (error) {
            // User denied account access...
            console.error("User denied account access");
            alert('Please connect MetaMask to use HBO Wallet');
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function(){
        $.getJSON('MyIco.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            const token = data;
            App.contracts.Token = TruffleContract(token);
          
            // Set the provider for contract
            App.contracts.Token.setProvider(App.web3Provider);

            // Use contract to retrieve blockchain data
            return App.loadData();
        });
    },

    loadData: async function() {
        try {
            //get the first account from the connected accounts
            const [account] = await ethereum.request({method: 'eth_accounts'});
            App.currentAccount = account;
            $('.user-address').html(`Connected to ${App.currentAccount}`);

            //set default account and create contract instance 
            web3.eth.defaultAccount = App.currentAccount;
            const token = await App.contracts.Token.deployed();
            
        } catch (error) {
            console.error(error)
        }
    }
}

$(window).on('load', async function(){
    // init web3 on page reload
    App.initWeb3();
    //Init web3 and token
    $('#connect-web3 ,#mint-tkns').click( function (event) {
        event.preventDefault();
        if(event.target.id == 'connect-web3'){
            App.initWeb3();
        } else {
            App.sendTokens();
        }
    });
});