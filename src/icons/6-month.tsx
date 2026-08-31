import type { IconProps } from "./types"

// icon / 6 month — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Icon6Month({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7 .5a1 1 0 0 1 1 1v1h8v-1a1 1 0 0 1 2 0v1h3.091C22.096 2.5 23 3.287 23 4.364v17.272c0 1.077-.904 1.864-1.909 1.864H2.909C1.904 23.5 1 22.713 1 21.636V4.364C1 3.287 1.904 2.5 2.909 2.5H6v-1a1 1 0 0 1 1-1m-1 4H3v3h18v-3h-3v1a1 1 0 0 1-2 0v-1H8v1a1 1 0 0 1-2 0zm15 5H3v12h18zm-9 3.05c-.601 0-1 .451-1 .901v1.038a3 3 0 1 1-2 2.83v-3.868c0-1.649 1.391-2.901 3-2.901 1.402 0 2.626.942 2.93 2.276a1 1 0 1 1-1.95.443c-.086-.378-.465-.719-.98-.719m-1 4.769a1 1 0 1 0 2 0 1 1 0 0 0-2 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -248)"><defs><clipPath id="6-month-16-clip2_70326_26"><path fill="#fff" d="M56 248h16v16H56z"/></clipPath></defs><g clipPath="url(#6-month-16-clip2_70326_26)"><path fill="currentColor" d="M67 248a1 1 0 0 1 1 1v.5h2a2 2 0 0 1 2 2V262l-.011.204A2 2 0 0 1 70 264H58a2 2 0 0 1-2-2v-10.5a2 2 0 0 1 2-2h2v-.5a1 1 0 0 1 2 0v.5h4v-.5a1 1 0 0 1 1-1m-9 14h12v-10.5h-2v.5a1 1 0 0 1-2 0v-.5h-4v.5a1 1 0 0 1-2 0v-.5h-2zm6-8.5c1.005 0 1.882.675 2.1 1.631a.717.717 0 0 1-1.352.455l-.079-.237a.72.72 0 0 0-.669-.415c-.43 0-.717.322-.717.645v.744a2.15 2.15 0 1 1-1.432 2.028v-2.772c0-1.182.996-2.079 2.149-2.079m0 4.134a.717.717 0 1 0 0 1.434.717.717 0 0 0 0-1.434"/></g></g></svg>
  )
}
