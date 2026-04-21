import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "AuddWidget",
      formats: ["iife"],
      fileName: () => "widget.js",
    },
    outDir: resolve(__dirname, "../../apps/web/public"),
    emptyOutDir: false,
    minify: true,
  },
});
