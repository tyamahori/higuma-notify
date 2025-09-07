import { Context } from 'hono';
import { DiscordNotification } from './types/DiscordNotification';
import {
  useDiscordNotification,
  DiscordNotificationSendError,
  UseDiscordNotification,
} from './UseDiscordNotification';
import { YouTubeFeed } from './types/YouTubeFeed';
import { useYouTubeFeed, YouTubeFeedParseError, UseYouTubeFeed } from './UseYouTubeFeed';
import type { HigumaContext } from './types/Context';

export const useHomareHandler = () => {
  // Result type for parsing YouTube feed
  type YouTubeFeedParseResult =
    | { success: true; data: YouTubeFeed }
    | { success: false; error: YouTubeFeedParseError };

  // Safe parsing function that returns Result type
  const tryParseYouTubeFeed = (contextBody: string): YouTubeFeedParseResult => {
    const { parseYouTubeFeed }: UseYouTubeFeed = useYouTubeFeed();

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
  const battleFaceOk = (context: HigumaContext) => {
    const query: string = context.req.query('hub.challenge') ?? 'empty';
    console.log(query);

    return context.newResponse(query);
  };

  /**
   * 痺れますね！
   */
  const postShibireMasuNeNotification = async (
    // リクエストボディは Signature を検証する際にすでに読み取られており、context.req.text() などで再読取りを
    // しようとすると Body already consumed エラーが発生してしまう
    // そのため、req を明示的に除外して、誤って context.req を触ったら型エラーになるようにする
    // リクエストボディを利用する場合は、第3引数の reqBody を使う
    context: Omit<HigumaContext, 'req'>,
    notificationMessage: string,
    reqBody: string
  ) => {
    const { createDiscordNotification, sendDiscordNotification }: UseDiscordNotification =
      useDiscordNotification();

    // parse YouTube feed from context using Result pattern
    const youTubeFeedParseResult: YouTubeFeedParseResult = tryParseYouTubeFeed(reqBody);
    if (!youTubeFeedParseResult.success) {
      // 「XMLパース失敗」 or 「XML検証失敗」時の Error の処理
      return context.json({ status: 'fail..', error: youTubeFeedParseResult.error.message }, 400);
    }
    const youTubeFeed: YouTubeFeed = youTubeFeedParseResult.data;

    // create discord notification from YouTube feed
    const discordNotification: DiscordNotification = createDiscordNotification(
      notificationMessage,
      youTubeFeed
    );

    // send discord notification
    const webhookUrl: string = context.env.DISCORD_WEBHOOK_URL;
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
