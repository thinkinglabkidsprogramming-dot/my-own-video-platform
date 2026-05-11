# 動画講座プラットフォーム 仕様書

## 概要

自分の動画講座を公開・提供するためのプラットフォーム。  
YouTubeの埋め込み動画を使い、会員が講座を視聴・進捗管理できる。

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| フレームワーク | Next.js 15 (App Router / TypeScript) |
| スタイリング | Tailwind CSS |
| データベース | Turso (libSQL / 分散SQLite) |
| ORM | Drizzle ORM |
| 認証 | Better-auth |
| 動画 | YouTube IFrame 埋め込み |
| ファイル保存 | Vercel Blob |
| デプロイ | Vercel |

---

## 決定事項

| 項目 | 決定内容 | 理由 |
|------|----------|------|
| 認証方式 | Google OAuth のみ | メール管理が不要でシンプル |
| UIライブラリ | なし（Tailwind CSS のみ） | 依存を減らし柔軟性を保つ |
| 動画配信 | YouTube 埋め込みのみ | 自前配信コスト不要 |
| サムネイル保存 | Vercel Blob | Vercel のファイルシステムは永続しないため |
| 決済 | なし | ログイン会員は全コース無料閲覧 |
| 管理者 | 単一（自分のみ） | DB で role = 'admin' に直接設定 |

---

## コンテンツ構造

```
コース
  └── セクション
        └── レッスン（YouTube動画）
```

- コース：サムネイル・タイトル・説明を持つ
- セクション：コース内の章分け
- レッスン：YouTube の動画 ID または URL で登録

---

## 機能一覧

### 受講者（ログイン済み）

| 機能 | 説明 |
|------|------|
| コース一覧 | 公開コースをカード形式で表示 |
| コース詳細 | セクション・レッスン一覧と進捗率を表示 |
| レッスン視聴 | YouTube動画を埋め込みで再生 |
| 進捗管理 | レッスンを「完了済み」にできる |

### 未ログインユーザー

- コース一覧・詳細は閲覧可能
- レッスン視聴・進捗記録にはログインが必要

### 管理者（`/admin`）

| 機能 | 説明 |
|------|------|
| ダッシュボード | コース数・レッスン数を表示 |
| コース作成・編集・削除 | タイトル・説明・サムネイルを管理 |
| カリキュラム編集 | セクション・レッスンの追加・削除 |
| サムネイルアップロード | JPEG / PNG / WebP を Vercel Blob に保存 |

---

## データベーススキーマ

```
user            Better-auth が管理（id, name, email, role, ...）
session         Better-auth が管理
account         Better-auth が管理（Google OAuthトークン）
verification    Better-auth が管理

courses
  id, title, description, thumbnail_path, created_at, updated_at

chapters        （セクション）
  id, course_id, title, order_index

lessons
  id, chapter_id, title, youtube_video_id, duration_seconds, order_index

user_progress
  id, user_id, lesson_id, is_completed, completed_at
```

---

## ページ構成

| URL | 説明 | 認証 |
|-----|------|------|
| `/` | コース一覧 | 不要 |
| `/courses/[id]` | コース詳細 | 不要 |
| `/courses/[id]/lessons/[id]` | レッスン視聴 | 不要（進捗記録はログイン必要） |
| `/login` | Google ログイン | - |
| `/admin` | 管理ダッシュボード | admin のみ |
| `/admin/courses` | コース一覧（管理） | admin のみ |
| `/admin/courses/new` | コース作成 | admin のみ |
| `/admin/courses/[id]` | コース編集 | admin のみ |
| `/admin/courses/[id]/chapters` | カリキュラム編集 | admin のみ |

---

## 環境変数

```env
# Turso
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

# Better-auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=...
```

---

## セットアップ手順

```bash
npm install        # 依存パッケージインストール
npm run db:push    # DBマイグレーション（Turso設定後）
npm run dev        # 開発サーバー起動
```

### 管理者の設定
1. Googleログインで一度サインイン
2. `npm run db:studio` で `user` テーブルを開く
3. 自分のアカウントの `role` を `admin` に変更

### Google OAuth の設定
1. Google Cloud Console でOAuthクライアントIDを作成
2. リダイレクトURIに追加：
   - 開発: `http://localhost:3000/api/auth/callback/google`
   - 本番: `https://your-domain.com/api/auth/callback/google`

### Vercel Blob の設定
1. Vercel ダッシュボード → Storage → Blob ストアを作成
2. `BLOB_READ_WRITE_TOKEN` を環境変数に設定
3. ローカル開発時: `npx vercel env pull .env.local`
