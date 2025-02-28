document.addEventListener('DOMContentLoaded', () => {
    // SDK 로드 여부 확인

    if (typeof PeraWalletConnect === 'undefined') {
        console.error('Pera Wallet SDK가 로드되지 않았습니다.');
    } else {
        console.log('Pera Wallet SDK가 로드되었습니다.');
        // SDK 초기화 코드 작성
        const peraWallet = new PeraWalletConnect();
        // 여기서 필요한 SDK 기능 사용
    }



    
    if (typeof PeraWalletConnect === 'undefined') {
        console.error('Pera Wallet SDK가 로드되지 않았습니다.');
        alert('Pera Wallet SDK를 로드할 수 없어요. 페이지를 새로고침하거나 인터넷 연결을 확인하세요.');
        return;
    }

    const peraWallet = new PeraWalletConnect({
        chainId: 416002, // TestNet (MainNet은 416001)
        shouldShowSignTxnToast: true,
    });

    const connectButton = document.getElementById('connectButton');
    if (!connectButton) {
        console.error('연결 버튼을 찾을 수 없습니다.');
        return;
    }

    connectButton.addEventListener('click', async () => {
        try {
            const accounts = await peraWallet.connect();
            if (accounts.length > 0) {
                alert(`Pera Wallet에 연결되었습니다: ${accounts[0]}`);
                console.log('연결된 계정:', accounts[0]);
            } else {
                alert('연결된 계정이 없습니다. 모바일 앱으로 QR 코드를 스캔하세요.');
                peraWallet.qrConnect(); // 모바일 연결을 위한 QR 코드 표시
            }
        } catch (error) {
            console.error('Pera Wallet 연결 오류:', error);
            alert('Pera Wallet 연결에 실패했습니다. 다시 시도하세요.');
        }
    });

    // 페이지 언로드 시 연결 해제
    window.addEventListener('unload', () => {
        if (peraWallet) {
            peraWallet.disconnect();
            console.log('Pera Wallet 연결 해제');
        }
    });
});
