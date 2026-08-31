import type { IconProps } from "./types"

// icon / Symbol / CNY — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolCny({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M16.131 16.976v-1.622h-2.647v-1.328h2.647v-1.621h-1.904l4.15-7.451h-3.193l-3.125 5.986h-.088L8.816 4.954H5.623l4.17 7.451H7.889v1.621h2.646v1.328H7.889v1.622h2.646v2.07h2.949v-2.07z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.145 7.901v1.393H1.637V7.901zm0 2.39v1.385H1.637v-1.385zM4.93 8.157 7.394 2H10L6.606 9.376H5.224zM3.606 2 6.12 8.231l-.327 1.145H4.402L1 2zm3.118 5.745V14H4.218V7.745z"/></svg>
  )
}
