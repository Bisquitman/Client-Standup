import {defineConfig} from "vite";
import Legacy from "@vitejs/plugin-legacy";
import autoprefixer from "autoprefixer";

export default defineConfig({
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
