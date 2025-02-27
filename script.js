// Example: Swap Dongpt (ASA) with another token
async function swapDongpt() {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
        alert('Please connect your Pera Wallet first.');
        return;
    }

    // Initialize Algorand client (use TestNet or MainNet)
    const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', ''); // Replace with your node
    const params = await algodClient.getTransactionParams().do();

    // Example: Send a payment transaction (replace with ASA swap logic)
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: 'recipient-address', // Replace with the recipient or smart contract address
        amount: 1000000, // 1 ALGO (in microAlgos, 1 ALGO = 1,000,000 microAlgos)
        suggestedParams: params,
    });

    // Sign and send the transaction using Pera Wallet
    const signedTxn = await peraWallet.signTransaction([txn.toByte()]);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    alert(`Transaction sent with ID: ${txId}`);
}

// Add a swap button or call this function after connecting
document.getElementById('swapButton')?.addEventListener('click', swapDongpt);
