import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      format: "cjs",
      file: "dist/index.cjs.js",
    },
    {
      format: "esm",
      file: "dist/index.esm.js",
    },
  ],
  plugins: [typescript()],
});
