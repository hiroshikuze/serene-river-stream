# Release Plan — Serene River Stream

## タイトル
`Infinite River Journey` → **Serene River Stream**

## 公開先
GitHub Pages (`hiroshikuze/newapp2026-river-rafting`)
URL: `https://hiroshikuze.github.io/newapp2026-river-rafting/`

---

## 実装チェックリスト

### Phase 1（資産不要・コードのみ）

| # | 項目 | ファイル | 状態 |
|---|------|----------|------|
| 1 | タイトル名変更 | index.html / package.json / README.md | 未 |
| 2 | SEO meta タグ | index.html | 未 |
| 3 | オンライン復帰時の自動リロード | src/main.ts or 独立モジュール | 未 |
| 4 | 実行ページ→GitHub リンク（UI 内） | index.html + Controls.ts | 未 |
| 5 | Umami アクセス解析スクリプト | index.html | 未（サイト ID は別途入力） |
| 6 | README.md 全面改訂 | README.md | 未 |

### Phase 2（アセット待ち）

| # | 項目 | 備考 |
|---|------|------|
| 7 | favicon | ユーザーが画像提供後に追加 |
| 8 | OpenGraph 画像 | ユーザーが画像提供後に追加 |

---

## 各項目の詳細方針

### 2. SEO meta タグ
```html
<meta name="description" content="...">
<meta name="theme-color" content="#6a8898">
<meta property="og:title" content="Serene River Stream">
<meta property="og:description" content="...">
<meta property="og:image" content="...">  <!-- Phase 2 -->
<meta property="og:url" content="https://hiroshikuze.github.io/newapp2026-river-rafting/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### 3. オンライン復帰時の自動リロード
```typescript
// オフライン→オンライン復帰時にリロード（ページが生きていれば再接続）
window.addEventListener('online', () => location.reload());
```
オフライン中のバナー表示も検討（任意）。

### 4. 実行ページ→GitHub リンク
UI 右上の FPS ボタンの下に「GitHub」リンクを小さく配置。
外部リンクアイコン＋`target="_blank"` で GitHub リポジトリへ。

### 5. Umami
```html
<script defer
  src="https://analytics.umami.is/script.js"
  data-website-id="YOUR_SITE_ID">
</script>
```
サイト ID はユーザーが Umami ダッシュボードで取得後に差し替え。

### 6. README.md 構成
1. タイトル + バッジ（Stars / License）
2. 概要（日英）
3. デモ GitHub Pages リンク（大きめボタン表示）
4. スクリーンショット（Phase 2）
5. 特徴（Feature list）
6. ローカル実行方法
7. 使用技術
8. ライセンス
9. 作者へのリンク

---

## 保留・将来課題
- PWA 対応（Service Worker / オフラインキャッシュ）：現状は自動リロードのみで代替
- favicon / OG 画像：Phase 2
- Umami サイト ID：ユーザー入力待ち
