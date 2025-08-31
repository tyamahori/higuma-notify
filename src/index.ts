import { Hono, Context } from 'hono';
import { inspect } from 'node:util';
import { DiscordNotification } from './types/DiscordNotification';
import { YouTubeFeed } from './types/youtubeXmlInterface';
import { parseYouTubeFeed, YouTubeFeedParseError } from './parseXml';
import { sendDiscordNotification, DiscordNotificationSendError } from './sendNotify';

const app = new Hono();

// 1) 確認リクエスト (GET)
app.get('/websub/youtube', (context: Context) => {
  const query: string = context.req.query('hub.challenge') ?? 'empty';
  console.log(query);

  return context.newResponse(query);
});

// 2) 投稿リクエスト (POST)
app.post('/websub/youtube', async (context: Context) => {
  // parse YouTube feed from context
  let youTubeFeed: YouTubeFeed;
  try {
    const contextBody: string = await context.req.text();
    youTubeFeed = parseYouTubeFeed(contextBody);
  } catch (error: unknown) {
    if (error instanceof YouTubeFeedParseError) {
      return context.json({ status: 'fail..', error: 'XML検証失敗', details: error.message }, 400);
    }
    throw error;
  }

  // create discord notification from YouTube feed
  const discordNotification: DiscordNotification = {
    message: '新着動画だよ！（暖かみのあるbot）',
    title: youTubeFeed.feed.entry.title,
    url: youTubeFeed.feed.entry.link['@_href'],
  };

  // send discord notification
  const webhookUrl: string = (context.env as { DISCORD_WEBHOOK_URL: string }).DISCORD_WEBHOOK_URL;
  return await sendDiscordNotification(webhookUrl, discordNotification)
    .then(() => {
      return context.json({ status: 'success', message: 'Discord通知送信成功' });
    })
    .catch((error: unknown) => {
      if (error instanceof DiscordNotificationSendError) {
        console.error(
          `status: ${error.status}, message: ${error.message}, description: ${error.description}`
        );
        return context.json({ status: 'fail..', error: error.message }, 500);
      }
      throw error;
    });
});

// 999) catch all exceptional errors
app.onError((error: Error, context: Context) => {
  console.error(`${inspect(error)}`);
  return context.json({ message: '予期しないエラー', error: error.message }, 500);
});

export default app;
