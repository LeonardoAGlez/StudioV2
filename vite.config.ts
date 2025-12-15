import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      allowedHosts: ["studiov2.onrender.com", "*"],
      proxy: {
        "/fibo": {
          target: env.FIBO_API_URL || "https://engine.prod.bria-api.com/v2",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fibo/, ""),
        },
      },
    },
    plugins: [react()],
    define: {
      // Gemini API Configuration
      "process.env.API_KEY": JSON.stringify(env.API_KEY || env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      // FIBO API Configuration
      "process.env.VITE_FIBO_API_URL": JSON.stringify(env.FIBO_API_URL),
      "process.env.VITE_FIBO_API_KEY": JSON.stringify(env.FIBO_API_KEY),
      "process.env.VITE_FIBO_GENERATE_PATH": JSON.stringify(env.FIBO_GENERATE_PATH || "/fibo/image/generate"),
      "process.env.VITE_FIBO_AUTH_HEADER": JSON.stringify(env.FIBO_AUTH_HEADER || "api_token"),
      // Backend API
      "process.env.VITE_API_BASE_URL": JSON.stringify(env.VITE_API_BASE_URL || "http://localhost:5000/api"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
