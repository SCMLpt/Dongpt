// Pera Wallet 객체 생성
const peraWallet = new PeraWalletConnect();

// 버튼 클릭 이벤트 추가
document.getElementById('connectButton').addEventListener('click', async () => {
  try {
    const accounts = await peraWallet.connect();
    alert(`연결 성공: ${accounts[0]}`);
  } catch (error) {
    console.error('연결 오류:', error);
    alert('Pera Wallet 연결 실패');
  }
});
