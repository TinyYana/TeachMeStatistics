import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        descriptive: resolve(__dirname, "chapters/descriptive.html"),
        probability: resolve(__dirname, "chapters/probability.html"),
        binomial: resolve(__dirname, "chapters/binomial.html"),
        normal: resolve(__dirname, "chapters/normal.html")
      }
    }
  },
  test: {
    environment: "node"
  }
});
