document.addEventListener('DOMContentLoaded', () => {
    // Check if WalletConnect SDK is loaded
    if (typeof WalletConnectProvider === 'undefined') {
        console.error('WalletConnect SDK failed to load.');
        return;
    }

    // Check if Web3 is loaded
    if (typeof Web3 === 'undefined') {
        console.error('Web3.js failed to load.');
        return;
    }

    console.log('WalletConnect SDK and Web3.js loaded successfully!');

    // Initialize WalletConnect Provider
    const provider = new WalletConnectProvider.default({
        rpc: {
            416002: "https://testnet-api.algonode.cloud", // Algorand TestNet
            1: "https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY", // Ethereum MainNet (replace with your Alchemy API key)
            56: "https://bsc-dataseed.binance.org/" // Binance Smart Chain
            // Add more RPC URLs for other chains as needed
        }
    });

    // Initialize Web3 with WalletConnect provider
    let web3 = null;

    const connectButton = document.getElementById('connectButton');
    const swapContainer = document.getElementById('swapContainer');
    if (!connectButton || !swapContainer) {
        console.error('Connect button or swap container not found.');
        return;
    }

    // Token lists for different chains (simplified example)
    const tokenLists = {
        416002: [ // Algorand TestNet
            { symbol: "ALGO", address: "0x0" }, // Native ALGO
            { symbol: "USDC", address: "123456" } // Example ASA (Asset ID)
        ],
        1: [ // Ethereum MainNet
            { symbol: "ETH", address: "0x0" }, // Native ETH
            { symbol: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
            { symbol: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f" }
        ],
        56: [ // Binance Smart Chain
            { symbol: "BNB", address: "0x0" }, // Native BNB
            { symbol: "BUSD", address: "0xe9e7cea3dedca5984780bafc599bd69add087d56" }
        ]
    };

    // Function to populate token dropdowns based on selected chain
    window.updateTokenOptions = (type) => {
        const chainSelect = document.getElementById(`${type}Chain`);
        const tokenSelect = document.getElementById(`${type}Token`);
        const chainId = chainSelect.value;

        tokenSelect.innerHTML = ''; // Clear existing options
        const tokens = tokenLists[chainId] || [];
        tokens.forEach(token => {
            const option = document.createElement('option');
            option.value = token.address;
            option.textContent = token.symbol;
            tokenSelect.appendChild(option);
        });
    };

    // Initialize token dropdowns
    updateTokenOptions('from');
    updateTokenOptions('to');

    // Connect Wallet
    connectButton.addEventListener('click', async () => {
        try {
            // Show WalletConnect modal and attempt to connect to a wallet
            await provider.enable();
            console.log('Connected accounts:', provider.accounts);
            web3 = new Web3(provider); // Initialize Web3 with WalletConnect provider
            if (provider.accounts.length > 0) {
                alert(`Connected to wallet: ${provider.accounts[0]}`);
                connectButton.style.display = 'none'; // Hide connect button
                swapContainer.style.display = 'block'; // Show swap interface
            } else {
                alert('No accounts connected. Please scan the QR code with a mobile app.');
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('Failed to connect to wallet. Please try again.');
        }
    });

    // Initiate Swap (using Socket SDK as an example)
    window.initiateSwap = async () => {
        const fromChain = document.getElementById('fromChain').value;
        const fromToken = document.getElementById('fromToken').value;
        const fromAmount = document.getElementById('fromAmount').value;
        const toChain = document.getElementById('toChain').value;
        const toToken = document.getElementById('toToken').value;
        const swapStatus = document.getElementById('swapStatus');

        if (!fromAmount || fromAmount <= 0) {
            swapStatus.textContent = 'Please enter a valid amount.';
            return;
        }

        if (!web3 || !provider.accounts[0]) {
            swapStatus.textContent = 'Please connect your wallet first.';
            return;
        }

        swapStatus.textContent = 'Initiating swap...';

        try {
            // Initialize Socket SDK (example)
            const socket = new Socket({
                apiKey: 'YOUR_SOCKET_API_KEY' // Replace with your Socket API key
            });

            // Request a quote for the swap
            const quote = await socket.getQuote({
                fromChainId: fromChain,
                fromTokenAddress: fromToken === '0x0' ? null : fromToken,
                toChainId: toChain,
                toTokenAddress: toToken === '0x0' ? null : toToken,
                amount: web3.utils.toWei(fromAmount, 'ether'), // Adjust decimals as needed
                userAddress: provider.accounts[0]
            });

            swapStatus.textContent = 'Quote received. Processing swap...';

            // Execute the swap
            const tx = await socket.executeSwap(quote, {
                signer: web3.eth.getAccounts()[0] // Use the connected wallet
            });

            swapStatus.textContent = 'Swap initiated. Transaction hash: ' + tx.transactionHash;
        } catch (error) {
            console.error('Swap error:', error);
            swapStatus.textContent = 'Swap failed: ' + error.message;
        }
    };

    // Disconnect WalletConnect session on page unload
    window.addEventListener('unload', async () => {
        if (provider) {
            await provider.disconnect();
            console.log('Wallet disconnected');
        }
    });
});
