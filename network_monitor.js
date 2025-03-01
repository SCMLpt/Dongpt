// 네트워크 요청 모니터링 및 시각화
(function () {
    // 네트워크 모니터 요소
    const networkMonitor = document.getElementById('networkMonitor');
    const networkRequests = document.getElementById('networkRequests');
    const networkFlowCanvas = document.getElementById('networkFlowCanvas');
    const ctx = networkFlowCanvas.getContext('2d');

    // 네트워크 요청 로그
    const requestLogs = [];

    // 원본 fetch 함수 저장
    const originalFetch = window.fetch;

    // fetch 함수 래핑
    window.fetch = async (...args) => {
        const startTime = Date.now();
        const requestInfo = {
            method: args[1]?.method || 'GET',
            url: args[0],
            status: 'Pending',
            statusCode: null,
            duration: null,
            timestamp: new Date().toLocaleTimeString(),
            target: new URL(args[0]).hostname // 요청을 받는 서버 이름
        };

        // 요청 로그 추가
        addRequestLog(requestInfo);

        try {
            const response = await originalFetch(...args);
            const endTime = Date.now();

            // 응답 정보 업데이트
            requestInfo.status = 'Success';
            requestInfo.statusCode = response.status;
            requestInfo.duration = endTime - startTime;
            updateRequestLog(requestInfo);

            return response;
        } catch (error) {
            const endTime = Date.now();

            // 에러 정보 업데이트
            requestInfo.status = 'Failed';
            requestInfo.statusCode = 'Error';
            requestInfo.duration = endTime - startTime;
            updateRequestLog(requestInfo);

            throw error;
        }
    };

    // 사용자 액션 추적 (전역 함수로 노출)
    window.logAction = function(action) {
        const actionInfo = {
            action: action,
            timestamp: new Date().toLocaleTimeString()
        };
        addRequestLog(actionInfo);
    };

    // 요청 로그 추가
    function addRequestLog(info) {
        requestLogs.push(info);
        renderNetworkRequests();
    }

    // 요청 로그 업데이트
    function updateRequestLog(updatedInfo) {
        const index = requestLogs.findIndex(log => log === updatedInfo);
        if (index !== -1) {
            requestLogs[index] = updatedInfo;
            renderNetworkRequests();
        }
    }

    // 네트워크 요청 렌더링
    function renderNetworkRequests() {
        networkRequests.innerHTML = '';

        requestLogs.forEach(log => {
            const requestDiv = document.createElement('div');
            requestDiv.className = 'request';

            if (log.action) {
                // 사용자 액션 로그
                requestDiv.innerHTML = `
                    <p>[${log.timestamp}] Action: ${log.action}</p>
                `;
            } else {
                // 네트워크 요청 로그
                const statusColor = log.status === 'Success' ? '#00FF00' : log.status === 'Failed' ? '#FF0000' : '#FFFF00';
                requestDiv.innerHTML = `
                    <p>[${log.timestamp}] Request: ${log.method} ${log.url}</p>
                    <p>Target: ${log.target}</p>
                    <p>Status: <span style="color: ${statusColor}">${log.status} (${log.statusCode || 'Pending'})</span></p>
                    <p>Duration: ${log.duration ? log.duration + 'ms' : 'Pending'}</p>
                    <p>Flow: Client -> ${log.target}</p>
                `;
            }

            networkRequests.prepend(requestDiv);
        });

        // 최근 요청을 기준으로 흐름 시각화
        const latestRequest = requestLogs.filter(log => !log.action).slice(-1)[0];
        drawNetworkFlow(latestRequest);
    }

    // 네트워크 흐름 시각화
    function drawNetworkFlow(request) {
        ctx.clearRect(0, 0, networkFlowCanvas.width, networkFlowCanvas.height);

        // 배경
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, networkFlowCanvas.width, networkFlowCanvas.height);

        if (!request) {
            // 기본 흐름 (요청이 없을 경우)
            ctx.beginPath();
            ctx.arc(50, 25, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Client', 50, 30);

            ctx.beginPath();
            ctx.arc(150, 25, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.fillText('Server', 150, 30);

            ctx.beginPath();
            ctx.moveTo(65, 25);
            ctx.lineTo(135, 25);
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(135, 15);
            ctx.lineTo(145, 25);
            ctx.lineTo(135, 35);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
            return;
        }

        // 클라이언트 (원)
        ctx.beginPath();
        ctx.arc(50, 25, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Client', 50, 30);

        // 서버 (원)
        ctx.beginPath();
        ctx.arc(150, 25, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillText('Server', 150, 30);

        // 화살표 (클라이언트 -> 서버)
        ctx.beginPath();
        ctx.moveTo(65, 25);
        ctx.lineTo(135, 25);
        ctx.strokeStyle = request.status === 'Failed' ? '#FF0000' : '#00FF00';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 화살표 머리 또는 X 표시
        if (request.status === 'Failed') {
            // X 표시
            ctx.beginPath();
            ctx.moveTo(90, 15);
            ctx.lineTo(110, 35);
            ctx.moveTo(110, 15);
            ctx.lineTo(90, 35);
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 더미 데이터 호출 흐름 (꼬리 화살표)
            ctx.beginPath();
            ctx.arc(150, 75, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.fillText('Local', 150, 80);

            ctx.beginPath();
            ctx.moveTo(65, 40);
            ctx.lineTo(135, 70);
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(135, 60);
            ctx.lineTo(145, 70);
            ctx.lineTo(135, 80);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
        } else {
            // 화살표 머리
            ctx.beginPath();
            ctx.moveTo(135, 15);
            ctx.lineTo(145, 25);
            ctx.lineTo(135, 35);
            ctx.fillStyle = '#00FF00';
            ctx.fill();
        }
    }

    // 초기 사용자 액션 로그 (페이지 로드)
    window.logAction('Page Loaded');

    // 메뉴 클릭 시 액션 로그 추가
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            window.logAction(`Clicked Menu: ${section}`);
        });
    });

    // 초기 네트워크 흐름 그리기
    drawNetworkFlow();
})();
