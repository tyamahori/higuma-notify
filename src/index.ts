import { Hono, Context } from 'hono';
import { inspect } from 'node:util';
import { Bindings } from './types/Bindings';
import { useHomareHandler, UseHomareHandler } from './UseHomareHandler';
import { useNotificationMessage, UseNotificationMessage } from './UseNotificationMessage';
import { notificationMessages } from './constants/NotificationMessages';

/**
 * 誉れでございます。
 */
const { battleFaceOk, postShibireMasuNeNotification }: UseHomareHandler = useHomareHandler();

const app = new Hono<{ Bindings: Bindings }>();

// 1) 確認リクエスト (GET)
app.get('/websub/youtube', (context: Context) => {
  /**
   * 闘う顔してますか？
   */
  return battleFaceOk(context);
});

// 2) 投稿リクエスト (POST)
app.post('/websub/youtube', async (context: Context) => {
  // ランダムな通知メッセージを生成
  const { generateRandomNotificationMessage }: UseNotificationMessage = useNotificationMessage(
    notificationMessages.list,
    () => Math.random()
  );
  const notificationMessage: string = generateRandomNotificationMessage();
  /**
   * 痺れますね！
   */
  return await postShibireMasuNeNotification(context, notificationMessage);
});

// 999) catch all exceptional errors
app.onError((error: Error, context: Context) => {
  console.error(`${inspect(error)}`);
  return context.json({ message: '類例をみないエラー', error: error.message }, 500);
});

export default app;
