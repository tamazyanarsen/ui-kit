import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import dts from "vite-plugin-dts"

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      entryRoot: "src",
      include: [
        "src/index.ts",
        "src/lib/utils.ts",
        "src/components/ui/**/*.ts",
        "src/components/ui/**/*.tsx",
      ],
      exclude: ["**/*.stories.tsx", "**/*.test.tsx"],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // The demo app (index.html/App.tsx, served by `npm run dev`) needs
  // public/favicon.svg + icons.svg; the published library doesn't, so skip
  // copying them into dist during `vite build`.
  publicDir: command === "build" ? false : "public",
  build: {
    // This library ships as an npm package (@core/ui-kit) consumed by host
    // apps at build time, not as an HTML app — see src/index.ts for the
    // entry surface. `npm run dev` still serves index.html/App.tsx for local
    // component development; that's unaffected by build.lib.
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    cssCodeSplit: false,
    rollupOptions: {
      // react, react-dom and @base-ui/react hold module-level singleton
      // state (contexts, portals) — bundling them would give the host app
      // a second copy that doesn't share state with its own, so they're
      // peer dependencies the host must supply itself. Everything else
      // (cva, clsx, tailwind-merge, lucide-react, react-imask) is stateless
      // enough to bundle safely. @base-ui/react is imported via deep
      // subpaths everywhere (e.g. "@base-ui/react/accordion"), so this
      // matches the whole package, not just its root specifier.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        /^@base-ui\/react(\/.*)?$/,
      ],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
}))
