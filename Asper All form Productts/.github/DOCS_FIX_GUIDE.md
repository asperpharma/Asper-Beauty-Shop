# Fixing Overwritten or Deprecated Documentation

Use this guide when a markdown/doc page was replaced with only a raw URL or
needs to be deprecated or redirected.

---

## 1. Decide the intent

- **Mistake** – The change was accidental; the original content should come
  back.
- **Deprecation/redirect** – The page is intentionally being retired; we should
  deprecate or redirect properly, not leave only a link.

---

## 2. If the change was a mistake: restore original content

- **Option A:** Revert the commit that overwrote the file (e.g.
  `git revert <commit-hash>` or restore the file from that commit).
- **Option B:** In the file’s **History** (e.g. on GitHub), open the version
  **before** the bad change, copy the full content, and replace the current file
  with it.

**Commit message example:**

```text
Restore [filename] guide content
```

Do **not** leave the page as a raw URL only.

---

## 3. If the page is being deprecated or redirected

- Do **not** replace the whole page with a single raw URL.
- Keep the document readable and add a clear deprecation/redirect notice.

**Do:**

- Keep (or add) YAML front matter at the top (e.g. `title`, `description`).
- Add a short, visible note at the top explaining that the guide is deprecated
  or moved.
- Include the new link inside a proper block (e.g. blockquote or paragraph) with
  context.

**Example – proper deprecation at the top:**

```markdown
---
title: Splitting a subfolder out into a new repository
---
```

```markdown
> **Note**\
> This guide has been deprecated. For up-to-date instructions, see the
> [Actions .github repository](https://github.com/actions/.github).
```

Or:

```markdown
> **Deprecation Notice**\
> This guide is no longer maintained. Please refer to
> [actions/.github](https://github.com/actions/.github) for any future updates.
```

**Don’t:**

- Leave a single line that is only a URL.
- Remove all original content without a clear note and link in a readable
  format.

---

## 4. Quick reference

| Problem             | Cause                          | Solution                                      |
| ------------------- | ------------------------------ | --------------------------------------------- |
| Content missing     | File overwritten with a URL    | Restore previous content (revert or History). |
| No deprecation note | Redirect intended but not done | Add front matter + blockquote with link.      |
| Only a raw URL      | Incomplete deprecation         | Add explanation and link in a proper block.   |

---

## 5. Step-by-step checklist

1. Check the **commit message** – was this a deprecation/redirect or an
   accidental overwrite?
2. **Restore** the original markdown if it was accidental.
3. If **deprecation/redirect** is intended:
   - Keep or add YAML front matter.
   - Add a clear deprecation/redirect note at the top.
   - Put the new URL in a readable markdown block with one sentence of context.
4. Commit with a clear message (e.g. “Restore … content” or “Deprecate … and
   link to …”).
