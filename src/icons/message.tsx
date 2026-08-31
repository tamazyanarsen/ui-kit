import type { IconProps } from "./types"

// icon / message — 11. Call Message, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Message({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4 4v15.661l2.573-2.376a1.7 1.7 0 0 1 1.161-.459H20V4zM2.48 2.568C2.8 2.217 3.254 2 3.75 2h16.5c.496 0 .95.217 1.27.568.316.348.48.801.48 1.256v13.179c0 .455-.164.908-.48 1.255-.32.351-.774.568-1.27.568H7.852l-2.941 2.716c-.251.232-.569.39-.919.44a1.7 1.7 0 0 1-1.014-.169 1.77 1.77 0 0 1-.725-.692A1.9 1.9 0 0 1 2 20.176V3.824c0-.455.164-.908.48-1.256" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M13 1a2 2 0 0 1 2 2v8.263a2 2 0 0 1-2 2H5.089l-.656.674C3.18 15.222 1 14.335 1 12.541V3a2 2 0 0 1 2-2zM3 12.541l.656-.674a2 2 0 0 1 1.433-.604H13V3H3z"/></svg>
  )
}
