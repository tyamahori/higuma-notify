import { YouTubeFeed } from './types/youtubeXmlInterface';

export const sendDiscordNotification = async (
  webhookUrl: string,
  xml: YouTubeFeed
): Promise<void> => {
  const messageContent = `新着動画だよ！（暖かみのあるbot）
    **${xml.feed.entry[0].title}**
    URL: https://www.youtube.com/watch?v=${xml.feed.entry[0]['yt:videoId']}
    `;
  const requestBody = {
    content: messageContent,
  };
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      return;
    } else {
      throw new Error({
        message: `Discord通知送信失敗, HTTP status: ${response.status}`,
      });
    }
  } catch (error) {
    console.error('Discord通知送信失敗:', error);
    throw new Error({
      message: (error as Error).message,
    });
  }
};
