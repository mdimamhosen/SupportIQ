import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 8000,
    strictPort: true,
    host: true,
  },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});