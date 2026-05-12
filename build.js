#!/usr/bin/env node
import { build, context } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes("--watch");
const isProduction = process.env.NODE_ENV === "production";

const cockpitExternalPlugin = {
    name: "cockpit-external",
    setup(pluginBuild) {
        pluginBuild.onResolve({ filter: /^cockpit$/ }, () => ({
            path: "cockpit",
            namespace: "cockpit-global",
        }));
        pluginBuild.onLoad({ filter: /.*/, namespace: "cockpit-global" }, () => ({
            contents: "module.exports = cockpit;",
            loader: "js",
        }));
    },
};

const copyAssetsPlugin = {
    name: "copy-assets",
    setup(pluginBuild) {
        pluginBuild.onEnd(() => {
            const distDir = resolve(rootDir, "dist");
            if (!existsSync(distDir)) {
                mkdirSync(distDir, { recursive: true });
            }
            copyFileSync(
                resolve(rootDir, "src/index.html"),
                resolve(distDir, "index.html")
            );
            copyFileSync(
                resolve(rootDir, "manifest.json"),
                resolve(distDir, "manifest.json")
            );
        });
    },
};

const buildOptions = {
    entryPoints: [resolve(rootDir, "src/index.tsx")],
    bundle: true,
    outdir: resolve(rootDir, "dist"),
    target: ["es2021"],
    format: "iife",
    minify: isProduction,
    sourcemap: isProduction ? false : "linked",
    legalComments: "external",
    loader: {
        ".woff": "file",
        ".woff2": "file",
        ".svg": "file",
        ".jpg": "file",
        ".png": "file",
    },
    plugins: [
        cockpitExternalPlugin,
        sassPlugin({
            loadPaths: [resolve(rootDir, "node_modules")],
        }),
        copyAssetsPlugin,
    ],
    logLevel: "info",
};

if (isWatch) {
    const ctx = await context(buildOptions);
    await ctx.watch();
    console.log("Watching for changes...");
} else {
    await build(buildOptions);
}
