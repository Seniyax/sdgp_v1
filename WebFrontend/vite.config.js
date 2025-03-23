import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://sdgpv1-production.up.railway.app/",
        changeOrigin: true,
        secure: false, // Set to true if using HTTPS
      },
    },
  },
});
