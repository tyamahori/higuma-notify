// TODO: 'DiscordNotificationSender.ts' にファイル名を改名
import { DiscordNotification } from './types/DiscordNotification';

export class DiscordNotificationSendError extends Error {
  static {
    this.prototype.name = 'DiscordNotificationSendError';
  }

  constructor(
    readonly status: number,
    readonly message: string,
    readonly description: string
  ) {
    super(message);
  }
}

export const sendDiscordNotification = async (
  webhookUrl: string,
  discordNotification: DiscordNotification
): Promise<void> => {
  const requestBody = {
    content: `${discordNotification.message}
    **${discordNotification.title}**
    URL: ${discordNotification.url}
    `,
  };

  const response: Response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new DiscordNotificationSendError(
      response.status,
      'Discord通知送信失敗',
      await response.text()
    );
  }
};
