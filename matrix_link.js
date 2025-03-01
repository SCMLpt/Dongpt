function createMatrixEffect() {
    const matrix = document.createElement('canvas');
    matrix.width = window.innerWidth;
    matrix.height = window.innerHeight;
    document.body.appendChild(matrix);
    const ctx = matrix.getContext('2d');
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.fillRect(0, 0, matrix.width, matrix.height);

    // 링크 데이터 (사용자 링크 목록)
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
            return (
                clickX >= this.x &&
                clickX <= this.x + this.width &&
                clickY >= this.y - this.height &&
                clickY <= this.y
            );
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

        symbols.forEach(symbol => {
            if (symbol.isLink && symbol.isClicked(clickX, clickY)) {
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
