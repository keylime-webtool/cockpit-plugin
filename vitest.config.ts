import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            cockpit: path.resolve(__dirname, "src/test/cockpitMock.ts"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts",
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/test/**", "src/**/*.d.ts", "src/**/__tests__/**"],
            reporter: ["text", "json-summary"],
            reportsDirectory: "./coverage",
        },
    },
});
