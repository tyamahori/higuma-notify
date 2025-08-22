import { Hono } from 'hono'
import {XMLParser} from "fast-xml-parser";

const app = new Hono()

// 1) 確認リクエスト (GET)
app.get("/websub/youtube", (context) => {

    const query = context.req.query('hub.challenge') ?? 'empty';
    console.log(query);

    return context.newResponse(query);
});

// 1) 確認リクエスト (GET)
app.post("/websub/youtube", async (context) => {

    const body = await context.req.text();
    const parser = new XMLParser();
    const xml = parser.parse(body);

    // xmlの構造は https://www.youtube.com/feeds/videos.xml?channel_id=UC_aBYQ3phPsrkSXkpnZeDZw

    // 最新の情報の取得イメージ {
    //     title: xml.feed.entry[0].title,
    //     url: `https://www.youtube.com/watch?v=${xml.feed.entry[0]['yt:videoId']}`,
    //     author: xml.feed.entry[0].author.name,
    // }

    const webhookUrl = context.env.DISCORD_WEBHOOK_URL;
    const messageContent = `新着動画だよ！（暖かみのあるbot）
    **${xml.feed.entry[0].title}**
    URL: https://www.youtube.com/watch?v=${xml.feed.entry[0]['yt:videoId']}
    `;
    const requestBody = {
        content: messageContent
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            return context.json({ status: 'success', message: 'Discord通知送信成功' });
        } else {
            return context.json({ status: 'fail..', error: 'Discord通知送信失敗' }, 500);
        }
    } catch (error) {
        return context.json({ success: false, error: error.message }, 500);
    }
});


export default app
