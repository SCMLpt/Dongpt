// Algorand Indexer API를 사용하여 Dongpt 홀더 정보를 가져오는 함수
async function fetchDongptHolders() {
    const tableBody = document.querySelector('#dongptExplorerTable tbody');
    if (!tableBody) {
        console.error('Dongpt Explorer table not found.');
        return;
    }

    tableBody.innerHTML = ''; // 테이블 초기화

    try {
        // 자산 정보 가져오기 (소수점 정보 확인)
        const assetId = 2800093456; // Dongpt 자산 ID
        const assetInfoResponse = await fetch(`https://mainnet-idx.algonode.cloud/v2/assets/${assetId}`);
        const assetInfo = await assetInfoResponse.json();
        const decimals = assetInfo.asset.params.decimals || 0;

        // 자산 홀더 정보 가져오기
        const response = await fetch(`https://mainnet-idx.algonode.cloud/v2/assets/${assetId}/balances?limit=10`);
        const data = await response.json();
        const balances = data.balances;

        if (!balances || balances.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2">No holders found.</td></tr>';
            return;
        }

        // 홀더 정보를 테이블에 렌더링
        balances.forEach(holder => {
            const address = holder.address;
            const balance = holder.amount / Math.pow(10, decimals); // 소수점 조정

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${address}</td>
                <td>${balance.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching Dongpt holders:', error);

        // 더미 데이터로 대체 (API 호출이 실패할 경우 테스트용)
        const dummyData = [
            { address: 'ADDRESS1...', amount: 1000 },
            { address: 'ADDRESS2...', amount: 500 },
            { address: 'ADDRESS3...', amount: 300 }
        ];

        // 더미 데이터 호출 로직 (네트워크 모니터링에 표시하기 위해 로그 추가)
        window.logAction('Loaded Dummy Data (Fallback)');

        dummyData.forEach(holder => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${holder.address}</td>
                <td>${holder.amount}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// 전역 함수로 노출 (script.js에서 호출 가능)
window.fetchDongptHolders = fetchDongptHolders;
