document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connectButton');
    const walletModal = document.getElementById('walletModal');
    const walletOptions = document.getElementById('walletOptions');

    if (!connectButton) {
        console.error('Connect button not found.');
        return;
    }

    // WalletConnect 초기화
    let walletConnectProvider = null;
    if (typeof WalletConnectProvider !== 'undefined') {
        walletConnectProvider = new WalletConnectProvider.default({
            rpc: {
                416002: "https://testnet-api.algonode.cloud" // Algorand TestNet
            },
            chainId: 416002
        });
        console.log('WalletConnect SDK loaded successfully!');
    } else {
        console.error('WalletConnect SDK failed to load.');
    }

    // 모달 표시
    connectButton.addEventListener('click', () => {
        walletModal.style.display = 'flex';
    });

    // 지갑 선택 처리
    walletOptions.addEventListener('click', async (event) => {
        const selectedWallet = event.target.getAttribute('data-wallet');
        if (!selectedWallet) return;

        walletModal.style.display = 'none'; // 모달 닫기

        try {
            if (selectedWallet === 'walletconnect' && walletConnectProvider) {
                await walletConnectProvider.enable();
                console.log('Connected accounts (WalletConnect):', walletConnectProvider.accounts);
                if (walletConnectProvider.accounts.length > 0) {
                    alert(`Connected to WalletConnect: ${walletConnectProvider.accounts[0]}`);
                } else {
                    alert('No accounts connected. Please scan the QR code with a mobile app.');
                }
            } else if (selectedWallet === 'metamask') {
                if (typeof window.ethereum !== 'undefined') {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Connected accounts (MetaMask):', accounts);
                    if (accounts.length > 0) {
                        alert(`Connected to MetaMask: ${accounts[0]}`);
                    } else {
                        alert('No accounts connected via MetaMask.');
                    }
                } else {
                    alert('MetaMask is not installed. Please install it to connect.');
                }
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('Failed to connect to wallet. Please try again.');
        }
    });

    // 페이지 언로드 시 WalletConnect 연결 해제
    window.addEventListener('unload', async () => {
        if (walletConnectProvider) {
            await walletConnectProvider.disconnect();
            console.log('Wallet disconnected');
        }
    });
});
