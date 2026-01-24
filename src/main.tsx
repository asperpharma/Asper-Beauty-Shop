import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPerformanceOptimizations } from "./lib/performance";

// Initialize performance optimizations
initPerformanceOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
