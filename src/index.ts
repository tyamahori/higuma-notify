import { Hono } from 'hono';
import { inspect } from 'node:util';
import type { Bindings } from './types/Bindings';
import type { HigumaContext } from './types/Context';
import { useHomareHandler, UseHomareHandler } from './UseHomareHandler';
import {
  useRandomNotificationMessage,
  UseRandomNotificationMessage,
} from './UseRandomNotificationMessage';
import { notificationMessages } from './constants/NotificationMessages';
import { validateRateLimit } from './validation/RateLimitValidation';
import { InvalidSignatureError, validateSignature } from './validation/SignatureValidation';

/**
 * 誉れでございます。
 */
const { battleFaceOk, postShibireMasuNeNotification }: UseHomareHandler = useHomareHandler();

const app = new Hono<{ Bindings: Bindings }>();

// 1) 確認リクエスト (GET)
app.get('/websub/youtube', (context: HigumaContext) => {
  /**
   * 闘う顔してますか？
   */
  return battleFaceOk(context);
});

// 2) 投稿リクエスト (POST) with rate limiting
app.post('/websub/youtube', async (context: HigumaContext) => {
  // RateLimit のバリデーションチェック
  await validateRateLimit(context);

  const reqBody = await context.req.text();

  // X-Hub-Signature を検証
  validateSignature(context.req.header(), reqBody, context.env.HUB_SECRET);

  // ランダムな通知メッセージを生成
  const { generateRandomNotificationMessage }: UseRandomNotificationMessage =
    useRandomNotificationMessage(notificationMessages.list, () => Math.random());
  const notificationMessage: string = generateRandomNotificationMessage();
  /**
   * 痺れますね！
   */
  return await postShibireMasuNeNotification(context, notificationMessage, reqBody);
});

// 999) catch all exceptional errors
app.onError((error: Error, context: HigumaContext) => {
  console.error(`${inspect(error)}`);

  if (error instanceof InvalidSignatureError) {
    return context.json(
      { message: 'JKでも分かる不正融資のようなエラー', error: error.message },
      400
    );
  }

  return context.json({ message: '類例をみないエラー', error: error.message }, 500);
});

export default app;
