import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "preview",
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "classic-script",
      transformIndexHtml(html) {
        return html
          .replace(' type="module" crossorigin', " defer")
          .replaceAll(" crossorigin", "");
      },
    },
  ],
  build: {
    outDir: "../.showcase-dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
