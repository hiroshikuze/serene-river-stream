# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Start

Read `.claude/revision_log.md` before starting any work to internalize past mistake patterns.

## Core Principles

### 1. Plan Mode Default
- Is the task 3 or more steps? → Present a plan and get approval before implementing.
- Is it a single-step fix? → Proceed directly.

### 2. Self-Improvement Loop
- Did a mistake occur? → Append the pattern to `.claude/revision_log.md`.
- At the start of every session, read `.claude/revision_log.md` before doing any work.

### 3. Verification Before Done
- Before marking a task complete, ask: "Would a staff engineer approve this as-is?"
- If the answer is no, fix it first.

### 4. Subagent Strategy
- Is the task research or analysis (not implementation)? → Delegate to a subagent to preserve main context.
- Is it a direct code change? → Handle in main context.

### 5. Demand Elegance
- Does the change involve a design decision? → Compare 2–3 approaches before choosing. Document the tradeoff in the PR description, not in code comments.
- Is it a small mechanical fix (typo, rename, one-liner)? → Skip the comparison.

### 6. Autonomous Bug Fixing
- Is the issue a bug? → Investigate and fix autonomously first.
- Does the fix require a design decision (changes public API, affects multiple systems)? → Stop and confirm before proceeding.

## Project Status

This repository is in early setup — no source code, build tooling, or tests exist yet. The `.gitignore` is configured for a Node.js project (npm, yarn, pnpm, Next.js, Nuxt, SvelteKit, Vite, etc.).

Once the project is scaffolded, update the following files with specifics:
- `.claude/rules/coding.md` — language/framework coding conventions
- `.claude/rules/testing.md` — test strategy and commands
- `.claude/rules/git.md` — branch naming, commit format, PR workflow

## Reference

- Coding conventions: `.claude/rules/coding.md`
- Testing policy: `.claude/rules/testing.md`
- Git workflow: `.claude/rules/git.md`
- Past mistake log: `.claude/revision_log.md`
