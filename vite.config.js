import {defineConfig} from "vite";
export default defineConfig(({mode})=>({
  base:"./",
  build:{outDir: mode==="admin" ? "dist-admin" : "dist", emptyOutDir:true, chunkSizeWarningLimit:1500}
}));
