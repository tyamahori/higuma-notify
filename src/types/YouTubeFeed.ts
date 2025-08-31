import { z } from 'zod';
import { youTubeFeedSchema } from '../schema/YouTubeFeedSchema';

export type YouTubeFeed = z.infer<typeof youTubeFeedSchema>;
