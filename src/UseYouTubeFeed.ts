import z from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { YouTubeFeed } from './types/YouTubeFeed';
import { youTubeFeedValidationSchema } from './validation/YouTubeFeedValidationSchema';

export class YouTubeFeedParseError extends Error {
  static {
    this.prototype.name = 'YouTubeFeedParseError';
  }
}

export const useYouTubeFeed = () => {
  const parseXml = (contextBody: string) => {
    try {
      return new XMLParser({
        ignoreAttributes: false,
      }).parse(contextBody);
    } catch (error: unknown) {
      console.error('XMLパース失敗:', (error as Error).message);
      throw new YouTubeFeedParseError('XMLパース失敗', { cause: error });
    }
  };

  const parseYouTubeFeed = (contextBody: string): YouTubeFeed => {
    const parsedXml = parseXml(contextBody);
    try {
      const youTubeFeed: YouTubeFeed = youTubeFeedValidationSchema.parse(parsedXml);
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

  return { parseYouTubeFeed };
};

export type UseYouTubeFeed = ReturnType<typeof useYouTubeFeed>;
