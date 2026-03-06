#!/usr/bin/env bash
# Key rotation: branch, optionally stop tracking secret files, commit, push.
# Usage:
#   ./scripts/rotate-and-push.sh
#   REMOVE_FILES=".env.secrets path/to/secret.json" ./scripts/rotate-and-push.sh
#   BRANCH=chore/rotate-keys ./scripts/rotate-and-push.sh

set -e
BRANCH="${BRANCH:-chore/rotate-keys}"
REMOVE_FILES="${REMOVE_FILES:-}"   # space-separated paths to remove from git tracking (not delete from disk)
COMMIT_MSG="${COMMIT_MSG:-chore: rotate keys / update config}"

echo "Branch: $BRANCH"
git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

if [ -n "$REMOVE_FILES" ]; then
  for f in $REMOVE_FILES; do
    if [ -f "$f" ]; then
      echo "Removing from index (keep on disk): $f"
      git rm --cached -- "$f" 2>/dev/null || true
    fi
  done
fi

git add .
git status
echo "---"
read -p "Commit and push? (y/N) " -n 1 -r; echo
if [[ $REPLY =~ ^[yY]$ ]]; then
  git commit -m "$COMMIT_MSG" || true
  git push origin "$BRANCH"
  echo "Pushed to origin/$BRANCH"
else
  echo "Skipped commit/push. Run manually: git commit -m \"$COMMIT_MSG\"; git push origin $BRANCH"
fi
