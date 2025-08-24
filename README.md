```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

## テスト

テストを実行するには：

```txt
# すべてのテストを実行
bun test

# テストを監視モードで実行
bun test --watch

# テストUIを起動
bun test --ui
```

### テスト構成

- **ユニットテスト** (`tests/unit.test.ts`): 個別の機能（XMLパース、メッセージフォーマット）をテスト

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
