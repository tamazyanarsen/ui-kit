import type { IconProps } from "./types"

// icon / сlosed cards — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ClosedCards({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-105 -1396)"><defs><clipPath id="losed-cards-24-clip6_70326_26"><path fill="#fff" d="M105 1396h24v24h-24z"/></clipPath></defs><g fill="currentColor" clipPath="url(#losed-cards-24-clip6_70326_26)"><path fillRule="evenodd" d="M110.7 1398.4a1.7 1.7 0 0 0-1.7 1.7v3.3h-2.3a1.7 1.7 0 0 0-1.7 1.7v10.8c0 .94.761 1.7 1.7 1.7h12.8c.552 0 1-.45 1-1s-.448-1-1-1H107v-6.13h16.3c.939 0 1.7-.77 1.7-1.7v-2.67a1.7 1.7 0 0 0-1.7-1.7H111v-3h16v8c0 .55.448 1 1 1s1-.45 1-1v-8.3a1.7 1.7 0 0 0-1.7-1.7zm-3.7 9.07v-2.07h16v2.07z" clipRule="evenodd"/><path d="M122.993 1411.59c-.39.39-.39 1.03 0 1.42l1.443 1.44-1.443 1.44c-.39.39-.39 1.03 0 1.42a1 1 0 0 0 1.414 0l1.443-1.45 1.443 1.45a1 1 0 0 0 1.414 0c.391-.39.391-1.03 0-1.42l-1.442-1.44 1.442-1.44c.391-.39.391-1.03 0-1.42a1 1 0 0 0-1.414 0l-1.443 1.45-1.443-1.45a1 1 0 0 0-1.414 0m-4.993.81c-.552 0-1 .45-1 1s.448 1 1 1h1.5c.552 0 1-.45 1-1s-.448-1-1-1z"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -1401.6)"><defs><clipPath id="losed-cards-16-clip7_70326_26"><path fill="#fff" d="M56 1401.6h16v16H56z"/></clipPath></defs><g clipPath="url(#losed-cards-16-clip7_70326_26)"><path fill="currentColor" d="M67 1407c1.105 0 2 .9 2 2v1c0 .55-.448 1-1 1s-1-.45-1-1v-1h-9v6h7c.552 0 1 .45 1 1s-.448 1-1 1h-7c-1.105 0-2-.9-2-2v-6c0-1.1.895-2 2-2h1v-2.4c0-1.1.895-2 2-2h9c1.105 0 2 .9 2 2v5.4c0 .55-.448 1-1 1s-1-.45-1-1v-5.4h-9v2.4zm3.292 5.29a1.003 1.003 0 0 1 1.416 1.42l-.796.79.796.79a1.003 1.003 0 0 1-1.416 1.42l-.796-.8-.788.79c-.391.39-1.025.39-1.416 0a.994.994 0 0 1 0-1.41l.788-.79-.788-.79a.994.994 0 0 1 0-1.41 1.003 1.003 0 0 1 1.416 0l.788.79zM65 1412c.552 0 1 .45 1 1s-.448 1-1 1h-1c-.552 0-1-.45-1-1s.448-1 1-1z"/></g></g></svg>
  )
}
