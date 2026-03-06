
$inputFile = "C:\Users\C-R\Desktop\Asper Beauty Box\Asper Beauty shop prodcuts\product apify\1-3999 pro (1).csv"
$outputFile = "C:\Users\C-R\Desktop\Asper Beauty Box\Asper_Catalog_CLEANED.csv"

Write-Host "Reading CSV from: $inputFile"

# Read the content
# We use [System.IO.File] to handle potential locking or encoding issues better than Get-Content for large files
$content = [System.IO.File]::ReadAllText($inputFile)

# 1. Remove <h1>English</h1> header
# Pattern: <h1>English</h1> (case insensitive)
$content = $content -replace "(?i)<h1>English</h1>", ""

# 2. Remove <span lang="AR-SA"> and closing </span>
# This pattern tries to be specific to the AR-SA span to avoid removing useful spans
$content = $content -replace '(?i)<span lang=""AR-SA""[^>]*>', "" 
$content = $content -replace '(?i)<span lang="AR-SA"[^>]*>', ""

# 3. Double check for the encoded version if CSV escaped quotes
$content = $content -replace '<h1>English</h1>', ""

Write-Host "Performing cleanup..."

# Save the cleaned file
[System.IO.File]::WriteAllText($outputFile, $content)

Write-Host "Success! Cleaned file saved to: $outputFile"
Write-Host "You can now upload $outputFile to Shopify."
