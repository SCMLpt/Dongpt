// Add Pera Wallet SDK via CDN with fallback and timeout
const peraScript = document.createElement('script');
peraScript.src = 'https://cdn.jsdelivr.net/npm/@perawallet/connect@1/dist/browser/PeraConnect.js';
peraScript.async = true; // Load asynchronously to prevent blocking
peraScript.onload = () => {
    console.log('Pera Wallet SDK loaded successfully.');
    initializePeraWallet();
};
peraScript.onerror = () => {
    console.error('Failed to load Pera Wallet SDK. Attempting fallback or retry.');
    alert('Failed to load Pera Wallet SDK. Please check your internet connection and try refreshing the page.');
    // Fallback: Try loading from another CDN or retry after a delay
    setTimeout(() => {
        document.head.appendChild(peraScript.cloneNode(true));
    }, 2000);
};
document.head.appendChild(peraScript);

let peraWallet;

function initializePeraWallet() {
    // Wait a moment to ensure the SDK is fully loaded
    setTimeout(() => {
        try {
            if (typeof PeraWalletConnect !== 'undefined') {
                peraWallet = new PeraWalletConnect({
                    chainId: 416002, // TestNet (use 416001 for MainNet)
                    shouldShowSignTxnToast: true,
                });

                // Attempt to reconnect to any previous session
                peraWallet.reconnectSession().then((accounts) => {
                    if (accounts.length > 0) {
                        console.log('Reconnected to Pera Wallet with address:', accounts[0]);
                        alert(`Reconnected to Pera Wallet with address: ${accounts[0]}`);
                        localStorage.setItem('walletAddress', accounts[0]);
                        updateButtonState();
                    }
                }).catch((error) => {
                    console.log('No previous session or reconnection failed:', error);
                });
            } else {
                throw new Error('Pera Wallet SDK not loaded or undefined.');
            }
        } catch (error) {
            console.error('Error initializing Pera Wallet:', error);
            alert('Error initializing Pera Wallet. Please try again or check the console for details.');
        }
    }, 1000); // Wait 1 second to ensure the SDK is ready
}

// Connect Pera Wallet
document.getElementById('connectButton').addEventListener('click', async () => {
    if (!peraWallet) {
        alert('Pera Wallet is not initialized. Please wait and try again.');
        initializePeraWallet();
        return;
    }

    try {
        const accounts = await peraWallet.connect();
        if (accounts.length > 0) {
            console.log('Connected to Pera Wallet with address:', accounts[0]);
            alert(`Connected to Pera Wallet with address: ${accounts[0]}`);
            localStorage.setItem('walletAddress', accounts[0]);
            updateButtonState();
        } else {
            console.log('No accounts connected. Initiating mobile connection flow.');
            alert('No accounts connected. Please use the Pera Wallet mobile app to scan the QR code or follow the deep link.');
            tryMobileConnection();
        }
    } catch (error) {
        console.error('Error connecting to Pera Wallet:', error);
        if (error.message.includes('User rejected') || error.message.includes('cancelled')) {
            alert('Connection cancelled by the user. Please try again.');
        } else {
            console.log('Attempting mobile connection fallback due to error:', error);
            alert('Failed to connect to Pera Wallet. Please ensure Pera Wallet is installed and try again, or scan the QR code with the mobile app.');
            tryMobileConnection();
        }
    }
});

function tryMobileConnection() {
    if (!peraWallet) {
        alert('Pera Wallet is not initialized. Please wait and try again.');
        return;
    }

    try {
        peraWallet.connect().then(() => {
            console.log('Mobile connection flow initiated. Please scan the QR code or follow the deep link with Pera Wallet app.');
        }).catch((error) => {
            console.error('Failed to initiate mobile connection:', error);
            alert('Could not initiate mobile connection. Please open Pera Wallet on your mobile device, scan the QR code, or use the deep link.');
        });
    } catch (error) {
        console.error('Error in mobile connection attempt:', error);
        alert('Error initiating mobile connection. Please try again or contact support.');
    }
}

// Update button state after connection
function updateButtonState() {
    const button = document.getElementById('connectButton');
    button.textContent = 'Disconnect Pera Wallet';
    button.onclick = disconnectPeraWallet;
}

// Disconnect Pera Wallet
function disconnectPeraWallet() {
    if (peraWallet) {
        peraWallet.disconnect();
        localStorage.removeItem('walletAddress');
        console.log('Disconnected from Pera Wallet.');
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

// Fix the matrix background image error (remove or replace the invalid base64 URL)
document.querySelector('.matrix-background').style.background = 'url("https://via.placeholder.com/100?text=Matrix+Pattern") repeat'; // Replace with a valid image URL or remove if not needed
