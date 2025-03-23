/* global process */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_SERVER_URL,
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS
      },
    },
  },
});
