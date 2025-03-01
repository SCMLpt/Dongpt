function createMatrixEffect() {
    const matrix = document.createElement('canvas');
    matrix.width = window.innerWidth;
    matrix.height = window.innerHeight;
    
    // 캔버스 스타일 설정
    matrix.style.position = 'fixed';
    matrix.style.top = '0';
    matrix.style.left = '0';
    matrix.style.zIndex = '0'; // z-index를 0으로 설정
    matrix.style.pointerEvents = 'auto'; // 클릭 이벤트 활성화
    
    document.body.appendChild(matrix);
    const ctx = matrix.getContext('2d');
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.fillRect(0, 0, matrix.width, matrix.height);

    // 링크 데이터
    const userLinks = [
        { url: 'https://x.com/KamuiTranslator', displayText: 'KamuiTranslator' },
        { url: 'https://app.tinyman.org/swap?asset_in=0&asset_out=2800093456', displayText: 'Tinyman Swap' },
        { url: 'https://example.com', displayText: 'Example Link' },
    ];

    class Symbol {
        constructor(x, y, isLink = false) {
            this.x = x;
            this.y = y;
            this.isLink = isLink;
            if (isLink) {
                const linkData = userLinks[Math.floor(Math.random() * userLinks.length)];
                this.value = linkData.displayText;
                this.url = linkData.url;
                this.color = '#FFFF00'; // 링크는 노란색
            } else {
                this.value = String.fromCharCode(65 + Math.random() * 57);
                this.color = '#00FF00'; // 기본 심볼은 초록색
            }
            this.speed = 1 + Math.random() * 5;
            ctx.font = '16px monospace';
            this.width = ctx.measureText(this.value).width;
            this.height = 16; // 대략적인 텍스트 높이
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.font = '16px monospace';
            ctx.fillText(this.value, this.x, this.y);
            this.y += this.speed;
            if (this.y > matrix.height) {
                this.y = -20;
                this.x = Math.random() * matrix.width;
                this.isLink = Math.random() < 0.1; // 10% 확률로 링크 심볼
                if (this.isLink) {
                    const linkData = userLinks[Math.floor(Math.random() * userLinks.length)];
                    this.value = linkData.displayText;
                    this.url = linkData.url;
                    this.color = '#FFFF00';
                } else {
                    this.value = String.fromCharCode(65 + Math.random() * 57);
                    this.color = '#00FF00';
                }
                this.width = ctx.measureText(this.value).width;
            }
        }

        isClicked(clickX, clickY) {
            const isWithinBounds = (
                clickX >= this.x &&
                clickX <= this.x + this.width &&
                clickY >= this.y - this.height &&
                clickY <= this.y
            );
            if (isWithinBounds && this.isLink) {
                console.log(`Clicked on link: ${this.value} at (${this.x}, ${this.y})`);
            }
            return isWithinBounds;
        }
    }

    const symbols = [];
    for (let i = 0; i < 100; i++) {
        const isLink = Math.random() < 0.1;
        symbols.push(new Symbol(Math.random() * matrix.width, Math.random() * matrix.height, isLink));
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrix.width, matrix.height);
        symbols.forEach(symbol => symbol.draw());
        requestAnimationFrame(animate);
    }

    matrix.addEventListener('click', (event) => {
        const rect = matrix.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        console.log(`Click at (${clickX}, ${clickY})`);

        symbols.forEach(symbol => {
            if (symbol.isLink && symbol.isClicked(clickX, clickY)) {
                console.log(`Navigating to: ${symbol.url}`);
                window.open(symbol.url, '_blank');
            }
        });
    });

    window.addEventListener('resize', () => {
        matrix.width = window.innerWidth;
        matrix.height = window.innerHeight;
    });

    animate();
}

window.onload = createMatrixEffect;
