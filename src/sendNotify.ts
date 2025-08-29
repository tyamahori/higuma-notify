import { FuncResult } from './types/funcResult';
import { DiscordContent } from './types/youtubeXmlInterface';

export const sendDiscordNotification = async (
  webhookUrl: string,
  body: DiscordContent
): Promise<FuncResult> => {
  const requestBody = {
    content: `${body.message}
    **${body.title}**
    URL: ${body.url}
    `,
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
