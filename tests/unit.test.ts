import { describe, it, expect } from 'vitest';
import { XMLParser } from 'fast-xml-parser';
import { youTubeFeedSchema } from '../src/types/youtubeXmlInterface';
import { parseYouTubeXml } from '../src/parseXml';
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
        youTubeFeedSchema.parse(bodyExample);
      }).not.toThrow();
    });
  });

  describe('XML Parse Integration Tests', () => {
    it('should parse real YouTube WebSub XML and return DiscordContent', () => {
      const result = parseYouTubeXml(sampleXmlString);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('新着動画だよ！（暖かみのあるbot）');
        expect(result.data.title).toBe('Video title');
        expect(result.data.url).toBe('http://www.youtube.com/watch?v=VIDEO_ID');
      }
    });

    it('should handle invalid XML gracefully', () => {
      const invalidXml = '<invalid>xml</invalid>';
      const result = parseYouTubeXml(invalidXml);

      expect(result.success).toBe(false);
      expect(result.message).toBe('XML検証失敗');
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should handle XML parsing errors', () => {
      const unparsableXml = 'not xml at all';
      const result = parseYouTubeXml(unparsableXml);

      expect(result.success).toBe(false);
      expect(result.message).toBe('XML検証失敗');
    });
  });
});
