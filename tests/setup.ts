import { vi } from 'vitest'

// 環境変数を設定
process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/test/test'

// fetchのグローバルモック
globalThis.fetch = vi.fn()

// テスト用の環境変数を設定
Object.defineProperty(globalThis, 'DISCORD_WEBHOOK_URL', {
  value: 'https://discord.com/api/webhooks/test/test',
  writable: true
})
