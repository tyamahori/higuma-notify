import { DiscordContent } from './types/youtubeXmlInterface';
import { FuncResult } from './types/funcResult';
import z from 'zod';
import { XmlParser } from './youtubeFeedParser';

export const parseYouTubeXml = (body: string): FuncResult<DiscordContent, z.ZodError | unknown> => {
  try {
    const content: DiscordContent = XmlParser(body);
    // 検証が成功したため、`xml`はYouTubeFeed型として扱える
    console.log('XML検証成功:', content.title);
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
