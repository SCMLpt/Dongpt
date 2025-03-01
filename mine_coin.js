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
        } catch (e) {
            console.error('Invalid shared data:', e);
        }
    }

    function updateNetworkDisplay() {
        document.getElementById('totalMined').textContent = networkData.totalContributions.toFixed(2);
        document.getElementById('miningAttempts').textContent = networkData.actions.length;

        const historyBody = document.getElementById('miningHistoryBody');
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

        window.logAction(`Contribution: ${contributionValue.toFixed(2)} units (${timeTaken}ms)`);
    }

    // 공유 링크 생성 버튼 추가
    const shareButton = document.createElement('button');
    shareButton.textContent = 'Share My Contributions';
    shareButton.addEventListener('click', () => {
        const jsonData = JSON.stringify(networkData);
        const encodedData = btoa(encodeURIComponent(jsonData));
        const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
        navigator.clipboard.writeText(shareUrl);
        alert('Share URL copied to clipboard!');
    });
    document.getElementById('mineCoinsSection').appendChild(shareButton);

    const contributeButton = document.getElementById('mineButton');
    contributeButton.textContent = 'Contribute to Network';
    contributeButton.addEventListener('click', contributeToNetwork);

    updateNetworkDisplay();

    window.updateNetworkDisplay = updateNetworkDisplay;
    window.contributeToNetwork = contributeToNetwork;
}

window.addEventListener('load', initNetworkSharing);
