// Публичная точка входа пакета @core/ui-kit. У каждой папки компонента в
// src/components/ui уже есть свой отобранный бочонок (index.ts) —
// публичный API этого компонента, — а этот файл просто реэкспортирует их
// все, плюс помощник слияния классов `cn`, с которым компоненты обычно
// собирают.
//
// Импорт ради побочного эффекта: чтобы у сборки Tailwind здесь вообще был
// CSS-файл для обработки (эта точка входа — собственный граф модулей
// библиотеки; main.tsx, который импортирует её для локального демо, в
// библиотечную сборку не входит). Извлекается в dist/index.css через
// `cssCodeSplit: false`; принимающие приложения импортируют его один раз
// рядом с JS (см. поле «exports» в package.json).
import "./index.css"

// Конвенции, действующие на все компоненты (нативные пропсы, имена `size`,
// `aria-invalid`, forwardRef, `data-slot`, предел размера файла) — в
// docs/conventions.md.
export { cn } from "./lib/utils"

// <<< components: список ниже держит scripts/sync-exports.mjs, руками не правьте
export * from "./components/ui/accordion-card"
export * from "./components/ui/accordion-list"
export * from "./components/ui/autocomplete"
export * from "./components/ui/badge"
export * from "./components/ui/bank-card"
export * from "./components/ui/banner"
export * from "./components/ui/block-widget"
export * from "./components/ui/button"
export * from "./components/ui/button-menu"
export * from "./components/ui/calendar"
export * from "./components/ui/card"
export * from "./components/ui/card-account"
export * from "./components/ui/card-box"
export * from "./components/ui/checkbox"
export * from "./components/ui/chips"
export * from "./components/ui/close-cross"
export * from "./components/ui/combobox"
export * from "./components/ui/count-button"
export * from "./components/ui/date-picker"
export * from "./components/ui/divider"
export * from "./components/ui/dropdown"
export * from "./components/ui/employee-menu"
export * from "./components/ui/empty-search"
export * from "./components/ui/error-page"
export * from "./components/ui/event"
export * from "./components/ui/file-upload"
export * from "./components/ui/filter-table"
export * from "./components/ui/grid"
export * from "./components/ui/header"
export * from "./components/ui/header-menu"
export * from "./components/ui/icon"
export * from "./components/ui/informer"
export * from "./components/ui/input"
export * from "./components/ui/issue-item"
export * from "./components/ui/item"
export * from "./components/ui/item-information-field"
export * from "./components/ui/list-of-errors"
export * from "./components/ui/loader"
export * from "./components/ui/mail-feed"
export * from "./components/ui/menu-item"
export * from "./components/ui/modal"
export * from "./components/ui/notification"
export * from "./components/ui/nps"
export * from "./components/ui/otp"
export * from "./components/ui/pagination"
export * from "./components/ui/progress-bar"
export * from "./components/ui/radio"
export * from "./components/ui/range-input"
export * from "./components/ui/scrollbar"
export * from "./components/ui/select"
export * from "./components/ui/selection-button"
export * from "./components/ui/shimmer"
export * from "./components/ui/sidebar"
export * from "./components/ui/sortable"
export * from "./components/ui/status-screen"
export * from "./components/ui/steps"
export * from "./components/ui/switcher"
export * from "./components/ui/table"
export * from "./components/ui/table-top"
export * from "./components/ui/tabs"
export * from "./components/ui/tag"
export * from "./components/ui/textarea"
export * from "./components/ui/thumbnail"
export * from "./components/ui/title"
export * from "./components/ui/toast-message"
export * from "./components/ui/toggle"
export * from "./components/ui/tooltip"
export * from "./components/ui/top-fixed-message"
export * from "./components/ui/up-button"
// >>> components
