// 1. Pera Wallet 라이브러리 가져오기 (CDN 사용)
<script src="https://cdn.jsdelivr.net/npm/@perawallet/connect/dist/index.min.js"></script>

// 2. Pera Wallet 연결 초기화
const peraWallet = new PeraWalletConnect({
  // 네트워크 설정 (TestNet 또는 MainNet)
  network: "testnet" // 필요에 따라 "mainnet"으로 변경
});

// 3. 연결 버튼 이벤트 리스너 추가
document.getElementById("connectPeraWallet").addEventListener("click", async () => {
  try {
    // Pera Wallet에 연결 시도
    const accounts = await peraWallet.connect();
    console.log("연결된 계정:", accounts);
    alert("Pera Wallet에 성공적으로 연결되었습니다!");
  } catch (error) {
    console.error("Pera Wallet 연결 실패:", error);
    alert("Pera Wallet 연결에 실패했습니다. 다시 시도해주세요.");
  }
});

// 4. 연결 해제 (옵션)
function disconnectPeraWallet() {
  peraWallet.disconnect();
  console.log("Pera Wallet 연결이 해제되었습니다.");
}
