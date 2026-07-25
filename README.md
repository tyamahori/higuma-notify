# Higuma Notify

YouTube の新着動画通知を WebSub で受け取り、Discord Webhook に転送する Cloudflare Worker です。
Hono と TypeScript で実装し、Bun で開発します。

## 動作

`/websub/youtube` で、WebSub の購読確認と YouTube からの通知を処理します。

- `GET /websub/youtube`: `hub.challenge` の値をそのまま返します。
- `POST /websub/youtube`: 送信元 IP ごとにレート制限を適用し、`X-Hub-Signature` の HMAC-SHA1 署名を検証します。Atom フィードの形式が正しければ、動画タイトルと URL をランダムなメッセージとともに Discord へ送信します。

POST リクエストは、10 秒あたり 1 件に制限しています。
署名不正と Atom フィードの検証エラーには `400`、Discord への送信失敗と予期しないエラーには `500` を返します。

## 技術スタック

- Cloudflare Workers、Wrangler
- Hono
- TypeScript
- fast-xml-parser
- Zod
- Vitest
- Bun

依存パッケージの正確なバージョンは、`package.json` と `bun.lock` を参照してください。

## セットアップ

必要なものは、Bun、Cloudflare アカウント、Discord Webhook URL です。
Wrangler は開発依存としてインストールされます。

```bash
bun install
cp .dev.vars.sample .dev.vars
```

`.dev.vars` に次の値を設定します。

```dotenv
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
HUB_SECRET=WebSubの購読申請に使う共有シークレット
```

開発サーバーを起動します。

```bash
bun run dev
```

Wrangler の既定では、ローカルサーバーは `http://localhost:8787` で待ち受けます。

## テストと静的検査

```bash
# テストを監視モードで実行
bun run test

# テストを一度だけ実行
bun run test:run

# Vitest UI を起動
bun run test:ui

# ESLint、Prettier、TypeScript の検査
bun run lint
bun run format:check
bun run typecheck
```

CI では、lint、フォーマット、型、テストを検査します。

## YouTube WebSub の購読

YouTube の WebSub Hub に購読を申請します。
`hub.secret` には、Worker の `HUB_SECRET` と同じ値を指定してください。

```bash
curl -X POST https://pubsubhubbub.appspot.com/subscribe \
  -d "hub.mode=subscribe" \
  -d "hub.topic=https://www.youtube.com/xml/feeds/videos.xml?channel_id=<CHANNEL_ID>" \
  -d "hub.callback=https://<YOUR_DOMAIN>/websub/youtube" \
  -d "hub.secret=<HUB_SECRET>" \
  -d "hub.lease_seconds=800000"
```

このリポジトリの GitHub Actions は、登録済みの YouTube チャンネルを毎日再購読します。
ワークフローの実行には、リポジトリシークレット `HUB_CALLBACK` と `HUB_SECRET` が必要です。

## 通知を手動で試す

`tools/send-notification.ts` は、Atom ペイロードに署名して Worker へ POST します。

```bash
PAYLOAD='<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns="http://www.w3.org/2005/Atom"><link rel="hub" href="https://pubsubhubbub.appspot.com"/><title>YouTube video feed</title><entry><id>yt:video:VIDEO_ID</id><yt:videoId>VIDEO_ID</yt:videoId><yt:channelId>CHANNEL_ID</yt:channelId><title>Video title</title><link rel="alternate" href="https://www.youtube.com/watch?v=VIDEO_ID"/><author><name>Channel title</name><uri>https://www.youtube.com/channel/CHANNEL_ID</uri></author><published>2015-03-06T21:40:57+00:00</published><updated>2015-03-09T19:05:24+00:00</updated></entry></feed>' \
HUB_CALLBACK=http://localhost:8787/websub/youtube \
HUB_SECRET='WebSubの購読申請に使う共有シークレット' \
bun run tools/send-notification.ts
```

`PAYLOAD` には Atom XML の文字列を渡します。
GitHub Actions の `send notification` ワークフローからも、任意のペイロードまたは既定のサンプルを送信できます。

## デプロイ

Worker が使うシークレットを Cloudflare に登録します。

```bash
bunx wrangler secret put DISCORD_WEBHOOK_URL
bunx wrangler secret put HUB_SECRET
```

続いてデプロイします。

```bash
bun run deploy
```

`wrangler.jsonc` には、レート制限バインディング `RATE_LIMITER` と KV 名前空間 `HIGUMA_NOTIFY` が定義されています。
別の Cloudflare アカウントへデプロイする場合は、KV の `id` と `preview_id` をそのアカウントの値に変更してください。
