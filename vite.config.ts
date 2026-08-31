import fs from "node:fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import dts from "vite-plugin-dts"

// Точки входа: корневой бочонок плюс бочонок каждого компонента. Компонентные
// нужны затем, чтобы `@core/ui-kit/button` резолвился в реальный файл: без
// собственной entry реэкспорт из `components/ui/button/index.ts` слился бы с
// потребителем и файла на диске не осталось.
const COMPONENTS_DIR = path.resolve(__dirname, "src/components/ui")

function componentEntries() {
  const entries: Record<string, string> = {
    index: path.resolve(__dirname, "src/index.ts"),
  }
  for (const dir of fs.readdirSync(COMPONENTS_DIR)) {
    const barrel = path.join(COMPONENTS_DIR, dir, "index.ts")
    if (fs.existsSync(barrel)) entries[`components/ui/${dir}/index`] = barrel
  }
  return entries
}

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
        // Иконки экспортируются по subpath (`@core/ui-kit/icons/lock`), так
        // что им нужны свои декларации.
        "src/icons/**/*.ts",
        "src/icons/**/*.tsx",
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
    // component development; that's unaffected by the build config.
    //
    // Сборка НЕ через `build.lib`, хотя это библиотека. В библиотечном
    // режиме Vite инлайнит ассеты в base64 принудительно и `assetsInlineLimit`
    // игнорирует: так 14 PNG и 5 шрифтов приезжали внутри index.js/index.css
    // (см. docs/size-baseline.md). Обычный режим + preserveModules даёт и
    // ассеты файлами, и модуль на файл, из-за чего потребитель может взять
    // один компонент вместо всего кита.
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      input: componentEntries(),
      // Без strict публичные экспорты вытрясаются: у обычного (не
      // библиотечного) режима entry считается приложением, и неиспользуемое
      // из него удаляется — index.js схлопывался в 20 байт.
      preserveEntrySignatures: "strict",
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
      output: {
        format: "es",
        // Модуль на файл — то, ради чего всё и затевалось: импорт кнопки
        // тянет кнопку, а не весь кит.
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        // CSS оставляем на прежнем пути (dist/index.css) — на него ссылается
        // экспорт "./style.css", менять его нельзя без ломки потребителей.
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith(".css")
            ? "index.css"
            : "assets/[name][extname]",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
}))
