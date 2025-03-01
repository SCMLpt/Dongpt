function createMatrixEffect() {
    const matrix = document.createElement('canvas');
    matrix.width = window.innerWidth;
    matrix.height = window.innerHeight;
    
    // 캔버스 스타일 설정
    matrix.style.position = 'fixed';
    matrix.style.top = '0';
    matrix.style.left = '0';
    matrix.style.zIndex = '0';
    matrix.style.pointerEvents = 'auto';
    
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

    // 로고 이미지 로드
    const logoImage = new Image();
    logoImage.src = 'https://scmlpt.github.io/Dongpt/logo.png';
    const logoWidth = 30; // 로고 크기 조정
    const logoHeight = 30;

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
            this.speed = 0.5 + Math.random() * 1.5; // 느린 속도
            ctx.font = '16px monospace';
            this.width = ctx.measureText(this.value).width;
            this.height = this.isLink ? this.value.length * 16 : 16; // 세로 텍스트 높이 계산
            this.logoWidth = logoWidth;
            this.logoHeight = logoHeight;
            this.totalHeight = this.isLink ? this.height + this.logoHeight + 5 : this.height; // 로고와 텍스트 간 간격 포함
        }

        draw() {
            if (this.isLink) {
                // 세로 텍스트 그리기
                ctx.fillStyle = this.color;
                ctx.font = '16px monospace';
                for (let i = 0; i < this.value.length; i++) {
                    const charY = this.y + i * 16; // 글자마다 세로로 위치 조정
                    ctx.fillText(this.value[i], this.x, charY);
                }

                // 로고 이미지 그리기 (텍스트 아래)
                if (logoImage.complete) {
                    const logoY = this.y + this.value.length * 16 + 5; // 텍스트 아래 5px 간격
                    ctx.drawImage(logoImage, this.x, logoY, this.logoWidth, this.logoHeight);
                }
            } else {
                // 일반 심볼은 기존처럼 수평으로 표시
                ctx.fillStyle = this.color;
                ctx.font = '16px monospace';
                ctx.fillText(this.value, this.x, this.y);
            }

            this.y += this.speed;
            if (this.y >= matrix.height) {
                this.y = -this.totalHeight; // 심볼이 화면 밖으로 나가면 위로 리셋
                this.x = Math.random() * matrix.width;
                this.isLink = Math.random() < 0.1;
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
                this.height = this.isLink ? this.value.length * 16 : 16;
                this.totalHeight = this.isLink ? this.height + this.logoHeight + 5 : this.height;
            }
        }

        isClicked(clickX, clickY) {
            const isWithinBounds = (
                clickX >= this.x &&
                clickX <= this.x + Math.max(this.width, this.logoWidth) &&
                clickY >= this.y &&
                clickY <= this.y + this.totalHeight
            );
            if (isWithinBounds && this.isLink) {
                console.log(`Clicked on link: ${this.value} at (${this.x}, ${this.y})`);
            }
            return isWithinBounds;
        }

        isHovered(mouseX, mouseY) {
            return (
                mouseX >= this.x &&
                mouseX <= this.x + Math.max(this.width, this.logoWidth) &&
                mouseY >= this.y &&
                mouseY <= this.y + this.totalHeight
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
        console.log(`Click at (${clickX}, ${clickY})`);

        symbols.forEach(symbol => {
            if (symbol.isLink && symbol.isClicked(clickX, clickY)) {
                console.log(`Navigating to: ${symbol.url}`);
                window.open(symbol.url, '_blank');
            }
        });
    });

    matrix.addEventListener('mousemove', (event) => {
        const rect = matrix.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        let isOverLink = false;
        symbols.forEach(symbol => {
            if (symbol.isLink && symbol.isHovered(mouseX, mouseY)) {
                isOverLink = true;
            }
        });

        matrix.style.cursor = isOverLink ? 'pointer' : 'default';
    });

    matrix.addEventListener('mouseleave', () => {
        matrix.style.cursor = 'default';
    });

    matrix.addEventListener('touchstart', (event) => {
        const rect = matrix.getBoundingClientRect();
        const touch = event.touches[0];
        const clickX = touch.clientX - rect.left;
        const clickY = touch.clientY - rect.top;

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
