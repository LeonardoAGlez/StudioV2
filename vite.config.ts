import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const fiboTarget = (env.FIBO_API_URL || "").replace(/\/+$/, "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      proxy: {
        "/fibo": {
          target: fiboTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/fibo/, ""),
        },
      },
    },
    plugins: [react()],
    define: {
      // Prefer GEMINI_API_KEY but fall back to API_KEY to match local env naming
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY || env.API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(
        env.GEMINI_API_KEY || env.API_KEY
      ),
      "process.env.FIBO_API_KEY": JSON.stringify(env.FIBO_API_KEY || ""),
      "process.env.FIBO_API_URL": JSON.stringify(env.FIBO_API_URL || ""),
      "process.env.FIBO_GENERATE_PATH": JSON.stringify(
        env.FIBO_GENERATE_PATH || ""
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
