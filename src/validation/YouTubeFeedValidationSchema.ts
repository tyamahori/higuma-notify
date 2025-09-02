import { z } from 'zod';

/**
 * @see https://developers.google.com/youtube/v3/guides/push_notifications?utm_source=chatgpt.com xmlの構造の根拠
 */
export const youTubeFeedValidationSchema = z.object({
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
        '@_href': z.url({ hostname: /^www\.youtube\.com$/ }), // 動画のURL
      }),
      author: z.object({
        name: z.string(),
        uri: z.url({ hostname: /^www\.youtube\.com$/ }),
      }),
      published: z.iso.datetime({ offset: true }),
      updated: z.iso.datetime({ offset: true }),
    }),
  }),
});
