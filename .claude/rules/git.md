# Git Workflow

## Branch Naming

- Feature: `feat/<short-description>`
- Bug fix: `fix/<short-description>`
- Claude-initiated: `claude/<short-description>-<id>`

## Commit Messages

- Format: `<type>: <imperative summary>` (≤ 72 chars)
- Types: `feat` | `fix` | `refactor` | `test` | `docs` | `chore`
- No period at end of subject line.
- Body explains *why*, not *what*.

## Checklist Before Push

- [ ] Tests pass locally.
- [ ] No unrelated files staged.
- [ ] Commit message follows the format above.
- [ ] No secrets or `.env` values in diff.
