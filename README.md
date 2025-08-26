# Higuma Notify

YouTube の新着動画通知を WebSub で受け取り、Discord Webhook に転送する Cloudflare Workers（Hono + TypeScript）プロジェクトです。

## 技術スタック

- Hono (v4.9系)
- Bun (v1.2系)
- Zod (v4.1系)
- TypeScript
- Cloudflare Workers

## 機能概要

- WebSub 購読確認エンドポイント（GET）
- YouTube からの通知受信（POST, Atom/XML 解析）
- Discord へのメッセージ送信（Webhook）

## 必要ツール

- Bun（パッケージマネージャ）
- Cloudflare アカウント
- Wrangler（Cloudflare Workers の CLI）
- Discord Webhook URL

## セットアップ

1. 依存関係のインストール
   - `bun install`

2. 環境変数の設定
   - ローカル開発用:
     - プロジェクトルートに`.dev.vars.sample` から `.dev.vars` を作成します
     - `cp .dev.vars.sample .dev.vars`
     - `.dev.vars` に `DISCORD_WEBHOOK_URL=<あなたの Discord Webhook URL>` を設定してください
   - 本番/デプロイ用:
     - Cloudflare にシークレット変数として登録
       - `wrangler secret put DISCORD_WEBHOOK_URL`
       - プロンプトに従い値を入力

## ローカル開発
- 開発サーバ起動: `bun run dev`

### Docker での起動方法
```bash
# Docker Compose でサービスを起動
docker compose up --build

# バックグラウンドで実行する場合
docker compose up -d --build

# サービスを停止
docker compose down
```

Docker で起動した場合、サーバーは `http://localhost:8787` でアクセス可能です。

### 主要エンドポイント
- GET `/websub/youtube`（購読確認。hub.challenge をそのまま返します）
- POST `/websub/youtube`（YouTube からの通知受信。Discord に送信します）

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

## YouTube WebSub の購読

YouTube の PubSubHubbub（WebSub）Hub に対し、以下のフォームパラメータで購読を申請します。

- hub.mode: `subscribe`
- hub.topic: `https://www.youtube.com/feeds/videos.xml?channel_id=<YourChannelId>`
- hub.callback: あなたの公開コールバック URL（例: `https://<your-domain>/websub/youtube`）
- hub.secret: 任意（署名用）。現状このプロジェクトでは署名検証を行っていません
- hub.lease_seconds: 任意（購読期間）

購読するコマンド例

```bash
curl -X POST "https://pubsubhubbub.appspot.com/subscribe" \
  -d "hub.mode=subscribe" \
  -d "hub.topic='feed-url-here'" \
  -d "hub.callback='callback-url-here'" \
  -d "hub.secret='secret-here'" \
  -d "hub.lease_seconds=800000"
```
