import { XMLParser } from 'fast-xml-parser';
import { YouTubeFeed, youTubeFeedSchema } from './types/youtubeXmlInterface';

export const XmlParser = (body: string): YouTubeFeed => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  return youTubeFeedSchema.parse(parser.parse(body));
};
