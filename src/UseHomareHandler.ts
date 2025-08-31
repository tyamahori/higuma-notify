import { Context } from 'hono';
import { DiscordNotification } from './types/DiscordNotification';
import { YouTubeFeed } from './types/YouTubeFeed';
import { useYouTubeFeed, YouTubeFeedParseError } from './UseYouTubeFeed';
import { useDiscordNortification, DiscordNotificationSendError } from './UseDiscordNotification';

export const useHomareHandler = () => {
  // Result type for parsing YouTube feed
  type YouTubeFeedParseResult =
    | { success: true; data: YouTubeFeed }
    | { success: false; error: YouTubeFeedParseError };

  // Safe parsing function that returns Result type
  const tryParseYouTubeFeed = (contextBody: string): YouTubeFeedParseResult => {
    const { parseYouTubeFeed } = useYouTubeFeed();
    try {
      return { success: true, data: parseYouTubeFeed(contextBody) };
    } catch (error) {
      if (error instanceof YouTubeFeedParseError) {
        return { success: false, error };
      }
      console.error(
        `method: tryParseYouTubeFeed message: 類例をみないエラーが発生しました ${error}`
      );
      throw error;
    }
  };

  /**
   * 闘う顔してますか？
   */
  const battleFaceOk = (context: Context) => {
    const query: string = context.req.query('hub.challenge') ?? 'empty';
    console.log(query);

    return context.newResponse(query);
  };

  /**
   * 痺れますね！
   */
  const postShibireMasuNeNotification = async (context: Context) => {
    const { createDiscordNotification, sendDiscordNotification } = useDiscordNortification();
    // parse YouTube feed from context using Result pattern
    const contextBody: string = await context.req.text();
    const youTubeFeedParseResult: YouTubeFeedParseResult = tryParseYouTubeFeed(contextBody);
    if (!youTubeFeedParseResult.success) {
      return context.json(
        { status: 'fail..', error: 'XML検証失敗', details: youTubeFeedParseResult.error.message },
        400
      );
    }
    const youTubeFeed: YouTubeFeed = youTubeFeedParseResult.data;

    // create discord notification from YouTube feed
    const discordNotification: DiscordNotification = createDiscordNotification(youTubeFeed);

    // send discord notification
    const webhookUrl: string = (context.env as { DISCORD_WEBHOOK_URL: string }).DISCORD_WEBHOOK_URL;
    return await sendDiscordNotification(webhookUrl, discordNotification)
      .then(() => {
        return context.json({ status: 'success', message: 'Discord通知送信成功' });
      })
      .catch((error: unknown) => {
        if (error instanceof DiscordNotificationSendError) {
          console.error(
            `method: sendDiscordNotification status: ${error.status}, message: ${error.message}, description: ${error.description}`
          );
          return context.json({ status: 'fail..', error: error.message }, 500);
        }
        console.error(
          `method: sendDiscordNotification message: 類例をみないエラーが発生しました ${error}`
        );
        throw error;
      });
  };

  return { battleFaceOk, postShibireMasuNeNotification };
};

export type UseHomareHandler = ReturnType<typeof useHomareHandler>;
