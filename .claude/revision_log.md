# Revision Log

This file tracks recurring mistake patterns. Read this at the start of every session before doing any work.

## Format

```text
## YYYY-MM-DD — <short title>
- Pattern: <what went wrong>
- Trigger: <what situation causes this>
- Fix: <what to do instead>
```

---

<!-- Add entries below as mistakes are identified -->

## 2026-05-07 — バイナリ画像を GitHub MCP 経由で push しようとしてタイムアウト
- Pattern: apple-touch-icon.png など大きな画像を GitHub MCP の file API に base64 で渡してストリームタイムアウトを起こした。
- Trigger: 画像ファイルを push するときに MCP を使う判断をしたとき。
- Fix: 画像（バイナリ）は必ず git CLI（`git add / commit / push`）で処理する。MCP file API はテキストファイル専用と考える。50 KB 超は push 前に `sharp` / `pngquant` で最適化する。

## 2026-05-07 — 川のカメラを川の中心に固定し、曲がりが見えない実装を繰り返した
- Pattern: メアンダリング（蛇行）を実装したのにカメラが常に川の中心を向いており、ユーザーから見ると直線の道路・溝・運河に見えた。
- Trigger: 「川を曲げる」という指示を受け、ジオメトリの曲率だけ変えてカメラ位置を変えなかったとき。
- Fix: 川の「曲がり」を見せるにはカメラを川の外側オフセットに置き、進行方向に遅延（camera lag）を加えて「曲がりの先が山に隠れる」構図を作る必要がある。実装前にユーザーに期待カメラ構図を確認する。

## 2026-05-07 — 大きなフィーチャーを atomic なステップに分割せず、中断時に状態を失った
- Pattern: 雲・リボンジオメトリ・メアンダリングなどの実装を 1 セッションで完結させようとして使用量制限に達し、未コミットの状態で中断した。
- Trigger: TodoWrite のステップが完了してもコミットせずに次のステップへ進んだとき。
- Fix: TodoWrite の各ステップを「それ単体でコミット可能な単位」に分割する。ステップ完了 → コミット → 次のステップ、のサイクルを守る。
