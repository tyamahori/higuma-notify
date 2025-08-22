import { Hono } from 'hono'

const app = new Hono()

// 1) 確認リクエスト (GET)
app.get("/websub/youtube", (context) => {

    const query = context.req.query();
    console.log(query);

    return context.newResponse('Hello Hono!');
});

// 1) 確認リクエスト (GET)
app.post("/websub/youtube", async (context) => {

    const parseBody = await context.req.json();
    console.log(parseBody);

    return context.newResponse('Hello Hono!');
});


export default app
