import { YouTubeFeed } from './types/youtubeXmlInterface';

export class DiscordNotificationError extends Error {}

const sendDiscordNotification = async (webhookUrl: string, xml: YouTubeFeed): Promise<void> => {
  const messageContent = `新着動画だよ！（暖かみのあるbot）
    **${xml.feed.entry[0].title}**
    URL: https://www.youtube.com/watch?v=${xml.feed.entry[0]['yt:videoId']}
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
      `Discord通知送信失敗, HTTP status: ${response.status}, message: ${await response.text()}`
    );
  }
};
export default sendDiscordNotification;
