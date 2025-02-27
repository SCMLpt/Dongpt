document.addEventListener("DOMContentLoaded", function() {
    const peraWallet = new PeraWalletConnect();
    const connectButton = document.getElementById("connectButton");
    connectButton.addEventListener("click", async function() {
        try {
            const accounts = await peraWallet.connect();
            alert("연결 성공: " + accounts[0]);
        } catch (error) {
            alert("Pera Wallet 연결 오류: " + error.message);
        }
    });
});
