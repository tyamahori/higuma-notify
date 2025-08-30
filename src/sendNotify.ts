import { DiscordContent } from './types/youtubeXmlInterface';

export class DiscordNotificationError extends Error {
  constructor(
    public status: number,
    public message: string,
    public description: string
  ) {
    super(message);
  }
}

export const sendDiscordNotification = async (
  webhookUrl: string,
  body: DiscordContent
): Promise<void> => {
  const requestBody = {
    content: `${body.message}
    **${body.title}**
    URL: ${body.url}
    `,
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new DiscordNotificationError(
      response.status,
      'Discord通知送信失敗',
      await response.text()
    );
  }
};
export default sendDiscordNotification;
