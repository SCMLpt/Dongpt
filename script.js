// Pera Wallet SDK 동적 로드
const peraScript = document.createElement('script');
peraScript.src = 'https://cdn.jsdelivr.net/npm/@perawallet/connect@1/dist/browser/PeraConnect.js';
peraScript.onload = () => {
    console.log('Pera Wallet SDK 로드 완료');
    // SDK가 로드된 후에 PeraWalletConnect 객체 초기화
    const peraWallet = new PeraWalletConnect();

    // 버튼 클릭 이벤트 리스너 추가
    document.getElementById('connectButton').addEventListener('click', async () => {
        try {
            const accounts = await peraWallet.connect();
            if (accounts.length > 0) {
                alert(`연결 성공: ${accounts[0]}`);
                localStorage.setItem('walletAddress', accounts[0]);
            } else {
                alert('연결된 계정이 없습니다.');
            }
        } catch (error) {
            console.error('Pera Wallet 연결 오류:', error);
            alert('Pera Wallet 연결 실패. 다시 시도하세요.');
        }
    });
};
peraScript.onerror = () => {
    console.error('Pera Wallet SDK 로드 실패');
    alert('Pera Wallet SDK를 로드하지 못했습니다. 인터넷 연결을 확인하세요.');
};
document.head.appendChild(peraScript);
