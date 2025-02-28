document.addEventListener('DOMContentLoaded', () => {
    // Check if WalletConnect SDK is loaded
    if (typeof WalletConnectProvider === 'undefined') {
        console.error('WalletConnect SDK failed to load.');
        return;
    }

    console.log('WalletConnect SDK loaded successfully!');
    
    // Initialize WalletConnect Provider
    const provider = new WalletConnectProvider.default({
        rpc: {
            416002: "https://testnet-api.algonode.cloud" // Algorand TestNet
        },
        chainId: 416002 // Algorand TestNet Chain ID
    });

    const connectButton = document.getElementById('connectButton');
    if (!connectButton) {
        console.error('Connect button not found.');
        return;
    }

    connectButton.addEventListener('click', async () => {
        try {
            // Show WalletConnect modal and attempt to connect to a wallet
            await provider.enable();
            console.log('Connected accounts:', provider.accounts);
            if (provider.accounts.length > 0) {
                alert(`Connected to wallet: ${provider.accounts[0]}`);
            } else {
                alert('No accounts connected. Please scan the QR code with a mobile app.');
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('Failed to connect to wallet. Please try again.');
        }
    });

    // Disconnect WalletConnect session on page unload
    window.addEventListener('unload', async () => {
        if (provider) {
            await provider.disconnect();
            console.log('Wallet disconnected');
        }
    });
});
