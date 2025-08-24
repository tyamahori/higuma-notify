/**
 * `media:starRating`要素の型
 */
export interface MediaStarRating {
  count: number;
  average: number;
  min: number;
  max: number;
}

/**
 * `media:statistics`要素の型
 */
export interface MediaStatistics {
  views: number;
}

/**
 * `media:community`要素の型
 */
export interface MediaCommunity {
  'media:starRating': MediaStarRating;
  'media:statistics': MediaStatistics;
}

/**
 * `media:content`要素の型
 */
export interface MediaContent {
  url: string;
  type: string;
  width: number;
  height: number;
}

/**
 * `media:thumbnail`要素の型
 */
export interface MediaThumbnail {
  url: string;
  width: number;
  height: number;
}

/**
 * `media:group`要素の型
 */
export interface MediaGroup {
  'media:title': string;
  'media:content': MediaContent;
  'media:thumbnail': MediaThumbnail;
  'media:description': string;
  'media:community': MediaCommunity;
}

/**
 * `author`要素の型
 */
export interface Author {
  name: string;
  uri: string;
}

/**
 * `link`要素の型
 */
export interface Link {
  rel: string;
  href: string;
}

/**
 * `entry`要素（各動画）の型
 */
export interface VideoEntry {
  id: string;
  'yt:videoId': string;
  'yt:channelId': string;
  title: string;
  link: Link;
  author: Author;
  published: string;
  updated: string;
  'media:group': MediaGroup;
}

/**
 * ルート要素である`feed`の型
 */
export interface YouTubeFeed {
  feed: {
    link: Link[];
    id: string;
    'yt:channelId': string;
    title: string;
    author: Author;
    published: string;
    entry: VideoEntry[];
  };
}
