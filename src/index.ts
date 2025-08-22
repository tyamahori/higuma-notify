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

    // XML本文をそのままログに出す
    console.log("===== YOUTUBE NOTIFICATION RECEIVED =====");
    console.log(body);
    console.log("=========================================");

    return context.newResponse('OK');
});


export default app
