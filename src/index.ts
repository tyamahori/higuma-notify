import { Hono } from 'hono';
import { XMLParser } from 'fast-xml-parser';
import { youTubeFeedSchema } from './types/youtubeXmlInterface';
import { YouTubeFeed } from './types/youtubeXmlInterface';
import { sendDiscordNotification } from './sendNotify';

const app = new Hono();

// 1) 確認リクエスト (GET)
app.get('/websub/youtube', (context) => {
  const query = context.req.query('hub.challenge') ?? 'empty';
  console.log(query);

  return context.newResponse(query);
});

// 1) 確認リクエスト (GET)
app.post('/websub/youtube', async (context) => {
  const body = await context.req.text();
  const parser = new XMLParser();
  const parsedObject = parser.parse(body);

  try {
    const xml: YouTubeFeed = youTubeFeedSchema.parse(parsedObject);
    // 検証が成功したため、`xml`はYouTubeFeed型として扱える
    console.log('XML検証成功:', xml.feed.title);
    const webhookUrl = (context.env as { DISCORD_WEBHOOK_URL: string }).DISCORD_WEBHOOK_URL;
    const sendResult = await sendDiscordNotification(webhookUrl, xml);
    if (sendResult.success) {
      return context.json({ status: 'success', message: 'Discord通知送信成功' });
    } else {
      return context.json({ status: 'fail..', error: sendResult.message }, 500);
    }
  } catch (error) {
    // 検証に失敗した場合、ZodErrorがスローされる
    console.error('XML検証失敗:', error);
    return context.json({ status: 'fail..', error: 'XML検証失敗' }, 500);
  }
});

export default app;
