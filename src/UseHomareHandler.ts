import { Context } from 'hono';
import { DiscordNotification } from './types/DiscordNotification';
import {
  useDiscordNotification,
  DiscordNotificationSendError,
  UseDiscordNotification,
} from './UseDiscordNotification';
import { YouTubeFeed } from './types/YouTubeFeed';
import { useYouTubeFeed, YouTubeFeedParseError, UseYouTubeFeed } from './UseYouTubeFeed';
import {
  useYouTubeFeedKeyValueStore,
  UseYouTubeFeedKeyValueStore,
  YouTubeFeedKeyValueStoreError,
} from './UseYouTubeFeedKeyValueStore';

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
  const battleFaceOk = (context: Context) => {
    const query: string = context.req.query('hub.challenge') ?? 'empty';
    console.log(query);

    return context.newResponse(query);
  };

  /**
   * 痺れますね！
   */
  const postShibireMasuNeNotification = async (context: Context, notificationMessage: string) => {
    const { createDiscordNotification, sendDiscordNotification }: UseDiscordNotification =
      useDiscordNotification();
    const { isYouTubeFeedAlreadyStored, storeYouTubeFeed }: UseYouTubeFeedKeyValueStore =
      useYouTubeFeedKeyValueStore();

    // parse YouTube feed from context using Result pattern
    const contextBody: string = await context.req.text();
    const youTubeFeedParseResult: YouTubeFeedParseResult = tryParseYouTubeFeed(contextBody);
    if (!youTubeFeedParseResult.success) {
      // 「XMLパース失敗」 or 「XML検証失敗」時の Error の処理
      return context.json({ status: 'fail..', error: youTubeFeedParseResult.error.message }, 400);
    }
    const youTubeFeed: YouTubeFeed = youTubeFeedParseResult.data;

    // check YouTube feed is already stored to key-value store
    try {
      if (!isYouTubeFeedAlreadyStored(youTubeFeed)) {
        storeYouTubeFeed(youTubeFeed);
      }
    } catch (error: unknown) {
      if (error instanceof YouTubeFeedKeyValueStoreError) {
        return context.json({ status: 'fail..', error: error.message }, 500);
      }
      console.error(
        `method: postShibireMasuNeNotification message: どうやらバインダーが投げられたようだ ${error}`
      );
      throw error;
    }

    // create discord notification from YouTube feed
    const discordNotification: DiscordNotification = createDiscordNotification(
      notificationMessage,
      youTubeFeed
    );

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
