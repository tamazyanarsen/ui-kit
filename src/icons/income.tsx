import type { IconProps } from "./types"

// icon / income — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Income({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-104 -1652)"><defs><clipPath id="income-24-clip7_70326_26"><path fill="#fff" d="M104 1652h24v24h-24z"/></clipPath></defs><g clipPath="url(#income-24-clip7_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M116 1654c-5.523 0-10 4.48-10 10s4.477 10 10 10 10-4.48 10-10-4.477-10-10-10m-12 10c0-6.63 5.373-12 12-12s12 5.37 12 12-5.373 12-12 12-12-5.37-12-12m9-6c0-.55.448-1 1-1h3.75c1.127 0 2.208.45 3.005 1.24a4.26 4.26 0 0 1 0 6.02 4.28 4.28 0 0 1-3.005 1.24H115v1.5h1c.552 0 1 .45 1 1s-.448 1-1 1h-1v1c0 .55-.448 1-1 1s-1-.45-1-1v-1h-1c-.552 0-1-.45-1-1s.448-1 1-1h1v-1.5h-1c-.552 0-1-.45-1-1s.448-1 1-1h1zm2 5.5h2.75c.597 0 1.169-.24 1.591-.66s.659-.99.659-1.59-.237-1.17-.659-1.59a2.26 2.26 0 0 0-1.591-.66H115z" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -1656)"><defs><clipPath id="income-16-clip8_70326_26"><path fill="#fff" d="M56 1656h16v16H56z"/></clipPath></defs><g clipPath="url(#income-16-clip8_70326_26)"><path fill="currentColor" d="M64 1656a8 8 0 0 1 8 8 8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8m0 2c-3.314 0-6 2.69-6 6s2.686 6 6 6 6-2.69 6-6-2.686-6-6-6m.737 1.3a3 3 0 0 1 2.945 3c0 1.36-.901 2.5-2.137 2.87a1 1 0 0 1-.488.13h-1.375v.5h1.375c.552 0 .999.45 1 1 0 .55-.448 1-1 1h-1.375v.5a1.001 1.001 0 0 1-2 0v-.5H61.4c-.552 0-1-.45-1-1 .001-.55.448-1 1-1h.282v-.5H61.4c-.552 0-1-.45-1-1 .001-.55.448-1 1-1h.282v-3c0-.55.447-1 1-1zm-1.055 4h1l.102-.01a.993.993 0 0 0 .898-.99 1.01 1.01 0 0 0-.898-1h-1.102z"/></g></g></svg>
  )
}
