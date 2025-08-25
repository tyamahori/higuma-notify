import { z } from 'zod';

// xmlの構造は https://www.youtube.com/feeds/videos.xml?channel_id=UC_aBYQ3phPsrkSXkpnZeDZw

// 最新の情報の取得イメージ {
//     title: xml.feed.entry[0].title,
//     url: `https://www.youtube.com/watch?v=${xml.feed.entry[0]['yt:videoId']}`,
//     author: xml.feed.entry[0].author.name,
// }

export const youTubeFeedSchema = z.object({
  feed: z.object({
    link: z.array(z.string()),
    id: z.string(),
    'yt:channelId': z.string(),
    title: z.string(),
    author: z.object({
      name: z.string(),
      uri: z.string().url(),
    }),
    published: z.string().datetime({ offset: true }),
    entry: z.array(
      z.object({
        id: z.string(),
        'yt:videoId': z.string(),
        'yt:channelId': z.string(),
        title: z.string(),
        link: z.string(),
        author: z.object({
          name: z.string(),
          uri: z.string().url(),
        }),
        published: z.string().datetime({ offset: true }),
        updated: z.string().datetime({ offset: true }),
        'media:group': z.object({
          'media:title': z.string(),
          'media:content': z.string(),
          'media:thumbnail': z.string(),
          'media:description': z.string(),
          'media:community': z.object({
            'media:starRating': z.string(),
            'media:statistics': z.string(),
          }),
        }),
      })
    ),
  }),
});

// 推論される型
export type YouTubeFeed = z.infer<typeof youTubeFeedSchema>;
