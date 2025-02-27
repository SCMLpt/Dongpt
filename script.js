// Pera Wallet SDK를 CDN으로 추가
const peraScript = document.createElement('script');
peraScript.src = 'https://cdn.jsdelivr.net/npm/@perawallet/connect@1/dist/browser/PeraConnect.js';
peraScript.onload = () => {
    console.log('Pera Wallet SDK 로드 완료');
    setTimeout(initializePeraWallet, 1000); // 1초 후 초기화
};
peraScript.onerror = () => {
    console.error('Pera Wallet SDK 로드 실패');
    alert('Pera Wallet SDK를 로드할 수 없습니다. 인터넷 연결을 확인하세요.');
};
document.head.appendChild(peraScript);

let peraWallet;

function initializePeraWallet() {
    if (typeof PeraWalletConnect === 'undefined') {
        console.error('Pera Wallet SDK가 로드되지 않음');
        alert('Pera Wallet SDK가 로드되지 않았습니다. 잠시 후 다시 시도하세요.');
        return;
    }
    peraWallet = new PeraWalletConnect();
    console.log('Pera Wallet 초기화 완료');
}

// Pera Wallet 연결 버튼 이벤트
document.getElementById('connectButton').addEventListener('click', async () => {
    if (!peraWallet) {
        console.error('Pera Wallet 초기화되지 않음');
        alert('Pera Wallet이 초기화되지 않았습니다. 잠시 후 다시 시도하세요.');
        return;
    }
    try {
        const accounts = await peraWallet.connect();
        if (accounts.length > 0) {
            alert(`Pera Wallet 연결 성공: ${accounts[0]}`);
            localStorage.setItem('walletAddress', accounts[0]);
        } else {
            alert('연결된 계정이 없습니다. 다시 시도하세요.');
        }
    } catch (error) {
        console.error('Pera Wallet 연결 오류:', error);
        alert('Pera Wallet 연결에 실패했습니다. 다시 시도하세요.');
    }
});
