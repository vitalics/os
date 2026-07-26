import { defineConfig } from "vitest/config";
import { domFramework as youneedPlugin } from "@youneed/vite-plugin";

export default defineConfig({
  plugins: [youneedPlugin()],
  test: {
    environment: "happy-dom",
    globals: true,
    exclude: ["node_modules", "dist", "e2e"],
  },
});
