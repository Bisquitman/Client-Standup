import { defineConfig } from "vite";
import Legacy from "@vitejs/plugin-legacy";
import autoprefixer from "autoprefixer";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        qr: "./qr.html",
      },
    },
  },
  plugins: [
    Legacy({
      targets: ["defaults", "IE >= 8"],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {},
    },
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
