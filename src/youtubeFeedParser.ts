import { XMLParser } from 'fast-xml-parser';
import { DiscordContent, youTubeFeedSchema } from './types/youtubeXmlInterface';

export const XmlParser = (body: string): DiscordContent => {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const schema = youTubeFeedSchema.parse(parser.parse(body));

  return {
    message: '新着動画だよ！（暖かみのあるbot）',
    title: schema.feed.entry.title,
    url: schema.feed.entry.link['@_href'],
  };
};
