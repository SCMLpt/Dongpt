function initNetworkSharing() {
    let networkData = JSON.parse(localStorage.getItem('networkData')) || {
        participantId: `user-${Math.random().toString(36).substr(2, 9)}`,
        totalContributions: 0,
        lastUpdated: new Date().toISOString(),
        actions: []
    };

    // URL에서 공유된 데이터 불러오기
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    let sharedActions = [];
    if (sharedData) {
        try {
            sharedActions = JSON.parse(decodeURIComponent(atob(sharedData))).actions || [];
            console.log('Shared actions loaded:', sharedActions);
        } catch (e) {
            console.error('Invalid shared data:', e);
        }
    }

    function updateNetworkDisplay() {
        const totalMinedElement = document.getElementById('totalMined');
        const miningAttemptsElement = document.getElementById('miningAttempts');
        const historyBody = document.getElementById('miningHistoryBody');

        if (!totalMinedElement || !miningAttemptsElement || !historyBody) {
            console.error('Required elements not found for updateNetworkDisplay');
            return;
        }

        totalMinedElement.textContent = networkData.totalContributions.toFixed(2);
        miningAttemptsElement.textContent = networkData.actions.length;

        historyBody.innerHTML = '';

        // 내 기록 표시
        networkData.actions.forEach(action => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${action.timestamp}</td>
                <td>${action.description} (You)</td>
            `;
            historyBody.appendChild(row);
        });

        // 공유된 다른 사용자 기록 표시
        sharedActions.forEach(action => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${action.timestamp}</td>
                <td>${action.description} (Shared)</td>
            `;
            historyBody.appendChild(row);
        });
    }

    function contributeToNetwork() {
        const startTime = Date.now();
        let contributionValue = Math.random() * 10;
        for (let i = 0; i < 100000; i++) {
            contributionValue += Math.sin(i) * 0.01;
        }
        const timeTaken = Date.now() - startTime;

        networkData.totalContributions += contributionValue;
        networkData.lastUpdated = new Date().toISOString();
        networkData.actions.push({
            timestamp: new Date().toLocaleString(),
            description: `Contributed ${contributionValue.toFixed(2)} units (${timeTaken}ms)`,
            contributionValue: contributionValue
        });

        if (networkData.actions.length > 50) {
            networkData.actions.shift();
        }

        localStorage.setItem('networkData', JSON.stringify(networkData));
        updateNetworkDisplay();

        if (window.logAction) {
            window.logAction(`Contribution: ${contributionValue.toFixed(2)} units (${timeTaken}ms)`);
        } else {
            console.warn('window.logAction is not defined');
        }
    }

    // 버튼 설정
    const contributeButton = document.getElementById('mineButton');
    if (!contributeButton) {
        console.error('Contribute button not found');
        return;
    }
    contributeButton.textContent = 'Contribute to Network';
    contributeButton.addEventListener('click', contributeToNetwork);

    // 공유 링크 생성 버튼 추가
    const mineCoinsSection = document.getElementById('mineCoinsSection');
    if (!mineCoinsSection) {
        console.error('mineCoinsSection not found');
        return;
    }

    let shareButton = document.getElementById('shareButton');
    if (!shareButton) {
        shareButton = document.createElement('button');
        shareButton.id = 'shareButton';
        shareButton.textContent = 'Share My Contributions';
        mineCoinsSection.appendChild(shareButton);
        console.log('Share button created and appended');
    } else {
        console.log('Share button already exists');
    }

    shareButton.addEventListener('click', () => {
        const jsonData = JSON.stringify(networkData);
        const encodedData = btoa(encodeURIComponent(jsonData));
        const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Share URL copied to clipboard!');
            console.log('Share URL:', shareUrl);
        }).catch(err => {
            console.error('Failed to copy URL:', err);
            alert('Failed to copy URL. Please copy it manually: ' + shareUrl);
        });
    });

    updateNetworkDisplay();

    window.updateNetworkDisplay = updateNetworkDisplay;
    window.contributeToNetwork = contributeToNetwork;
}

window.addEventListener('load', () => {
    console.log('mine_coins.js loaded');
    initNetworkSharing();
});
