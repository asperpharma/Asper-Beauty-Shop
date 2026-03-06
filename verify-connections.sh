#!/bin/bash

# Asper Beauty Shop - Connection Verification Script
# Run this script to verify all integrations are properly configured

echo "🔍 Asper Beauty Shop - Connection Verification"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
passed=0
failed=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((passed++))
    else
        echo -e "${RED}❌${NC} $2 (File not found: $1)"
        ((failed++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((passed++))
    else
        echo -e "${RED}❌${NC} $2 (Directory not found: $1)"
        ((failed++))
    fi
}

# Function to check string in file
check_string() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $3"
        ((passed++))
    else
        echo -e "${RED}❌${NC} $3 (Pattern not found in $1)"
        ((failed++))
    fi
}

echo "📁 Configuration Files"
echo "----------------------"
check_file ".env" "Environment variables (.env)"
check_file ".env.production" "Production environment (.env.production)"
check_file "lovable.config.json" "Lovable configuration"
check_file "vite.config.ts" "Vite configuration"
check_file "package.json" "Package configuration"
echo ""

echo "🌐 Domain Configuration"
echo "-----------------------"
check_string "package.json" "www.asperbeautyshop.com" "Custom domain in package.json"
check_string "index.html" "www.asperbeautyshop.com" "Custom domain in index.html"
check_string "public/sitemap.xml" "www.asperbeautyshop.com" "Custom domain in sitemap"
check_string "public/robots.txt" "www.asperbeautyshop.com" "Custom domain in robots.txt"
check_file "public/_redirects" "SPA redirects configuration"
echo ""

echo "🛍️ Shopify Integration"
echo "----------------------"
check_file "src/lib/shopify.ts" "Shopify integration library"
check_string "src/lib/shopify.ts" "lovable-project-milns.myshopify.com" "Shopify store configured"
check_string "src/lib/shopify.ts" "2025-07" "Shopify API version configured"
check_string "src/lib/shopify.ts" "sanitizeSearchTerm" "GraphQL injection protection"
echo ""

echo "🗄️ Supabase Integration"
echo "-----------------------"
check_string ".env" "rgehleqcubtmcwyipyvi" "Supabase project ID"
check_string ".env" "VITE_SUPABASE_URL" "Supabase URL configured"
check_file "supabase/config.toml" "Supabase configuration"
check_dir "supabase/functions/beauty-assistant" "Beauty Assistant function"
check_dir "supabase/functions/bulk-product-upload" "Bulk Upload function"
echo ""

echo "⚛️ React Application"
echo "--------------------"
check_file "src/App.tsx" "Main application component"
check_file "src/main.tsx" "Application entry point"
check_file "src/stores/cartStore.ts" "Cart store (Zustand)"
check_file "src/stores/wishlistStore.ts" "Wishlist store (Zustand)"
check_file "src/contexts/LanguageContext.tsx" "i18n context (EN/AR)"
echo ""

echo "🎨 UI Components"
echo "----------------"
check_dir "src/components/ui" "shadcn/ui components"
check_file "src/components/Header.tsx" "Header component"
check_file "src/components/Footer.tsx" "Footer component"
check_file "src/components/ProductCard.tsx" "Product card component"
check_file "src/components/CartDrawer.tsx" "Cart drawer component"
check_file "src/components/BeautyAssistant.tsx" "Beauty Assistant AI"
echo ""

echo "📊 Product System"
echo "-----------------"
check_file "src/lib/categoryMapping.ts" "Category mapping (6 collections)"
check_file "src/lib/productUtils.ts" "Product utilities (translation)"
check_string "src/lib/categoryMapping.ts" "skin-care" "Skin Care collection"
check_string "src/lib/categoryMapping.ts" "hair-care" "Hair Care collection"
check_string "src/lib/categoryMapping.ts" "make-up" "Make Up collection"
echo ""

echo "🔍 SEO & PWA"
echo "------------"
check_file "public/manifest.json" "PWA manifest"
check_file "public/sitemap.xml" "Sitemap"
check_file "public/robots.txt" "Robots.txt"
check_file "public/favicon.png" "Favicon"
echo ""

echo "📚 Documentation"
echo "----------------"
check_file "README.md" "README documentation"
check_file ".github/copilot-instructions.md" "Copilot instructions"
check_file "DEPLOYMENT_GUIDE.md" "Deployment guide"
check_file "CONNECTION_STATUS.md" "Connection status"
check_file "ARCHITECTURE_DIAGRAM.md" "Architecture documentation"
echo ""

echo "🔧 Build System"
echo "---------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Dependencies installed"
    ((passed++))
else
    echo -e "${YELLOW}⚠️${NC} Dependencies not installed (run: npm install)"
fi

if [ -d "dist" ]; then
    echo -e "${GREEN}✅${NC} Build output exists"
    ((passed++))
    check_file "dist/index.html" "Built index.html"
    check_file "dist/_redirects" "Built redirects file"
else
    echo -e "${YELLOW}⚠️${NC} Build not run yet (run: npm run build)"
fi
echo ""

echo "=============================================="
echo -e "Results: ${GREEN}${passed} passed${NC}, ${RED}${failed} failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your site is fully connected.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure DNS CNAME record (see DEPLOYMENT_GUIDE.md)"
    echo "2. Run 'npm run dev' to start development server"
    echo "3. Run 'npm run build' to create production build"
    echo "4. Deploy to Lovable platform"
    exit 0
else
    echo -e "${RED}⚠️ Some checks failed. Please review the errors above.${NC}"
    exit 1
fi
