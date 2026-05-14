# Commit

型チェック → コミット → push の定型フローを実行します。

## 手順

1. **型チェック**
   ```bash
   npm run typecheck
   ```
   エラーがあれば中止。ユーザーに内容を日本語で報告してから修正を提案する。

2. **差分確認**
   - `git status` と `git diff --staged` で変更内容を確認する。
   - `.env` や秘密情報が含まれていないことを確認する。
   - 無関係なファイルがステージされていないことを確認する。

3. **コミット**
   - コミットメッセージは `.claude/rules/git.md` の形式に従う（`<type>: <imperative summary>`）。
   - バイナリ画像（> 50 KB）は git CLI で直接コミットする（GitHub MCP は使わない）。

4. **Push**
   ```bash
   git push -u origin <branch-name>
   ```
   ネットワークエラーの場合は指数バックオフ（2s → 4s → 8s → 16s）で最大4回リトライする。

5. **完了報告**
   コミット SHA・ブランチ名・変更ファイル一覧を日本語で報告する。
