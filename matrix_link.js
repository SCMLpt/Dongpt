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

    // 링크 데이터 (유명 플랫폼과 각 로고)
    const userLinks = [
        { url: 'https://x.com/KamuiTranslator', displayText: 'KamuiTranslator', logo: 'https://scmlpt.github.io/Dongpt/logo.png' },
        { url: 'https://app.tinyman.org/swap?asset_in=0&asset_out=2800093456', displayText: 'Tinyman Swap', logo: 'https://scmlpt.github.io/Dongpt/logo.png' },
        { url: 'https://www.google.com', displayText: 'Google', logo: 'https://www.google.com/favicon.ico' },
        { url: 'https://www.tiktok.com', displayText: 'TikTok', logo: 'https://www.tiktok.com/favicon.ico' },
        { url: 'https://www.youtube.com', displayText: 'YouTube', logo: 'https://www.youtube.com/favicon.ico' },
        { url: 'https://www.facebook.com', displayText: 'Facebook', logo: 'https://www.facebook.com/favicon.ico' },
        { url: 'https://www.instagram.com', displayText: 'Instagram', logo: 'https://www.instagram.com/favicon.ico' },
        { url: 'https://www.twitter.com', displayText: 'Twitter', logo: 'https://www.twitter.com/favicon.ico' },
        { url: 'https://www.linkedin.com', displayText: 'LinkedIn', logo: 'https://www.linkedin.com/favicon.ico' },
        { url: 'https://www.reddit.com', displayText: 'Reddit', logo: 'https://www.reddit.com/favicon.ico' },
        { url: 'https://www.wikipedia.org', displayText: 'Wikipedia', logo: 'https://www.wikipedia.org/favicon.ico' },
        { url: 'https://www.amazon.com', displayText: 'Amazon', logo: 'https://www.amazon.com/favicon.ico' },
        { url: 'https://www.netflix.com', displayText: 'Netflix', logo: 'https://www.netflix.com/favicon.ico' },
        { url: 'https://www.spotify.com', displayText: 'Spotify', logo: 'https://www.spotify.com/favicon.ico' }
    ];

    // 로고 이미지 캐싱
    const logoImages = {};
    userLinks.forEach(link => {
        const img = new Image();
        img.src = link.logo;
        img.onerror = () => {
            console.warn(`Failed to load logo for ${link.displayText}, using fallback.`);
            img.src = 'https://scmlpt.github.io/Dongpt/logo.png';
        };
        logoImages[link.displayText] = img;
    });

    const logoWidth = 30;
    const logoHeight = 30;

    // 링크 선택 빈도 추적 및 셔플링
    const linkUsageCount = new Map(userLinks.map(link => [link.displayText, 0])); // 각 링크의 사용 횟수 추적
    let availableLinks = [...userLinks]; // 셔플링용 링크 배열

    // 링크 배열 셔플링 함수 (Fisher-Yates 알고리즘)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 링크 선택 함수 (최소 사용된 링크 선택 후 셔플링)
    function selectLink() {
        // 사용 횟수가 가장 적은 링크들 필터링
        const minUsage = Math.min(...linkUsageCount.values());
        const leastUsedLinks = Array.from(linkUsageCount.entries())
            .filter(([_, count]) => count === minUsage)
            .map(([displayText, _]) => userLinks.find(link => link.displayText === displayText));

        // 사용 가능한 링크가 없으면 전체 링크로 리셋
        if (leastUsedLinks.length === 0) {
            availableLinks = [...userLinks];
            linkUsageCount.forEach((_, key) => linkUsageCount.set(key, 0)); // 사용 횟수 초기화
            return selectLink();
        }

        // 최소 사용된 링크들 중 하나 선택
        availableLinks = shuffle([...leastUsedLinks]);
        const selectedLink = availableLinks.shift();
        linkUsageCount.set(selectedLink.displayText, linkUsageCount.get(selectedLink.displayText) + 1);
        return selectedLink;
    }

    class Symbol {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.isLink = true; // 항상 링크 심볼

            const linkData = selectLink();
            this.value = linkData.displayText;
            this.url = linkData.url;
            this.logo = logoImages[linkData.displayText];
            this.color = '#00FF00'; // 모든 심볼 초록색
            this.speed = 0.5 + Math.random() * 1.5;
            ctx.font = '16px monospace';
            this.width = ctx.measureText(this.value).width;
            this.height = this.value.length * 16;
            this.logoWidth = logoWidth;
            this.logoHeight = logoHeight;
            this.totalHeight = this.height + this.logoHeight + 5;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.font = '16px monospace';
            for (let i = 0; i < this.value.length; i++) {
                const charY = this.y + i * 16;
                ctx.fillText(this.value[i], this.x, charY);
            }

            if (this.logo && this.logo.complete) {
                const logoY = this.y + this.value.length * 16 + 5;
                ctx.drawImage(this.logo, this.x, logoY, this.logoWidth, this.logoHeight);
            }

            this.y += this.speed;
            if (this.y >= matrix.height) {
                this.y = -this.totalHeight;
                this.x = Math.random() * matrix.width;

                const linkData = selectLink();
                this.value = linkData.displayText;
                this.url = linkData.url;
                this.logo = logoImages[linkData.displayText];
                this.width = ctx.measureText(this.value).width;
                this.height = this.value.length * 16;
                this.totalHeight = this.height + this.logoHeight + 5;
            }
        }

        isClicked(clickX, clickY) {
            const isWithinBounds = (
                clickX >= this.x &&
                clickX <= this.x + Math.max(this.width, this.logoWidth) &&
                clickY >= this.y &&
                clickY <= this.y + this.totalHeight
            );
            if (isWithinBounds) {
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
        symbols.push(new Symbol(Math.random() * matrix.width, Math.random() * matrix.height));
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
            if (symbol.isClicked(clickX, clickY)) {
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
            if (symbol.isHovered(mouseX, mouseY)) {
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
            if (symbol.isClicked(clickX, clickY)) {
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
