#!/usr/bin/env node
/**
 * Generates products-data.xlsx for bulk upload testing.
 * Uses exceljs (already in package.json).
 */
import ExcelJS from "exceljs";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "products-data.xlsx");

const SAMPLE_PRODUCTS = [
  {
    title: "Sample Moisturizer",
    productType: "Moisturizer",
    description: "Test product for bulk upload",
    brand: "Asper",
  },
  {
    title: "Sample Serum",
    productType: "Serum",
    description: "Test serum for validation",
    brand: "Asper",
  },
  {
    title: "Sample Cleanser",
    productType: "Cleanser",
    description: "Test cleanser",
    brand: "Asper",
  },
];

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet("Products");

ws.columns = [
  { header: "title", key: "title", width: 30 },
  { header: "productType", key: "productType", width: 15 },
  { header: "description", key: "description", width: 40 },
  { header: "brand", key: "brand", width: 15 },
];

ws.addRows(SAMPLE_PRODUCTS);

const outDir = dirname(OUTPUT);
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

await wb.xlsx.writeFile(OUTPUT);
console.log(`Wrote ${OUTPUT}`);
