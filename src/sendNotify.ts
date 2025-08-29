import { YouTubeFeed } from './types/youtubeXmlInterface';

export class DiscordNotificationError extends Error {
  constructor(
    public status: number,
    public message: string,
    public description: string
  ) {
    super(message);
  }
}

const sendDiscordNotification = async (webhookUrl: string, xml: YouTubeFeed): Promise<void> => {
  const messageContent = `新着動画だよ！（暖かみのあるbot）
    **${xml.feed.entry.title}**
    URL: ${xml.feed.entry.link['@_href']}
    `;
  const requestBody = {
    content: messageContent,
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
