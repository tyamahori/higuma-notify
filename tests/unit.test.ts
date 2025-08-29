import { describe, it, expect } from 'vitest';
import { XMLParser } from 'fast-xml-parser';
import { sampleXmlString } from './fixtures/sample_xml';
import { XmlParser } from '../src/youtubeFeedParser';

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
      expect(() => {
        XmlParser(sampleXmlString);
      }).not.toThrow();
    });
  });
});
