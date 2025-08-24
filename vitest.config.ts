import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'miniflare',
    environmentOptions: {
      bindings: {
        DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/test/test'
      }
    },
    globals: true,
    setupFiles: ['./tests/setup.ts']
  }
})
