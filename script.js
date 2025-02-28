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

    // Check if Coinbase Wallet SDK is loaded
    if (typeof CoinbaseWalletSDK === 'undefined') {
        console.error('Coinbase Wallet SDK failed to load.');
        return;
    }

    // Check if Squid SDK is loaded
    if (typeof Squid === 'undefined') {
        console.error('Squid SDK failed to load.');
        return;
    }

    console.log('WalletConnect SDK, Web3.js, Coinbase Wallet SDK, and Squid SDK loaded successfully!');

    // Wallet provider instances
    let provider = null;
    let web3 = null;

    const connectButton = document.getElementById('connectButton');
    const walletModal = document.getElementById('walletModal');
    const swapContainer = document.getElementById('swapContainer');

    if (!connectButton || !walletModal || !swapContainer) {
        console.error('Connect button, wallet modal, or swap container not found.');
        return;
    }

    // Token lists for different chains (simplified example)
    const tokenLists = {
        "algorand-testnet": [
            { symbol: "ALGO", address: "0x0" }, // Native ALGO
            { symbol: "USDC", address: "123456" } // Example ASA (Asset ID)
        ],
        "ethereum-mainnet": [
            { symbol: "ETH", address: "0x0" }, // Native ETH
            { symbol: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
            { symbol: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f" }
        ],
        "bsc-mainnet": [
            { symbol: "BNB", address: "0x0" }, // Native BNB
            { symbol: "BUSD", address: "0xe9e7cea3dedca5984780bafc599bd69add087d56" }
        ]
    };

    // Function to populate token dropdowns based on selected chain
    window.updateTokenOptions = (type) => {
        console.log(`Updating token options for ${type}...`);
        const chainSelect = document.getElementById(`${type}Chain`);
        const tokenSelect = document.getElementById(`${type}Token`);
        const chainId = chainSelect.value;

        tokenSelect.innerHTML = '';
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

    // Remove any existing click listeners to avoid duplicates
    connectButton.removeEventListener('click', connectButton.onclick);

    // Show wallet selection modal when clicking "Connect Wallet"
    connectButton.addEventListener('click', () => {
        console.log('Opening wallet selection modal...');
        walletModal.style.display = 'flex';
    });

    // Close wallet modal
    window.closeWalletModal = () => {
        console.log('Closing wallet selection modal...');
        walletModal.style.display = 'none';
    };

    // Connect to selected wallet
    window.connectWallet = async (walletType) => {
        console.log(`Connecting to ${walletType}...`);
        try {
            if (walletType === 'metamask') {
                // Connect with MetaMask
                if (!window.ethereum) {
                    throw new Error('MetaMask is not installed. Please install the MetaMask extension.');
                }
                provider = window.ethereum;
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(provider);
                console.log('MetaMask connected:', accounts);
                provider.accounts = accounts; // Mimic WalletConnect provider structure
            } else if (walletType === 'coinbase') {
                // Connect with Coinbase Wallet
                const coinbaseWallet = new CoinbaseWalletSDK({
                    appName: "Dongpt DApp",
                    appLogoUrl: "https://scmlpt.github.io/Dongpt/images/matrix-pattern.png",
                    darkMode: true
                });
                provider = coinbaseWallet.makeWeb3Provider(
                    "https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY",
                    1 // Default chain ID (Ethereum MainNet)
                );
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(provider);
                console.log('Coinbase Wallet connected:', accounts);
                provider.accounts = accounts;
            } else if (walletType === 'walletconnect') {
                // Connect with WalletConnect
                provider = new WalletConnectProvider.default({
                    rpc: {
                        416002: "https://testnet-api.algonode.cloud", // Algorand TestNet
                        1: "https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY", // Ethereum MainNet
                        56: "https://bsc-dataseed.binance.org/" // Binance Smart Chain
                    }
                });
                console.log('Triggering WalletConnect QR code...');
                await provider.enable();
                web3 = new Web3(provider);
                console.log('WalletConnect connected:', provider.accounts);
            } else {
                throw new Error('Unsupported wallet type');
            }

            // If connection is successful, hide modal and show swap interface
            if (provider.accounts && provider.accounts.length > 0) {
                alert(`Connected to wallet: ${provider.accounts[0]}`);
                closeWalletModal();
                connectButton.style.display = 'none';
                swapContainer.style.display = 'block';
                console.log('Swap container should now be visible');
            } else {
                throw new Error('No accounts connected. Please try again.');
            }
        } catch (error) {
            console.error(`Failed to connect to ${walletType}:`, error);
            alert(`Failed to connect to ${walletType}: ${error.message}`);
        }
    };

    // Initiate Swap (using Squid SDK)
    window.initiateSwap = async () => {
        console.log('Initiating swap...');
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
            // Initialize Squid SDK
            const squid = new Squid({
                baseUrl: "https://apiplus.squidrouter.com",
                integratorId: "YOUR_SQUID_INTEGRATOR_ID" // Replace with your integrator ID
            });
            await squid.init();
            console.log("Initialized Squid SDK");

            // Map chain names to Squid's chain IDs
            const chainMap = {
                "algorand-testnet": "algorand-testnet",
                "ethereum-mainnet": "1",
                "bsc-mainnet": "56"
            };

            // Parameters for the swap
            const params = {
                fromAddress: provider.accounts[0],
                fromChain: chainMap[fromChain],
                fromToken: fromToken === "0x0" ? null : fromToken,
                fromAmount: web3.utils.toWei(fromAmount, 'ether'), // Adjust decimals as needed
                toChain: chainMap[toChain],
                toToken: toToken === "0x0" ? null : toToken,
                toAddress: provider.accounts[0],
                enableBoost: true
            };

            // Get the swap route
            const { route, requestId } = await squid.getRoute(params);
            swapStatus.textContent = 'Quote received. Processing swap...';

            // Approve spending if necessary (for ERC-20 tokens)
            if (fromToken !== "0x0") {
                const erc20Abi = [
                    "function approve(address spender, uint256 amount) public returns (bool)"
                ];
                const tokenContract = new web3.eth.Contract(erc20Abi, fromToken);
                const tx = await tokenContract.methods.approve(
                    route.transactionRequest.target,
                    route.estimate.fromAmount
                ).send({ from: provider.accounts[0] });
                await tx.wait();
                console.log(`Approved ${route.estimate.fromAmount} tokens for ${route.transactionRequest.target}`);
            }

            // Execute the swap
            const tx = await squid.executeRoute({
                signer: provider.accounts[0],
                route
            });
            const txReceipt = await tx.wait();
            const axelarScanLink = "https://axelarscan.io/gmp/" + txReceipt.transactionHash;
            swapStatus.textContent = `Swap completed! Transaction: ${axelarScanLink}`;
        } catch (error) {
            console.error('Swap error:', error);
            swapStatus.textContent = 'Swap failed: ' + error.message;
        }
    };

    // Disconnect WalletConnect session on page unload
    window.addEventListener('unload', async () => {
        if (provider && provider.disconnect) {
            await provider.disconnect();
            console.log('Wallet disconnected');
        }
    });
});
