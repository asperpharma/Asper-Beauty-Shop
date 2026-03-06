# Check & Fix All Errors and Warnings

Use these commands to find and fix issues in the Asper Beauty Shop project.

---

## Quick commands (run from project root)

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop"
```

### 1. Lint (ESLint) — catches code quality issues

```powershell
npm run lint
```

**Auto-fix what can be fixed:**
```powershell
npm run lint -- --fix
```

### 2. TypeScript check — catches type errors

```powershell
npx tsc --noEmit
```

### 3. Build — catches compilation errors

```powershell
npm run build
```

### 4. All-in-one (run in order)

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

---

## Common issues and fixes

### Browserslist warning (caniuse-lite outdated)

**Symptom:** `Browserslist: browsers data is 8 months old`

**Fix (optional — warning only, build still works):**
```powershell
npm update caniuse-lite browserslist
```
Or: `npx update-browserslist-db@latest` (requires npm, not bun)

### ESLint errors

- **Unused vars:** Often safe to delete or prefix with `_` if intentionally unused
- **Missing deps:** Run `npm install`
- **Auto-fix:** `npm run lint -- --fix`

### TypeScript errors

- Check the file and line number in the output
- Add type annotations or fix the type mismatch
- Use `as` only when you're sure (e.g. `value as string`)

### Build errors

- Usually show the file and line — fix the reported issue
- Common: missing imports, syntax errors, undefined variables

---

## Optional: add a check script

Add to `package.json` scripts:

```json
"check": "npm run lint && tsc --noEmit",
"check:all": "npm run lint && tsc --noEmit && npm run build"
```

Then run:
```powershell
npm run check
npm run check:all
```

---

## IDE integration

- **VS Code / Cursor:** ESLint and TypeScript extensions show errors inline
- **Problems panel:** `Ctrl+Shift+M` (or `Cmd+Shift+M` on Mac) to see all issues

---

*Last updated: Feb 2025*
