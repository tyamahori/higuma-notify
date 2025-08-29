import { z } from 'zod';

/**
 * @see https://developers.google.com/youtube/v3/guides/push_notifications?utm_source=chatgpt.com xmlの構造の根拠
 */
export const youTubeFeedSchema = z.object({
  feed: z.object({
    link: z.array(
      z.object({
        '@_rel': z.string(),
        '@_href': z.url(),
      })
    ),
    title: z.string(),
    entry: z.object({
      id: z.string(),
      'yt:videoId': z.string(),
      'yt:channelId': z.string(),
      title: z.string(), // video title
      link: z.object({
        '@_rel': z.string(),
        '@_href': z.url(), // 動画のURL
      }),
      author: z.object({
        name: z.string(),
        uri: z.url(),
      }),
      published: z.string().datetime({ offset: true }),
      updated: z.string().datetime({ offset: true }),
    }),
  }),
});

// 推論される型
export type YouTubeFeed = z.infer<typeof youTubeFeedSchema>;
