import { Hono } from 'hono';
import { YouTubeFeed } from './types/youtubeXmlInterface';
import sendDiscordNotification, { DiscordNotificationError } from './sendDiscordNotification';
import z from 'zod';
import { FuncResult } from './types/funcResult';
import { parseYouTubeXml } from './parseXml';

const app = new Hono();

// 1) 確認リクエスト (GET)
app.get('/websub/youtube', (context) => {
  const query = context.req.query('hub.challenge') ?? 'empty';
  console.log(query);

  return context.newResponse(query);
});

// 2) 投稿リクエスト (POST)
app.post('/websub/youtube', async (context) => {
  const body = await context.req.text();
  const xmlParseResult: FuncResult<YouTubeFeed, z.ZodError | unknown> = parseYouTubeXml(body);
  if (!xmlParseResult.success) {
    if (xmlParseResult.error && xmlParseResult.error instanceof z.ZodError) {
      return context.json(
        {
          status: 'fail..',
          error: 'XML検証失敗',
          details: xmlParseResult.error.issues,
        },
        400
      );
    }
    return context.json(
      {
        status: 'fail..',
        error: '予期しないエラーが発生しました',
      },
      500
    );
  }
  console.log('XML検証成功:', xmlParseResult.data.feed.title);

  const webhookUrl = (context.env as { DISCORD_WEBHOOK_URL: string }).DISCORD_WEBHOOK_URL;
  const feedData: YouTubeFeed = xmlParseResult.data;

  return await sendDiscordNotification(webhookUrl, feedData)
    .then(() => {
      return context.json({ status: 'success', message: 'Discord通知送信成功' });
    })
    .catch((error: unknown) => {
      if (error instanceof DiscordNotificationError) {
        return context.json({ status: 'fail..', error: error.message }, 500);
      }
      // rethrow exceptional error
      throw error;
    });
});

// 999) catch all exceptional errors
app.onError((error, context) => {
  console.error(`${error}`);
  return context.json({ message: 'Internal Server Error', error: error.message }, 500);
});

export default app;
