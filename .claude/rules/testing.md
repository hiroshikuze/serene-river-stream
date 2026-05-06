# Testing Policy

## このプロジェクト固有の制約

### 仕様確定（Docs）の代替
- SPEC.md が「何を作るか」の仕様ドキュメントを担う。
- コードより先に SPEC.md に仕様が書かれていれば、Principle 7 の Docs ステップとして成立する。

### テスト戦略
- **型検査**：`npm run typecheck`（`tsc --noEmit`）が主要な自動検証ゲート。
- **ロジックテスト**：純粋関数（RNG、バイオーム補間など）に対してのみユニットテストを追加する価値がある。
- **ビジュアル検証**：Three.js / WebGL の描画品質（雲の形、ライティング、バイオームの色味など）は人間が実ブラウザで確認するしかない。

### GitHub Actions + Playwright の限界
- **可能**：ページロード、ボタンの存在・クリック動作、DOM状態変化などの非ビジュアルテスト。
- **不可**：WebGL 描画品質の検証。GitHub Actions ランナーは GPU を持たず、WebGL がソフトウェアラスタライザー（SwiftShader）で動作するため、実ブラウザとの出力が乖離し、スクリーンショット比較は意味をなさない。
- → 3D シーンの「見た目の正しさ」は CI では検証できない。人間の視認が唯一の手段。

## Rules（全プロジェクト共通）

- Does a new public function exist without a test? → Add a test before merging.
- Is the test file co-located with the source file? → Yes (e.g., `foo.test.ts` next to `foo.ts`).
- Does a test touch the network or filesystem? → Mock it.

## Commands

```bash
# 型検査（主要な自動検証ゲート）
npm run typecheck

# ユニットテスト（追加後に記載）
# npm test
# npm test -- src/terrain/biomes.test.ts
```
