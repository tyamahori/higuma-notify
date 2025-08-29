import { FuncResult } from './types/funcResult';
import { YouTubeFeed } from './types/youtubeXmlInterface';

export const sendDiscordNotification = async (
  webhookUrl: string,
  xml: YouTubeFeed
): Promise<FuncResult> => {
  const messageContent = `新着動画だよ！（暖かみのあるbot）
    **${xml.feed.entry.title}**
    URL: ${xml.feed.entry.link['@_href']}
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
      return { success: true };
    } else {
      return { success: false, message: `Discord通知送信失敗, HTTP status: ${response.status}` };
    }
  } catch (error) {
    console.error('Discord通知送信失敗:', error);
    return { success: false, message: (error as Error).message };
  }
};
