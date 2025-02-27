// Add Pera Wallet SDK via CDN
const peraScript = document.createElement('script');
peraScript.src = 'https://cdn.jsdelivr.net/npm/@perawallet/connect@1/dist/browser/PeraConnect.js';
peraScript.onload = () => {
    initializePeraWallet();
};
peraScript.onerror = () => {
    console.error('Failed to load Pera Wallet SDK. Please check your internet connection.');
    alert('Failed to load Pera Wallet SDK. Please refresh the page and try again.');
};
document.head.appendChild(peraScript);

let peraWallet;

function initializePeraWallet() {
    peraWallet = new PeraWalletConnect({
        // Optional: Customize the connection settings
        chainId: 416002, // TestNet (use 416001 for MainNet)
        shouldShowSignTxnToast: true,
    });

    // Handle reconnection (if user has previously connected)
    peraWallet.reconnectSession().catch((e) => {
        console.log('No previous session found or reconnection failed:', e);
    });
}

// Connect Pera Wallet
document.getElementById('connectButton').addEventListener('click', async () => {
    try {
        const accounts = await peraWallet.connect();
        if (accounts.length > 0) {
            alert(`Connected to Pera Wallet with address: ${accounts[0]}`);
            localStorage.setItem('walletAddress', accounts[0]);
            // Optionally, update the UI to show the connected address or a disconnect button
            document.getElementById('connectButton').textContent = 'Disconnect Pera Wallet';
            document.getElementById('connectButton').onclick = disconnectPeraWallet;
        } else {
            alert('No accounts connected. Please try again or use the mobile app.');
        }
    } catch (error) {
        console.error('Error connecting to Pera Wallet:', error);
        if (error.message.includes('User rejected') || error.message.includes('cancelled')) {
            alert('Connection cancelled by the user. Please try again.');
        } else {
            alert('Failed to connect to Pera Wallet. Please ensure Pera Wallet is installed and try again.');
            // Try to initiate mobile connection flow manually
            tryMobileConnection();
        }
    }
});

function tryMobileConnection() {
    peraWallet.connect().then(() => {
        // Pera Wallet should automatically display a QR code or deep link for mobile connection
        console.log('Mobile connection flow initiated. Scan the QR code with Pera Wallet app.');
    }).catch((error) => {
        console.error('Failed to initiate mobile connection:', error);
        alert('Could not initiate mobile connection. Please open Pera Wallet on your mobile device and scan the QR code or use the deep link.');
    });
}

// Disconnect Pera Wallet
function disconnectPeraWallet() {
    if (peraWallet) {
        peraWallet.disconnect();
        localStorage.removeItem('walletAddress');
        alert('Disconnected from Pera Wallet.');
        document.getElementById('connectButton').textContent = 'Connect Pera Wallet';
        document.getElementById('connectButton').onclick = () => peraWallet.connect();
    }
}

// Clean up on page unload
window.addEventListener('unload', () => {
    if (peraWallet) {
        peraWallet.disconnect();
    }
});

// Matrix effect (keep your existing matrix effect code here)
function createMatrixEffect() {
    const matrix = document.createElement('canvas');
    matrix.width = window.innerWidth;
    matrix.height = window.innerHeight;
    document.body.appendChild(matrix);
    const ctx = matrix.getContext('2d');
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.fillRect(0, 0, matrix.width, matrix.height);

    class Symbol {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.value = String.fromCharCode(65 + Math.random() * 57);
            this.speed = 1 + Math.random() * 5;
        }
        draw() {
            ctx.fillStyle = '#00FF00';
            ctx.fillText(this.value, this.x, this.y);
            this.y += this.speed;
            if (this.y > matrix.height) {
                this.y = -20;
                this.x = Math.random() * matrix.width;
            }
        }
    }

    const symbols = [];
    for (let i = 0; i < 100; i++) {
        symbols.push(new Symbol(Math.random() * matrix.width, Math.random() * matrix.height));
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrix.width, matrix.height);
        symbols.forEach(symbol => symbol.draw());
        requestAnimationFrame(animate);
    }
    animate();
}

window.onload = createMatrixEffect;
