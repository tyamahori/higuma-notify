// TODO: 'YouTubeFeedParser.ts' にファイル名を改名
import z from 'zod';
import { XmlParser } from './XmlParser';
import { YouTubeFeed, youTubeFeedSchema } from './types/youtubeXmlInterface';
import { GenericResponseDict } from './types/GenericResponseDict';

export type YouTubeFeedParseSuccessResponse = Pick<GenericResponseDict, 'message'> & {
  isSuccess: true;
  data: YouTubeFeed;
};

export type YouTubeFeedParseErrorResponse = Pick<GenericResponseDict, 'message'> & {
  isSuccess: false;
  error: z.ZodError;
};

export type YouTubeFeedParseResponse =
  | YouTubeFeedParseSuccessResponse
  | YouTubeFeedParseErrorResponse;

export const parseYouTubeFeed = (body: string): YouTubeFeedParseResponse => {
  try {
    const youTubeFeed: YouTubeFeed = youTubeFeedSchema.parse(XmlParser(body));
    // 検証が成功したため、`xml`はYouTubeFeed型として扱える
    console.log('XML検証成功:', youTubeFeed.feed.title);
    return {
      isSuccess: true,
      message: 'XML検証成功',
      data: youTubeFeed,
    };
  } catch (error: unknown) {
    // 検証に失敗した場合、ZodErrorがスローされる
    if (error instanceof z.ZodError) {
      console.error('XML検証失敗:', error.issues);
      return {
        isSuccess: false,
        message: 'XML検証失敗',
        error,
      };
    }
    console.error('予期しないエラー:', error);
    throw error;
  }
};
