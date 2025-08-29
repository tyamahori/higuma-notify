import { DiscordContent, YouTubeFeed, youTubeFeedSchema } from './types/youtubeXmlInterface';
import { FuncResult } from './types/funcResult';
import z from 'zod';
import { XmlParser } from './XmlParser';

export const parseYouTubeXml = (body: string): FuncResult<DiscordContent, z.ZodError | unknown> => {
  try {
    const xml: YouTubeFeed = youTubeFeedSchema.parse(XmlParser(body));
    // 検証が成功したため、`xml`はYouTubeFeed型として扱える
    console.log('XML検証成功:', xml.feed.title);
    const content: DiscordContent = {
      message: '新着動画だよ！（暖かみのあるbot）',
      title: xml.feed.entry.title,
      url: xml.feed.entry.link['@_href'],
    };
    return { success: true, data: content };
  } catch (error) {
    // 検証に失敗した場合、ZodErrorがスローされる
    if (error instanceof z.ZodError) {
      console.error('XML検証失敗:', error.issues);
    } else {
      console.error('予期しないエラー:', error);
    }
    return { success: false, message: 'XML検証失敗', error: error };
  }
};
