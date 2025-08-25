import { XMLParser } from 'fast-xml-parser';
import { YouTubeFeed, youTubeFeedSchema } from './types/youtubeXmlInterface';
import { FuncResult } from './types/funcResult';
import z from 'zod';

export const parseYouTubeXml = (body: string): FuncResult<YouTubeFeed, z.ZodError | unknown> => {
  const parser = new XMLParser();
  const parsedObject = parser.parse(body);
  let xml: YouTubeFeed;

  try {
    xml = youTubeFeedSchema.parse(parsedObject);
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
