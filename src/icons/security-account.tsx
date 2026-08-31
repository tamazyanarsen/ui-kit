import type { IconProps } from "./types"

// icon / security account — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SecurityAccount({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M13.106 16.23v.92h-1.667v.96h-1.287v-.96H9.38v-.92h.772v-.73H9.38v-1.1h.772v-3.45h2.421c1.232 0 2.046.96 2.046 2.3 0 1.32-.857 2.27-2.114 2.27h-1.066v.71zm-.917-4.09h-.75v2.24h.742c.746 0 1.134-.42 1.134-1.12 0-.69-.388-1.12-1.126-1.12" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M17.388 3.79v1.8h2.218c1.657 0 3 1.34 3 3v11.62c0 1.66-1.343 3-3 3H4.394c-1.657 0-3-1.34-3-3V8.59c0-1.66 1.343-3 3-3h2.198v-1.8c0-1.66 1.343-3 3-3h4.796c1.657 0 3 1.34 3 3m-8.796 0c0-.55.447-1 1-1h4.796c.553 0 1 .45 1 1v1.8H8.592zm-5.198 4.8c0-.55.447-1 1-1h15.212c.552 0 1 .45 1 1v11.62c0 .55-.448 1-1 1H4.394c-.553 0-1-.45-1-1z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13.409 6.39c0-.55-.448-1-1-1H3.612c-.552 0-1 .45-1 1v6.42c0 .55.448 1 1 1h8.797c.552 0 1-.45 1-1zm2 6.42c0 1.66-1.343 3-3 3H3.612c-1.657 0-3-1.34-3-3V6.39c0-1.65 1.343-3 3-3h8.797c1.657 0 3 1.35 3 3z"/><path fill="currentColor" d="M7.626 8.09h.501c.492 0 .751.29.751.75s-.259.74-.757.74h-.495zm1.113 3.34v-.61H7.626v-.48h.711c.84 0 1.412-.63 1.412-1.51 0-.9-.543-1.53-1.366-1.53H6.766v2.3h-.515v.73h.515v.49h-.515v.61h.515v.64h.86v-.64zm1.192-9.24H6.048v2.7h-2v-2.7c0-1.1.895-2 2-2h3.883c1.105 0 2 .9 2 2v2.7h-2z"/></svg>
  )
}
