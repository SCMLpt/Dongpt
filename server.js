const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// X API 인증 정보 (실제 값으로 교체 필요)
const bearerToken = 'YOUR_X_BEARER_TOKEN';

app.use(express.json());

app.get('/api/social-interactions', async (req, resp) => {
    try {
        const response = await axios.get('https://api.twitter.com/2/tweets/search/recent?query=Dongpt&tweet.fields=public_metrics,created_at', {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        const tweets = response.data.data;
        const interactions = tweets.map(tweet => {
            const metrics = tweet.public_metrics;
            return {
                date: new Date(tweet.created_at).toISOString().split('T')[0],
                interactions: metrics.like_count + metrics.retweet_count + metrics.reply_count
            };
        });

        // 날짜별로 합산
        const aggregated = interactions.reduce((acc, curr) => {
            if (!acc[curr.date]) {
                acc[curr.date] = 0;
            }
            acc[curr.date] += curr.interactions;
            return acc;
        }, {});

        resp.json(aggregated);
    } catch (error) {
        console.error('Error fetching social interactions:', error);
        resp.status(500).json({ error: 'Failed to fetch social interactions' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
