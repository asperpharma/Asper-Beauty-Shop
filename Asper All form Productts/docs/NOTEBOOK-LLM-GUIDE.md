# Notebook LLM – How to Run and What to Change

Use the **Notebook LLM** to call Gemini from a Jupyter notebook for product
copy, catalog text, or experiments.

---

## 1. One-time setup

### Install Python deps

From the project root (`Asper All form Productts`):

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop\Asper All form Productts"
pip install -r notebooks/requirements-notebooks.txt
```

Or:

```powershell
pip install jupyter google-generativeai pandas python-dotenv
```

### Set your API key

Get a key from [Google AI Studio](https://aistudio.google.com/apikey), then
either:

- **Option A – Environment variable (recommended)**\
  PowerShell:

  ```powershell
  $env:GOOGLE_API_KEY = "your-key-here"
  ```

  Then start Jupyter from the same terminal.

- **Option B – In the notebook**\
  Open `notebooks/llm-asper.ipynb`, find the cell that sets `API_KEY`, and
  replace `"YOUR-API-KEY"` with your key (don’t commit that file if it contains
  the key).

---

## 2. Run the notebook

```powershell
cd "c:\Users\C-R\Desktop\Asper-Beauty-Shop\Asper All form Productts"
jupyter notebook notebooks/llm-asper.ipynb
```

Or open the folder in VS Code/Cursor and open `llm-asper.ipynb`, then run the
cells.

---

## 3. What you can change

| Goal                   | Where / what to change                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Different model**    | In the notebook: `genai.GenerativeModel("gemini-2.0-flash")` → e.g. `"gemini-1.5-pro"`.                       |
| **Your catalog CSV**   | In the notebook: set `CATALOG_PATH` to your CSV path (e.g. `../Asper_Catalog_FINAL_READY.csv`).               |
| **CSV columns**        | In the last cell, change `"Title"` and `"Product Type"` to match your CSV column names.                       |
| **Prompt / tone**      | Edit the `prompt` string in the “Simple LLM call” cell or inside `describe_product()`.                        |
| **Batch descriptions** | Add a loop over `df.iterrows()`, call `describe_product()` per row, and write results to a new column or CSV. |

---

## 4. File layout

```
Asper All form Productts/
  notebooks/
    llm-asper.ipynb      ← main notebook
    requirements-notebooks.txt
  docs/
    NOTEBOOK-LLM-GUIDE.md  ← this file
```

---

## 5. Optional: use .env for the key

In the project root create `.env` (already gitignored) with:

```
GOOGLE_API_KEY=your-key-here
```

In the first code cell of the notebook you can add:

```python
from dotenv import load_dotenv
load_dotenv()
```

Then the notebook will use `GOOGLE_API_KEY` from `.env` if you didn’t set it in
the environment.
