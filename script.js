document.addEventListener('DOMContentLoaded', () => {
    if (typeof PeraWalletConnect !== 'undefined') {
        const peraWallet = new PeraWalletConnect();
        document.getElementById('connectButton').addEventListener('click', async () => {
            try {
                const accounts = await peraWallet.connect();
                alert(`연결 성공: ${accounts[0]}`);
            } catch (error) {
                console.error('연결 오류:', error);
                alert('Pera Wallet 연결 실패');
            }
        });
    } else {
        console.error('Pera Wallet SDK가 로드되지 않았습니다.');
        alert('Pera Wallet SDK를 로드할 수 없어요. 페이지를 새로고침해 보세요.');
    }
});
