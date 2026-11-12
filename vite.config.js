import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react(), {
    name: "development-csp",
    apply: "serve",
    // O preâmbulo de HMR é inline; o build de produção mantém a CSP estrita.
    transformIndexHtml(html) { return html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, ""); },
  }],
  test: {
    environment: "node",
    include: ["src/**/*.test.{js,jsx}"],
  },
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) { if (id.includes("recharts")) return "charts"; },
      },
    },
  },
});
