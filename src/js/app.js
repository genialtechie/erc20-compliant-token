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
            $('#landing').addClass('hide');
            $('#mint').removeClass('hide');
            } catch (error) {
            // User denied account access...
            console.error("User denied account access");
            alert('Please connect MetaMask to mint');
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

        }).then(function () {
            $.getJSON('TokenSale.json', function(data) {
                // Get the necessary contract artifact file and instantiate it with @truffle/contract
                const crowdsale = data;
                App.contracts.Crowdsale = TruffleContract(crowdsale);
              
                // Set the provider for contract
                App.contracts.Crowdsale.setProvider(App.web3Provider);
    
                // Use contract to retrieve blockchain data
                return App.loadData();
            });
        });
    },

    loadData: async function() {
        try {
            //get the first account from the connected accounts
            const [account] = await ethereum.request({method: 'eth_accounts'});
            App.currentAccount = account;
            $('#user-address').html(`Connected`);

            //set default account and create contract instance 
            web3.eth.defaultAccount = App.currentAccount;
            const token = await App.contracts.Token.deployed();

            const balance = await token.balanceOf(App.currentAccount);
            
        } catch (error) {
            console.error(error)
        }
    },

    sendTokens: async function() {
        try {
            const token = await App.contracts.Token.deployed();
            const crowdsale = await App.contracts.Crowdsale.deployed();

            const price = await crowdsale.tokenPrice.call();
            App.tokenPrice = Number(price);

            const qty = $('#mint-qty').val();

            const transfer = await crowdsale.buyTokens(qty, 
                {
                    from: App.currentAccount, 
                    value: qty * Number(App.tokenPrice)
                });

        } catch (error) {
            console.error(error)
        }
    }
}

$(window).on('load', async function(){
    // init web3 on page reload
    ethereum.isConnected() ? App.initWeb3() : console.log('connect to metamask');
    //Init web3 and token
    $('#connect-web3 ,#mint-tkns, #user-address').click( function (event) {
        event.preventDefault();
        event.target.id == 'mint-tkns' ? App.sendTokens() : App.initWeb3();
    });
});