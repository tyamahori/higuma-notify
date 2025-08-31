import { z } from 'zod';
import { youTubeFeedValidationSchema } from '../validation/YouTubeFeedValidationSchema';

export type YouTubeFeed = z.infer<typeof youTubeFeedValidationSchema>;
