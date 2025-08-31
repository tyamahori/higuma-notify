// TODO: 'DiscordNotificationSender.ts' にファイル名を改名
import { DiscordNotification } from './types/DiscordNotification';
import { YouTubeFeed } from './types/YouTubeFeed';

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

export const useDiscordNortification = () => {
  const createDiscordNotification = (youTubeFeed: YouTubeFeed) => {
    return {
      message: '新着動画だよ！（暖かみのあるbot）',
      title: youTubeFeed.feed.entry.title,
      url: youTubeFeed.feed.entry.link['@_href'],
    };
  };

  const sendDiscordNotification = async (
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
  return { createDiscordNotification, sendDiscordNotification };
};

export type UseDiscordNortification = ReturnType<typeof useDiscordNortification>;
