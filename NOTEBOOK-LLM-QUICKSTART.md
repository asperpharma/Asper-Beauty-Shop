# Notebook LLM – Quick Start

The **Notebook LLM** connects to the same Gemini brain as your website. Use it for product copy, catalog descriptions, or experiments.

---

## Run the notebook

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop\Asper All form Productts"
pip install jupyter google-generativeai pandas python-dotenv
$env:GOOGLE_API_KEY = "your-gemini-key"
jupyter notebook notebooks/llm-asper.ipynb
```

Or open in Cursor: `Asper All form Productts/notebooks/llm-asper.ipynb` → Run cells.

---

## Connection to website

| Component | Role |
|-----------|------|
| **Notebook** | Offline: product descriptions, catalog text |
| **Asper Intelligence** (/intelligence) | Live chat + TTS in browser |
| **Beauty Assistant** | Concierge chatbot (Edge Function) |

All use **Google Gemini**. Same API key pattern: get from [Google AI Studio](https://aistudio.google.com/apikey).

---

## Full guide

`Asper All form Productts/docs/NOTEBOOK-LLM-GUIDE.md`
