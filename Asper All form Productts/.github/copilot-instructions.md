# Copilot Instructions for Asper Beauty Shop Product Catalog

## Project Overview

This workspace is focused on managing, analyzing, and generating assets for a
large catalog of beauty products. The main automation is in
`generate_all_product_images.py`, which prepares prompts for AI-driven product
image generation based on catalog data.

## Key Components

- **Product Catalogs:** Multiple CSV files (e.g.,
  `Asper_Catalog_FINAL_READY - Copy (2).csv`) contain product data. The
  canonical file for image generation is set in the Python script.
- **Image Generation Script:** `generate_all_product_images.py` loads the
  catalog, deduplicates products, analyzes categories, and generates prompts for
  each product. Prompts are tailored by product type using the
  `CATEGORY_PROMPTS` dictionary.
- **Progress Tracking:** Image generation progress is tracked in
  `image_generation_progress.json`.
- **Output Directory:** Generated images (or placeholders) are saved to
  `Generated_AI_Images` (not present by default).

## Developer Workflows

- **Run Analysis & Prompt Generation:**
  - Execute `generate_all_product_images.py` directly to analyze the catalog and
    export a product list.
  - To generate prompts for images, use
    `generator.generate_batch(start_index=0, batch_size=10)` in an interactive
    Python session.
- **Catalog Updates:**
  - Update the catalog CSV referenced in the script to change the product set.
  - Ensure column names like `title`, `productType`, and `productId` are present
    and consistent.
- **Image Generation:**
  - The script prepares prompts for external AI tools (e.g., Antigravity).
    Actual image generation is not automated; use the prompts manually with your
    chosen tool.
- **Progress File:**
  - Progress is automatically saved after each product. If interrupted, rerun
    the script to resume.

## Conventions & Patterns

- **Prompt Templates:** Product type-specific prompts are defined in
  `CATEGORY_PROMPTS`. Add new types or update templates here.
- **Deduplication:** Products are deduplicated by `title` before processing.
- **Safe Filenames:** Product titles are sanitized for filenames using regex.
- **Batch Processing:** Use `generate_batch` for scalable image generation.

## Integration Points

- **External AI Image Generation:** Prompts are designed for use with
  Antigravity or similar tools. Integration is manual; see script comments for
  extension points.
- **CodeQL:** The repository includes a `codeql.yml` workflow for code scanning,
  but no build/test automation is present.

## Example Files

- `generate_all_product_images.py`: Main automation logic and conventions.
- `Asper_Catalog_FINAL_READY - Copy (2).csv`: Default product catalog for image
  generation.
- `image_generation_progress.json`: Tracks completed/skipped/failed products.

## Quickstart

1. Place/update your product catalog CSV in the workspace.
2. Run `generate_all_product_images.py` to analyze and prepare prompts.
3. Use the generated prompts with your preferred AI image tool.
4. Check `image_generation_progress.json` for status.

---

For questions or missing conventions, review the script or ask for
clarification. Please provide feedback on unclear or incomplete sections to
improve these instructions.
