# タスク進捗管理

## ステータス凡例
- `[x]` 完了
- `[-]` 進行中
- `[ ]` 未着手

---

## セットアップ

- [x] Next.js 15 プロジェクト作成
- [x] Tailwind CSS 設定
- [x] Drizzle ORM + Turso 接続設定
- [x] Better-auth (Google OAuth) 設定
- [x] Vercel Blob 設定
- [ ] Turso データベース作成・接続
- [ ] Google Cloud Console で OAuth クライアント作成
- [ ] Vercel Blob ストア作成
- [ ] `npm run db:push` でマイグレーション実行

---

## バックエンド（API）

- [x] `GET/POST /api/courses` — コース一覧取得・作成
- [x] `GET/PATCH/DELETE /api/courses/[id]` — コース取得・更新・削除
- [x] `POST /api/chapters` — セクション作成
- [x] `PATCH/DELETE /api/chapters/[id]` — セクション更新・削除
- [x] `POST /api/lessons` — レッスン作成
- [x] `GET/PATCH/DELETE /api/lessons/[id]` — レッスン取得・更新・削除
- [x] `GET/POST /api/progress` — 進捗取得・更新
- [x] `POST /api/upload/thumbnail` — サムネイル Vercel Blob アップロード
- [x] `GET/POST /api/auth/[...all]` — Better-auth エンドポイント

---

## フロントエンド（受講者）

- [x] コース一覧ページ (`/`)
- [x] コース詳細ページ (`/courses/[id]`)
- [x] レッスン視聴ページ (`/courses/[id]/lessons/[id]`)
- [x] YouTube IFrame 埋め込みプレイヤー
- [x] 進捗トラッキング（完了ボタン）
- [x] ログインページ (`/login`) — Googleボタンのみ
- [x] ナビゲーションバー

---

## フロントエンド（管理者）

- [x] 管理ダッシュボード (`/admin`)
- [x] コース一覧 (`/admin/courses`)
- [x] コース作成 (`/admin/courses/new`)
- [x] コース編集 (`/admin/courses/[id]`)
- [x] カリキュラム編集 (`/admin/courses/[id]/chapters`)
  - [x] セクション追加・削除
  - [x] レッスン追加・削除（YouTube URL/ID入力）
- [x] サムネイルアップロード

---

## テスト

- [x] TypeScript 型チェック（エラーなし）
- [x] ビルドチェック（成功・警告1件）
  - [ ] `BETTER_AUTH_SECRET` を32文字以上のランダム文字列に変更（本番前に対応）
- [x] Vitest セットアップ
- [x] ユニットテスト — `extractYoutubeId` 全6ケース合格
- [x] ユニットテスト — `POST /api/courses` バリデーション 全2ケース合格
- [x] ユニットテスト — `POST /api/lessons` バリデーション 全4ケース合格
- [ ] 手動動作確認（外部サービス接続後）

---

## デプロイ

- [ ] GitHub リポジトリ作成・プッシュ
- [ ] Vercel にプロジェクト追加
- [ ] Vercel に環境変数を設定
  - [ ] `TURSO_DATABASE_URL`
  - [ ] `TURSO_AUTH_TOKEN`
  - [ ] `BETTER_AUTH_SECRET`
  - [ ] `BETTER_AUTH_URL`
  - [ ] `NEXT_PUBLIC_BETTER_AUTH_URL`
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `BLOB_READ_WRITE_TOKEN`
- [ ] 本番URLを Google OAuth のリダイレクトURIに追加
- [ ] 本番動作確認

---

## 今後の改善候補（MVP後）

- [ ] コースの公開・非公開切り替え
- [ ] レッスンの並び替え（ドラッグ&ドロップ）
- [ ] セクションの並び替え
- [ ] コース完了証明書
- [ ] 受講者一覧（管理画面）
