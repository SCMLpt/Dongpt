// Pera Wallet 초기화
if (typeof PeraWalletConnect === 'undefined') {
    console.error('Pera Wallet SDK가 로드되지 않았습니다.');
    alert('Pera Wallet SDK를 로드하지 못했습니다. 페이지를 새로고침하거나 지원팀에 문의하세요.');
    return;
}

const peraWallet = new PeraWalletConnect({
    chainId: 416002, // TestNet (MainNet은 416001 사용)
    shouldShowSignTxnToast: true,
});

// Algorand SDK 초기화
if (typeof algosdk === 'undefined') {
    console.error('Algorand SDK가 로드되지 않았습니다.');
    alert('Algorand SDK를 로드하지 못했습니다. 페이지를 새로고침하거나 지원팀에 문의하세요.');
    return;
}

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

// Pera Wallet 연결 버튼 이벤트
document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connectButton');
    if (!connectButton) {
        console.error('연결 버튼이 DOM에 존재하지 않습니다.');
        return;
    }

    connectButton.addEventListener('click', async () => {
        try {
            const accounts = await peraWallet.connect();
            if (accounts.length > 0) {
                alert(`Pera Wallet에 연결되었습니다: ${accounts[0]}`);
                localStorage.setItem('walletAddress', accounts[0]);
                // 연결 후 추가 로직 (예: 자산 스왑 등)
                handleWalletConnection(accounts[0]);
            } else {
                alert('연결된 계정이 없습니다. 모바일 앱으로 QR 코드를 스캔하세요.');
                peraWallet.qrConnect(); // 모바일 QR 코드 연결
            }
        } catch (error) {
            console.error('Pera Wallet 연결 오류:', error);
            alert('Pera Wallet 연결에 실패했습니다. 다시 시도하세요.');
        }
    });
});

// Pera Wallet 연결 해제
window.addEventListener('unload', () => {
    if (peraWallet) {
        peraWallet.disconnect();
        console.log('Pera Wallet 연결 해제');
    }
});

// 연결 후 추가 로직 예시 (예: 자산 스왑)
async function handleWalletConnection(address) {
    try {
        const params = await algodClient.getTransactionParams().do();
        console.log(`연결된 주소: ${address}, 트랜잭션 파라미터:`, params);
        // 여기에 Dongpt 자산 스왑 로직을 추가할 수 있음
    } catch (error) {
        console.error('연결 후 처리 오류:', error);
    }
}
