# DNA Guard — Clinical Verification

The **verifyBrandDNA** script acts like a pharmacist checking a prescription,
ensuring the "Ivory & Gold" design tokens are never accidentally broken.

## Usage

Import and call on app mount (e.g., in `main.tsx` or `App.tsx`):

```tsx
import { verifyBrandDNA } from "@/lib/verifyBrandDNA";

// In your root component or main.tsx, after React renders:
useEffect(() => {
  verifyBrandDNA();
}, []);
```

Or call once at startup in `main.tsx`:

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import { verifyBrandDNA } from "@/lib/verifyBrandDNA";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Run DNA verification after first paint
requestAnimationFrame(() => verifyBrandDNA());
```

## What It Checks

- `--soft-ivory` = `#F8F8FF`
- `--maroon` = `#800020`
- `--shiny-gold` = `#C5A028`

If any mismatch: `⚠️ ASPER BRAND ALERT` in console.\
If all match:
`✅ Asper Beauty Shop: Brand DNA Verified. Ready for consultation.`

## Dependencies

Ensure `src/index.css` defines these in `:root` (already configured).
