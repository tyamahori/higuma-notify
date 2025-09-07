import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { youTubeFeedValidationSchema } from '../src/validation/YouTubeFeedValidationSchema';
import { InvalidSignatureError, validateSignature } from '../src/validation/SignatureValidation';
import { useYouTubeFeed } from '../src/UseYouTubeFeed';
import { sampleXmlString } from './fixtures/sample_xml';

describe('Unit Tests', () => {
  describe('XML Parser Tests', () => {
    it('should parse YouTube XML feed correctly', () => {
      const xmlData = `
        <feed>
          <entry>
            <title>テスト動画</title>
            <yt:videoId>dQw4w9WgXcQ</yt:videoId>
            <author>
              <name>テストチャンネル</name>
            </author>
          </entry>
        </feed>
      `;

      const parser = new XMLParser();
      const result = parser.parse(xmlData);

      // パース結果の構造を確認
      expect(result.feed).toBeDefined();
      expect(result.feed.entry).toBeDefined();
      // entryが配列でない場合もあるので、配列かどうかを確認
      const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
      expect(entries[0].title).toBe('テスト動画');
      expect(entries[0]['yt:videoId']).toBe('dQw4w9WgXcQ');
      expect(entries[0].author.name).toBe('テストチャンネル');
    });

    it('should handle XML with multiple entries', () => {
      const xmlData = `
        <feed>
          <entry>
            <title>動画1</title>
            <yt:videoId>video1</yt:videoId>
          </entry>
          <entry>
            <title>動画2</title>
            <yt:videoId>video2</yt:videoId>
          </entry>
        </feed>
      `;

      const parser = new XMLParser();
      const result = parser.parse(xmlData);

      const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
      expect(entries).toHaveLength(2);
      expect(entries[0].title).toBe('動画1');
      expect(entries[1].title).toBe('動画2');
    });
  });

  describe('Message Format Tests', () => {
    it('should format Discord message correctly', () => {
      const title = 'テスト動画タイトル';
      const videoId = 'dQw4w9WgXcQ';

      const messageContent = `新着動画だよ！（暖かみのあるbot）
    **${title}**
    URL: https://www.youtube.com/watch?v=${videoId}
    `;

      expect(messageContent).toContain(title);
      expect(messageContent).toContain(videoId);
      expect(messageContent).toContain('新着動画だよ！（暖かみのあるbot）');
    });
  });
  describe('Zod Schema Tests', () => {
    it('should validate sample XML data against YouTubeFeed schema', () => {
      // Zodで検証
      // youTubeFeedSchema.parseがErrorを返さないことを確認
      const bodyExample = {
        feed: {
          link: [
            { '@_rel': 'hub', '@_href': 'https://pubsubhubbub.appspot.com' },
            {
              '@_rel': 'self',
              '@_href': 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=CHANNEL_ID',
            },
          ],
          title: 'YouTube video feed',
          updated: '2015-04-01T19:05:24.552394234+00:00',
          entry: {
            id: 'yt:video:VIDEO_ID',
            'yt:videoId': 'VIDEO_ID',
            'yt:channelId': 'CHANNEL_ID',
            title: 'Video title',
            link: {
              '@_rel': 'alternate',
              '@_href': 'http://www.youtube.com/watch?v=VIDEO_ID',
            },
            author: {
              name: 'Channel title',
              uri: 'http://www.youtube.com/channel/CHANNEL_ID',
            },
            published: '2015-03-06T21:40:57+00:00',
            updated: '2015-03-09T19:05:24.552394234+00:00',
          },
          '@_xmlns:yt': 'http://www.youtube.com/xml/schemas/2015',
          '@_xmlns': 'http://www.w3.org/2005/Atom',
        },
      };
      expect(() => {
        youTubeFeedValidationSchema.parse(bodyExample);
      }).not.toThrow();
    });
  });

  describe('XML Parse Integration Tests', () => {
    it('should parse real YouTube WebSub XML and return DiscordContent', () => {
      const { parseYouTubeFeed } = useYouTubeFeed();
      const result = parseYouTubeFeed(sampleXmlString);
      expect(result.feed.entry.title).toBe('Video title');
      expect(result.feed.entry.link['@_href']).toBe('http://www.youtube.com/watch?v=VIDEO_ID');
    });

    it('should handle invalid XML gracefully', () => {
      const invalidXml = '<invalid>xml</invalid>';
      const { parseYouTubeFeed } = useYouTubeFeed();
      expect(() => parseYouTubeFeed(invalidXml)).toThrow('XML検証失敗');
    });

    it('should handle XML parsing errors', () => {
      const unparsableXml = 'not xml at all';
      const { parseYouTubeFeed } = useYouTubeFeed();
      expect(() => parseYouTubeFeed(unparsableXml)).toThrow('XML検証失敗');
    });
  });
  describe('Zod Schema URL Error Tests', () => {
    it('should throw an error when the URL host name is incorrect', () => {
      // Zodで検証
      // URLのホスト名が違う場合にErrorを返すことを確認
      const bodyExample = {
        feed: {
          link: [
            { '@_rel': 'hub', '@_href': 'https://pubsubhubbub.appspot.com' },
            {
              '@_rel': 'self',
              '@_href': 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=CHANNEL_ID',
            },
          ],
          title: 'YouTube video feed',
          updated: '2015-04-01T19:05:24.552394234+00:00',
          entry: {
            id: 'yt:video:VIDEO_ID',
            'yt:videoId': 'VIDEO_ID',
            'yt:channelId': 'CHANNEL_ID',
            title: 'Video title',
            link: {
              '@_rel': 'alternate',
              '@_href': 'http://www.example.com/watch?v=VIDEO_ID',
            },
            author: {
              name: 'Channel title',
              uri: 'http://www.youtube.com/channel/CHANNEL_ID',
            },
            published: '2015-03-06T21:40:57+00:00',
            updated: '2015-03-09T19:05:24.552394234+00:00',
          },
          '@_xmlns:yt': 'http://www.youtube.com/xml/schemas/2015',
          '@_xmlns': 'http://www.w3.org/2005/Atom',
        },
      };
      expect(() => {
        youTubeFeedValidationSchema.parse(bodyExample);
      }).toThrow();
    });
  });

  describe('Signature Validation Tests', () => {
    it('should throw InvalidSignatureError when X-Hub-Signature header is missing', () => {
      const headers = {
        /* no X-Hub-Signature header */
      };
      const reqBody = 'test';
      const hubSecret = 'test';
      expect(() => validateSignature(headers, reqBody, hubSecret)).toThrow(InvalidSignatureError);
    });

    it('should throw InvalidSignatureError when the signature does not match', () => {
      const headers = { 'X-Hub-Signature': 'sha1=invalid' };
      const reqBody = 'test';
      const hubSecret = 'test';
      expect(() => validateSignature(headers, reqBody, hubSecret)).toThrow(InvalidSignatureError);
    });

    it('should not throw an error when the signature matches', () => {
      const hubSecret = 'secret';
      const reqBody = 'foobar';
      const hmac = createHmac('sha1', hubSecret).update(reqBody).digest('hex');
      const headers = { 'X-Hub-Signature': `sha1=${hmac}` };
      expect(() => validateSignature(headers, reqBody, hubSecret)).not.toThrow();
    });
  });
});
