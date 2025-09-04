import { Context } from 'hono';
import { Bindings } from '../types/Bindings';

export class RateLimitExceededError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitExceededError';
  }
}

export const validateRateLimit = async (
  context: Context<{ Bindings: Bindings }>
): Promise<void> => {
  const rateLimiter = context.env.RATE_LIMITER;
  // CF-Connecting-IP は Cloudflare が直接設定するため改竄されにくい
  const clientIP = context.req.header('CF-Connecting-IP') || 'unknown';

  const { success } = await rateLimiter.limit({ key: clientIP });

  if (!success) {
    throw new RateLimitExceededError();
  }
};
