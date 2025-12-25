import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"

// If you don't want to use the plugin remove tsconfigPaths() from plugins and keep the alias
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // make @ refer to /src
      "@": path.resolve(__dirname, "src"),
    },
  },
})

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
}));
