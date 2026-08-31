import type { IconProps } from "./types"

// icon / question — 04. Errors Allert Info, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Question({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-156 -180)"><defs><clipPath id="question-24-clip2_70326_26"><path fill="#fff" d="M156 180h24v24h-24z"/></clipPath></defs><g fill="currentColor" clipPath="url(#question-24-clip2_70326_26)"><path fillRule="evenodd" d="M168 182c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m-12 10c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12" clipRule="evenodd"/><path fillRule="evenodd" d="M168 187c-1.467 0-2.5 1.067-2.5 2.2a1 1 0 0 1-2 0c0-2.402 2.101-4.2 4.5-4.2s4.5 1.798 4.5 4.2c0 2.061-1.546 3.677-3.5 4.094V194a1 1 0 0 1-2 0v-1.6a1 1 0 0 1 1-1c1.467 0 2.5-1.067 2.5-2.2s-1.033-2.2-2.5-2.2" clipRule="evenodd"/><path d="M169 198a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-60 -184)"><defs><clipPath id="question-16-clip3_70326_26"><path fill="#fff" d="M60 184h16v16H60z"/></clipPath></defs><g fill="currentColor" clipPath="url(#question-16-clip3_70326_26)"><path d="M74 192a6 6 0 1 0-12 0 6 6 0 0 0 12 0m-7 1.8v-1.2a1 1 0 0 1 1-1c.867 0 1.5-.665 1.5-1.4s-.633-1.4-1.5-1.4-1.5.665-1.5 1.4a1 1 0 0 1-2 0c0-1.916 1.606-3.4 3.5-3.4s3.5 1.484 3.5 3.4c0 1.566-1.074 2.843-2.5 3.257v.343a1 1 0 0 1-2 0m9-1.8a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/><path d="M69 196.2a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></g></g></svg>
  )
}
