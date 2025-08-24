import { vi } from 'vitest';

// fetchのグローバルモック
globalThis.fetch = vi.fn();

// より安全な環境変数のモック
vi.stubEnv('DISCORD_WEBHOOK_URL', 'https://discord.com/api/webhooks/test/test');
