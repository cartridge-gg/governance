import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import mkcert from "vite-plugin-mkcert";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      exclude: ["fs"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    mkcert(), // Add mkcert for HTTPS development
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["starknet", "@argent/get-starknet"],
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
