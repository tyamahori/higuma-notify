// TODO: 'YouTubeFeedParser.ts' にファイル名を改名
import z from 'zod';
import { XmlParser } from './XmlParser';
import { YouTubeFeed, youTubeFeedSchema } from './types/youtubeXmlInterface';

export class YouTubeFeedParseError extends Error {
  static {
    this.prototype.name = 'YouTubeFeedParseError';
  }
}

export const parseYouTubeFeed = (body: string): YouTubeFeed => {
  try {
    const youTubeFeed: YouTubeFeed = youTubeFeedSchema.parse(XmlParser(body));
    // 検証が成功したため、`xml`はYouTubeFeed型として扱える
    console.log('XML検証成功:', youTubeFeed.feed.title);
    return youTubeFeed;
  } catch (error: unknown) {
    // 検証に失敗した場合、ZodErrorがスローされる
    if (error instanceof z.ZodError) {
      console.error('XML検証失敗:', error.issues);
      throw new YouTubeFeedParseError('XML検証失敗', { cause: error });
    }
    console.error('予期しないエラー:', error);
    throw error;
  }
};
