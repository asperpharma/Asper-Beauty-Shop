import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
          host: "::",
          port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
          alias: {
                  "@": path.resolve(__dirname, "./src"),
          },
    },
    build: {
          // Raise the chunk size warning limit to 1MB to reduce noise
      chunkSizeWarningLimit: 1000,
          rollupOptions: {
                  output: {
                            manualChunks: {
                                        // Core React runtime
                              "vendor-react": ["react", "react-dom", "react-router-dom"],
                                        // UI component library
                                        "vendor-radix": [
                                                      "@radix-ui/react-accordion",
                                                      "@radix-ui/react-alert-dialog",
                                                      "@radix-ui/react-aspect-ratio",
                                                      "@radix-ui/react-avatar",
                                                      "@radix-ui/react-checkbox",
                                                      "@radix-ui/react-collapsible",
                                                      "@radix-ui/react-context-menu",
                                                      "@radix-ui/react-dialog",
                                                      "@radix-ui/react-dropdown-menu",
                                                      "@radix-ui/react-hover-card",
                                                      "@radix-ui/react-label",
                                                      "@radix-ui/react-menubar",
                                                      "@radix-ui/react-navigation-menu",
                                                      "@radix-ui/react-popover",
                                                      "@radix-ui/react-progress",
                                                      "@radix-ui/react-radio-group",
                                                      "@radix-ui/react-scroll-area",
                                                      "@radix-ui/react-select",
                                                      "@radix-ui/react-separator",
                                                      "@radix-ui/react-slider",
                                                      "@radix-ui/react-slot",
                                                      "@radix-ui/react-switch",
                                                      "@radix-ui/react-tabs",
                                                      "@radix-ui/react-toast",
                                                      "@radix-ui/react-toggle",
                                                      "@radix-ui/react-toggle-group",
                                                      "@radix-ui/react-tooltip",
                                                    ],
                                        // Form & validation libraries
                                        "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
                                        // Icons
                                        "vendor-icons": ["lucide-react"],
                                        // Supabase client
                                        "vendor-supabase": ["@supabase/supabase-js"],
                                        // Animation libraries
                                        "vendor-animation": ["framer-motion"],
                                        // Query & state management
                                        "vendor-query": ["@tanstack/react-query"],
                            },
                  },
          },
    },
}));
