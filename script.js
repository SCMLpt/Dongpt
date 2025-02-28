document.addEventListener('DOMContentLoaded', async () => {
    const connectButton = document.getElementById('connectButton');
    const walletModal = document.getElementById('walletModal');
    const walletOptions = document.getElementById('walletOptions');
    const swapButton = document.getElementById('swapButton');
    const chainSelect = document.getElementById('chainSelect');
    const fromToken = document.getElementById('fromToken');
    const toToken = document.getElementById('toToken');
    const amount = document.getElementById('amount');
    const swapSection = document.getElementById('swapSection');
    const portfolioSection = document.getElementById('portfolioSection');
    const buySection = document.getElementById('buySection');
    const founderSection = document.getElementById('founderSection');
    const statsSection = document.getElementById('statsSection');
    const statsTitle = document.getElementById('statsTitle');
    const portfolioTableBody = document.querySelector('#portfolioTable tbody');
    const menuLinks = document.querySelectorAll('.menu-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (!connectButton || !swapButton) {
        console.error('Button not found.');
        return;
    }

    // 지갑 상태 변수
    let walletConnectProvider = null;
    let connectedWallet = null;
    let connectedAccount = null;
    let provider = null;
    let activityChart = null;

    // Uniswap V2 Router 정보 (Ethereum MainNet)
    const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    const UNISWAP_ROUTER_ABI = [
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ];

    // 토큰 주소 (MainNet과 Sepolia)
    const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH (MainNet)
    const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI (MainNet)
    const WETH_SEPOLIA = '0x7b79995e5f9c58666d53eBb67F422f9B7fD4EcA6'; // WETH (Sepolia)
    const DAI_SEPOLIA = '0xFF34B3d4AeeFDde989b3eA9bF939CdaA41C9F4D2'; // DAI (Sepolia)

    // ERC-20 ABI (balanceOf 메서드 포함)
    const ERC20_ABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function approve(address spender, uint256 amount) external returns (bool)',
        'function decimals() view returns (uint8)'
    ];

    // WalletConnect 초기화
    if (typeof WalletConnectProvider !== 'undefined') {
        walletConnectProvider = new WalletConnectProvider.default({
            rpc: {
                1: "https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY",
                11155111: "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
            }
        });
        console.log('WalletConnect SDK loaded successfully!');
    } else {
        console.error('WalletConnect SDK failed to load.');
    }

    // 메뉴 클릭 시 섹션 전환
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section === 'swap') {
                swapSection.classList.add('active');
                portfolioSection.classList.remove('active');
                buySection.classList.remove('active');
                founderSection.classList.remove('active');
                statsSection.classList.remove('active');
            } else if (section === 'portfolio') {
                swapSection.classList.remove('active');
                portfolioSection.classList.add('active');
                buySection.classList.remove('active');
                founderSection.classList.remove('active');
                statsSection.classList.remove('active');
                if (connectedAccount) {
                    fetchPortfolio();
                } else {
                    alert('Please connect a wallet to view your portfolio.');
                }
            } else if (section === 'buy') {
                swapSection.classList.remove('active');
                portfolioSection.classList.remove('active');
                buySection.classList.add('active');
                founderSection.classList.remove('active');
                statsSection.classList.remove('active');
            } else if (section === 'founder') {
                swapSection.classList.remove('active');
                portfolioSection.classList.remove('active');
                buySection.classList.remove('active');
                founderSection.classList.add('active');
                statsSection.classList.remove('active');
            } else if (section === 'stats') {
                swapSection.classList.remove('active');
                portfolioSection.classList.remove('active');
                buySection.classList.remove('active');
                founderSection.classList.remove('active');
                statsSection.classList.add('active');
                statsTitle.textContent = 'Stats'; // 기본 제목
            } else {
                swapSection.classList.remove('active');
                portfolioSection.classList.remove('active');
                buySection.classList.remove('active');
                founderSection.classList.remove('active');
                statsSection.classList.remove('active');
            }
        });
    });

    // 드롭다운 항목 클릭 시
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const statsType = item.getAttribute('data-stats');
            if (statsType) {
                swapSection.classList.remove('active');
                portfolioSection.classList.remove('active');
                buySection.classList.remove('active');
                founderSection.classList.remove('active');
                statsSection.classList.add('active');
                statsTitle.textContent = item.textContent;

                if (statsType === 'activity') {
                    showActivityChart();
                } else {
                    // 다른 Stats 항목에 대한 처리 (미래 확장 가능)
                    statsTitle.textContent = item.textContent;
                }
            }
        });
    });

    // Activity 차트 표시 함수
    function showActivityChart() {
        if (activityChart) {
            activityChart.destroy(); // 기존 차트 제거
        }

        const ctx = document.getElementById('activityChart').getContext('2d');
        activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['May 13, 2023', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan 2024', 'Feb', 'Today'],
                datasets: [{
                    label: 'Social Interactions',
                    data: [50000000, 25000000, 75000000, 100000000, 25000000, 50000000, 10000000, 5000000, 15000000, 30000000, 26738259],
                    borderColor: '#00BFFF',
                    backgroundColor: 'rgba(0, 191, 255, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#00FF00',
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return (value / 1000000) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000) + 'K';
                                }
                                return value;
                            }
                        },
                        grid: {
                            color: 'rgba(0, 255, 0, 0.2)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#00FF00'
                        },
                        grid: {
                            color: 'rgba(0, 255, 0, 0.2)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#00FF00'
                        }
                    }
                }
            }
        });
    }

    // 모달 표시
    connectButton.addEventListener('click', () => {
        walletModal.style.display = 'flex';
    });

    // 지갑 선택 처리
    walletOptions.addEventListener('click', async (event) => {
        const selectedWallet = event.target.getAttribute('data-wallet');
        if (!selectedWallet) return;

        walletModal.style.display = 'none';

        try {
            if (selectedWallet === 'walletconnect' && walletConnectProvider) {
                await walletConnectProvider.enable();
                connectedWallet = 'walletconnect';
                connectedAccount = walletConnectProvider.accounts[0];
                provider = new ethers.providers.Web3Provider(walletConnectProvider);
                console.log('Connected accounts (WalletConnect):', walletConnectProvider.accounts);
                if (walletConnectProvider.accounts.length > 0) {
                    alert(`Connected to WalletConnect: ${connectedAccount}`);
                    connectButton.textContent = `Connected: ${connectedAccount.slice(0, 6)}...`;
                } else {
                    alert('No accounts connected. Please scan the QR code.');
                }
            } else if (selectedWallet === 'metamask') {
                if (typeof window.ethereum !== 'undefined') {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    connectedWallet = 'metamask';
                    connectedAccount = accounts[0];
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    console.log('Connected accounts (MetaMask):', accounts);
                    if (accounts.length > 0) {
                        alert(`Connected to MetaMask: ${connectedAccount}`);
                        connectButton.textContent = `Connected: ${connectedAccount.slice(0, 6)}...`;
                    } else {
                        alert('No accounts connected via MetaMask.');
                    }
                } else {
                    alert('MetaMask is not installed.');
                }
            }
            // 지갑 연결 후 포트폴리오가 열려있다면 업데이트
            if (portfolioSection.classList.contains('active')) {
                fetchPortfolio();
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('Failed to connect to wallet.');
        }
    });

    // 스왑 버튼 클릭 시
    swapButton.addEventListener('click', async () => {
        if (!connectedAccount || !provider) {
            walletModal.style.display = 'flex';
            alert('Please connect a wallet to perform a swap.');
            return;
        }

        const chainId = parseInt(chainSelect.value);
        const from = fromToken.value.toUpperCase();
        const to = toToken.value.toUpperCase();
        const swapAmount = amount.value;

        if (!from || !to || !swapAmount) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            // 네트워크 확인
            const network = await provider.getNetwork();
            if (network.chainId !== chainId) {
                alert(`Please switch to ${chainId === 1 ? 'Ethereum MainNet' : 'Sepolia'} in your wallet.`);
                return;
            }

            // 토큰 주소 설정
            const fromAddress = (chainId === 1 && from === 'WETH') ? WETH_ADDRESS : (chainId === 11155111 && from === 'WETH') ? WETH_SEPOLIA : null;
            const toAddress = (chainId === 1 && to === 'DAI') ? DAI_ADDRESS : (chainId === 11155111 && to === 'DAI') ? DAI_SEPOLIA : null;

            if (!fromAddress || !toAddress) {
                alert('Unsupported token pair. Use WETH and DAI for this example.');
                return;
            }

            const signer = provider.getSigner();
            const routerContract = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, signer);

            // 스왑 파라미터 설정
            const amountIn = ethers.utils.parseEther(swapAmount);
            const amountOutMin = 0;
            const path = [fromAddress, toAddress];
            const to = connectedAccount;
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

            // 토큰 승인
            const tokenContract = new ethers.Contract(fromAddress, ERC20_ABI, signer);
            const approveTx = await tokenContract.approve(UNISWAP_ROUTER_ADDRESS, amountIn);
            await approveTx.wait();
            console.log('Token approved for swap');

            // 스왑 실행
            const swapTx = await routerContract.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                to,
                deadline,
                { gasLimit: 300000 }
            );
            console.log('Swap transaction sent:', swapTx.hash);
            await swapTx.wait();
            alert(`Swap completed! Tx Hash: ${swapTx.hash}`);
        } catch (error) {
            console.error('Swap error:', error);
            alert(`Swap failed: ${error.message}`);
        }
    });

    // 포트폴리오 조회 함수
    async function fetchPortfolio() {
        if (!connectedAccount || !provider) return;

        portfolioTableBody.innerHTML = ''; // 테이블 초기화

        const tokens = [
            { name: 'WETH', address: chainSelect.value === '1' ? WETH_ADDRESS : WETH_SEPOLIA },
            { name: 'DAI', address: chainSelect.value === '1' ? DAI_ADDRESS : DAI_SEPOLIA }
        ];

        for (const token of tokens) {
            try {
                const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
                const balance = await tokenContract.balanceOf(connectedAccount);
                const decimals = await tokenContract.decimals();
                const formattedBalance = ethers.utils.formatUnits(balance, decimals);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${token.name}</td>
                    <td>${formattedBalance}</td>
                `;
                portfolioTableBody.appendChild(row);
            } catch (error) {
                console.error(`Error fetching balance for ${token.name}:`, error);
            }
        }
    }

    // 페이지 언로드 시 WalletConnect 연결 해제
    window.addEventListener('unload', async () => {
        if (walletConnectProvider) {
            await walletConnectProvider.disconnect();
            console.log('Wallet disconnected');
        }
    });
});
