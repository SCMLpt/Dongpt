// Algorand API를 사용하여 Dongpt 홀더 정보를 가져오는 함수
async function fetchDongptHolders() {
    const tableBody = document.querySelector('#dongptExplorerTable tbody');
    if (!tableBody) {
        console.error('Dongpt Explorer table not found.');
        return;
    }

    tableBody.innerHTML = ''; // 테이블 초기화

    try {
        // Algorand Indexer API를 사용하여 자산 정보 가져오기
        const assetId = '2800093456'; // Dongpt 자산 ID
        const response = await fetch(`https://algoindexer.algoexplorerapi.io/v2/assets/${assetId}/balances?limit=10`);
        const data = await response.json();

        if (!data.balances || data.balances.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2">No holders found.</td></tr>';
            return;
        }

        // 홀더 정보를 테이블에 렌더링
        data.balances.forEach(holder => {
            const address = holder.address;
            const balance = holder.amount; // Algorand의 경우 소수점 조정이 필요할 수 있음

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${address}</td>
                <td>${balance}</td>
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

// 페이지 로드 시 데이터 자동 로드
window.onload = function() {
    fetchDongptHolders();
};
