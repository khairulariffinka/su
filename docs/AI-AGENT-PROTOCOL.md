# AI Agent Documentation Protocol

> **Purpose:** Standard protocol for AI agents
> **Usage:** After completing any development session

---

## Session End Protocol

### Step 1: Update AGENTS.md
- [ ] Mark feature yang siap
- [ ] Update Decisions Log
- [ ] Update "Last Updated"

### Step 2: Update docs/current-state.md
- [ ] Update "Last Updated"
- [ ] Update feature list

### Step 3: Update docs/session-diary.md
- Add new entry at TOP

### Step 4: Update Work Diary (Global Memory)
```bash
WORK_DIARY_DIR="$HOME/.config/opencode/global-memory/work-diary"
mkdir -p "$WORK_DIARY_DIR"
WORK_DIARY="$WORK_DIARY_DIR/diary-$(date +%Y-%m).md"

if [ ! -f "$WORK_DIARY" ]; then
  cp "$HOME/.config/opencode/global-memory/work-diary/diary-YYYY-MM.md" "$WORK_DIARY" 2>/dev/null || true
fi

if [ -f "$WORK_DIARY" ]; then
  SESSION_DATE=$(date +%Y-%m-%d)
  SESSION_TIME=$(date +"%H:%M")
  PROJECT_NAME=$(basename "$PWD")
  
  sed -i "1i\\
### $SESSION_DATE - Session #\\
**Time:** $SESSION_TIME\\
**Project:** $PROJECT_NAME\\
**Duration:** ~\\
\\
**Summary:**\\
- Initial setup\\
\\
**Tasks:**\\
- [x] Project initialization\\
\\
---\\
" "$WORK_DIARY"
fi
```

### Step 5: Git Commit
```bash
git add -A
git commit -m "feat: description"
```

---

## Quick Reference

| File | Purpose |
|------|---------|
| `AGENTS.md` | AI context |
| `docs/current-state.md` | Snapshot |
| `docs/session-diary.md` | Log |

---

**Version:** 1.0