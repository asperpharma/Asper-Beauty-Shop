
import csv
import re
import os

INPUT_CSV = r"C:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\1-3999 pro (1).csv"
OUTPUT_REPORT = r"C:\Users\C-R\Desktop\Asper Beauty Box\asper_correction_report.csv"
CLEANLINESS_REPORT = r"C:\Users\C-R\Desktop\Asper Beauty Box\asper_cleanliness_report.md"

def check_title_case(text):
    if not text: return False
    # Check if mostly uppercase (allow some short words like 'SPF', 'UV')
    words = text.split()
    upper_count = sum(1 for w in words if w.isupper() and len(w) > 3)
    if upper_count > len(words) / 2:
        return False
    # Basic Title Case check (first letter upper) - lenient
    return text[0].isupper()

def check_luxury_tone(text):
    if not text: return True
    banned_words = ["cheap", "discount", "clearance", "bulk", "lorem ipsum", "test product"]
    lower_text = text.lower()
    for word in banned_words:
        if word in lower_text:
            return False, word
    return True, ""

def validate_catalog():
    issues = []
    
    try:
        with open(INPUT_CSV, mode='r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            
            for i, row in enumerate(reader, start=2): # Start at 2 for header + 0-index
                has_issue = False
                row_issues = []
                
                title = row.get('title', '')
                desc = row.get('descriptionHtml', '')
                image_src = row.get('images/0/src', '')
                handle = row.get('handle', '')
                vendor = row.get('vendor', '')

                # 1. Product Name Checks
                if not title:
                    row_issues.append("Missing Product Name")
                elif not check_title_case(title):
                    row_issues.append("Name not in Title Case (Avoid ALL CAPS)")

                # 2. Image Checks
                if not image_src:
                    row_issues.append("Missing High-Res Image")
                elif "placeholder" in image_src.lower():
                    row_issues.append("Image is a Placeholder")
                
                # 3. Description Checks
                is_lux, banned = check_luxury_tone(desc)
                if not is_lux:
                    row_issues.append(f"Description contains forbidden term: '{banned}'")
                
                if "lorem ipsum" in desc.lower():
                    row_issues.append("Contains 'Lorem Ipsum' placeholder text")

                # 4. Linkage Check (Basic) - Does image look related to brand/handle?
                # This is heuristic.
                # if handle and handle not in image_src: 
                #    row_issues.append("Image URL might not match Product Handle") 

                if row_issues:
                    issues.append({
                        "Row": i,
                        "Product": title,
                        "Issues": "; ".join(row_issues),
                        "Status": "Needs Correction"
                    })
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    # Write CSV Report
    with open(OUTPUT_REPORT, mode='w', encoding='utf-8', newline='') as outfile:
        fieldnames = ["Row", "Product", "Issues", "Status"]
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(issues)

    # Write Markdown Summary
    with open(CLEANLINESS_REPORT, mode='w', encoding='utf-8') as mdfile:
        mdfile.write("# Asper Brand Integrity & Cleanliness Report\n\n")
        mdfile.write(f"**Total Products Audited**: {i-1}\n") # i is last index
        mdfile.write(f"**Issues Found**: {len(issues)}\n\n")
        
        if len(issues) == 0:
            mdfile.write("## Status: ✅ PERFECT\n")
            mdfile.write("No 'Technical Junk' or 'Luxury Violations' found.\n")
        else:
            mdfile.write("## Status: ⚠️ NEEDS POLISH\n")
            mdfile.write("The following critical updates are required to meet the Asper Standard:\n\n")
            
            # Group by issue type for summary
            missing_img = sum(1 for x in issues if "Missing High-Res Image" in x['Issues'])
            caps_name = sum(1 for x in issues if "Title Case" in x['Issues'])
            placeholders = sum(1 for x in issues if "Lorem Ipsum" in x['Issues'])
            
            mdfile.write("### Data Hygiene Summary\n")
            mdfile.write(f"- **Missing Images**: {missing_img}\n")
            mdfile.write(f"- **Formatting Errors (ALL CAPS)**: {caps_name}\n")
            mdfile.write(f"- **Content Placeholders**: {placeholders}\n\n")
            
            mdfile.write("### Action Plan\n")
            mdfile.write("1.  **Open** `asper_correction_report.csv`.\n")
            mdfile.write("2.  **Filter** by 'Issues'.\n")
            mdfile.write("3.  **Correct** the highlighted rows in your Master Excel sheet.\n4.  **Re-upload** to Shopify.\n")

if __name__ == "__main__":
    validate_catalog()
    print("Validation complete. Reports generated.")
