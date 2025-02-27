document.addEventListener('DOMContentLoaded', () => {
  // SDK가 로드됐는지 확인
  if (typeof PeraWalletConnect !== 'undefined') {
    const peraWallet = new PeraWalletConnect();
    const connectButton = document.getElementById('connectButton');

    connectButton.addEventListener('click', async () => {
      try {
        const accounts = await peraWallet.connect();
        alert(`연결 성공! 계정: ${accounts[0]}`);
      } catch (error) {
        console.error('연결 오류:', error);
        alert('Pera Wallet 연결에 실패했어요. 다시 시도해 주세요.');
      }
    });
  } else {
    console.error('Pera Wallet SDK가 로드되지 않았습니다.');
    alert('Pera Wallet SDK를 로드할 수 없어요. 페이지를 새로고침해 보세요.');
  }
});
