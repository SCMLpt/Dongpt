document.addEventListener('DOMContentLoaded', () => {
    // WalletConnect SDK 확인
    if (typeof WalletConnectProvider === 'undefined') {
        console.error('WalletConnect SDK가 로드되지 않았습니다.');
        return;
    }

    console.log('WalletConnect SDK 로드 성공!');
    
    // WalletConnect 프로바이더 초기화
    const provider = new WalletConnectProvider.default({
        rpc: {
            416002: "https://testnet-api.algonode.cloud" // Algorand TestNet
        },
        chainId: 416002 // Algorand TestNet Chain ID
    });

    const connectButton = document.getElementById('connectButton');
    if (!connectButton) {
        console.error('연결 버튼을 찾을 수 없습니다.');
        return;
    }

    connectButton.addEventListener('click', async () => {
        try {
            // WalletConnect 모달 표시 및 지갑 연결 시도
            await provider.enable();
            console.log('연결된 계정:', provider.accounts);
            if (provider.accounts.length > 0) {
                alert(`Wallet에 연결되었습니다: ${provider.accounts[0]}`);
            } else {
                alert('연결된 계정이 없습니다. 모바일 앱으로 QR 코드를 스캔하세요.');
            }
        } catch (error) {
            console.error('Wallet 연결 오류:', error);
            alert('Wallet 연결에 실패했습니다. 다시 시도하세요.');
        }
    });

    // 페이지 언로드 시 WalletConnect 연결 해제
    window.addEventListener('unload', async () => {
        if (provider) {
            await provider.disconnect();
            console.log('Wallet 연결 해제');
        }
    });
});
