# Release Plan — Serene River Stream

## タイトル

`Infinite River Journey` → **Serene River Stream**

## 公開先

GitHub Pages (`hiroshikuze/serene-river-stream`)
URL: `https://hiroshikuze.github.io/serene-river-stream/`

---

## 実装チェックリスト

### Phase 1（資産不要・コードのみ）

| # | 項目 | ファイル | 状態 |
| --- | --- | --- | --- |
| 1 | タイトル名変更 | index.html/package.json/README.md | 未 |
| 2 | SEO meta タグ | index.html | 未 |
| 3 | オンライン復帰時の自動リロード | src/main.ts or 独立モジュール | 未 |
| 4 | 実行ページ→GitHub リンク（UI内） | index.html+Controls.ts | 未 |
| 5 | Umami アクセス解析スクリプト | index.html | 未（サイト ID は別途入力） |
| 6 | README.md 全面改訂 | README.md | 未 |

### Phase 2（アセット待ち）

| # | 項目 | 備考 |
| --- | --- | --- |
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
<meta property="og:url" content="https://hiroshikuze.github.io/serene-river-stream/">
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

UI右上のFPSボタンの下に「GitHub」リンクを小さく配置。
外部リンクアイコン＋`target="_blank"` でGitHubリポジトリへ。

### 5. Umami

```html
<script defer
  src="https://analytics.umami.is/script.js"
  data-website-id="YOUR_SITE_ID">
</script>
```

サイトIDはユーザーがUmamiダッシュボードで取得後に差し替え。

### 6. README.md 構成

1. タイトル + バッジ（Stars/License）
2. 概要（日英）
3. デモGitHub Pagesリンク（大きめボタン表示）
4. スクリーンショット（Phase 2）
5. 特徴（Feature list）
6. ローカル実行方法
7. 使用技術
8. ライセンス
9. 作者へのリンク

---

## 保留・将来課題

- PWA対応（Service Worker / オフラインキャッシュ）：現状は自動リロードのみで代替
- favicon / OG画像：Phase 2
- UmamiサイトID：ユーザー入力待ち
- 川を含む地形生成のアルゴリズムの改善。案としては以下のステップで、Python（numpy, matplotlib, noiseライブラリを使用）で実行可能なスクリプトを作成してください。
  - 1. 地形の生成:
    - 256x256のサイズで、Perlinノイズを用いたハイトマップ（標高マップ）を作成してください。
    - 複数のオクターブを重ねて、自然な起伏にしてください。
  - 1. 窪地の処理（Sinks Filling）:
    - 川が途中で止まらないよう、周囲より低い閉じた領域（窪地）をわずかに底上げする単純な処理を実装してください。
  - 1. 流量（Flow Accumulation）の計算:
    - 各ピクセルから、周囲8近傍でもっとも標高が低いピクセルへ「水」が流れると仮定します。
    - すべててのピクセルに初期値1の水を割り当て、高い場所から低い場所へ累積させていく流量マップを作成してください。
  - 1. 川の描画:
    - 流量マップがあるしきい値（例：全体のトップ5%）を超えたピクセルを「川」として定義します。
    - 元のハイトマップをグレースケールで表示し、その上に川のピクセルを青色でオーバーレイして表示してください。
