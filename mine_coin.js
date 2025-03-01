// 채굴 로직 초기화
function initMining() {
    // 채굴 상태 초기화
    let miningData = JSON.parse(localStorage.getItem('miningData')) || {
        totalMined: 0,
        miningAttempts: 0,
        history: []
    };

    // 채굴 데이터 표시 업데이트
    function updateMiningDisplay() {
        document.getElementById('totalMined').textContent = miningData.totalMined.toFixed(2);
        document.getElementById('miningAttempts').textContent = miningData.miningAttempts;

        const historyBody = document.getElementById('miningHistoryBody');
        historyBody.innerHTML = '';
        miningData.history.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.timestamp}</td>
                <td>${record.amount.toFixed(2)}</td>
            `;
            historyBody.appendChild(row);
        });
    }

    // 채굴 함수
    function mineCoin() {
        const amountMined = 1; // 1회 채굴당 1코인 (간단히 설정)
        miningData.totalMined += amountMined;
        miningData.miningAttempts += 1;
        miningData.history.push({
            timestamp: new Date().toLocaleString(),
            amount: amountMined
        });

        // 로컬 스토리지에 저장
        localStorage.setItem('miningData', JSON.stringify(miningData));

        // 채굴 데이터 표시 업데이트
        updateMiningDisplay();

        // 네트워크 모니터에 채굴 액션 로그 추가
        window.logAction('Mined Coin');
    }

    // 초기 채굴 데이터 표시
    updateMiningDisplay();

    // Mine 버튼 이벤트 리스너 추가
    const mineButton = document.getElementById('mineButton');
    if (mineButton) {
        mineButton.addEventListener('click', mineCoin);
    }

    // 전역 함수로 노출 (script.js에서 호출 가능)
    window.updateMiningDisplay = updateMiningDisplay;
}

// 페이지 로드 시 채굴 로직 초기화
window.addEventListener('load', initMining);
