import { YouTubeFeed } from './types/youtubeXmlInterface';
import { FuncResult } from './types/funcResult';
import z from 'zod';
import { XmlParser } from './youtubeFeedParser';

export const parseYouTubeXml = (body: string): FuncResult<YouTubeFeed, z.ZodError | unknown> => {
  try {
    const xml: YouTubeFeed = XmlParser(body);
    // 検証が成功したため、`xml`はYouTubeFeed型として扱える
    console.log('XML検証成功:', xml.feed.title);
    return { success: true, data: xml };
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
