import { Hono } from 'hono'

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
    const webhookUrl = context.env.DISCORD_WEBHOOK_URL;
    const messageContent = `ぼくひぐまちゃんねるが更新されたら通知したいんじゃぁ！ \n xml...`;
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

        console.log(response);

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
