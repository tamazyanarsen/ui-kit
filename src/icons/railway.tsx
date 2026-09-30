import type { IconProps } from "./types"

// icon / railway — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Railway({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M9.965 1.263a1 1 0 1 0-1.93-.526L7.418 3H7a1 1 0 0 0-.125 1.992L6.055 8H5a1 1 0 1 0 0 2h.509l-.818 3H3a1 1 0 1 0 0 2h1.145l-.818 3H1a1 1 0 1 0 0 2h1.782l-.747 2.737a1 1 0 0 0 1.93.526L4.855 20h14.29l.89 3.263a1 1 0 0 0 1.93-.526L21.218 20H23a1 1 0 1 0 0-2h-2.327l-.818-3H21.5a1 1 0 1 0 0-2h-2.19l-.819-3H19a1 1 0 1 0 0-2h-1.054l-.82-3.008A1 1 0 0 0 17 3h-.418L15.965.737a1 1 0 0 0-1.93.526L14.51 3H9.49zM18.6 18l-.818-3H6.218L5.4 18zm-1.364-5H6.764l.818-3h8.836zm-1.363-5-.819-3H8.946l-.819 3z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g fill="currentColor"><path d="M5.038.726a1 1 0 0 1 1.924.548l-4 14a1 1 0 0 1-1.924-.548z"/><path fillRule="evenodd" d="M9.038 1.275a1 1 0 1 1 1.923-.55L11.612 3H12a1 1 0 0 1 .178 1.984L12.754 7H14a1 1 0 1 1 0 2h-.674l.571 2H15a1 1 0 1 1 0 2h-.531l.492 1.725a1 1 0 1 1-1.922.55L12.389 13H1a1 1 0 1 1 0-2h10.817l-.571-2H2a1 1 0 1 1 0-2h8.674l-.571-2H4a1 1 0 0 1 0-2h5.531z" clipRule="evenodd"/></g></svg>
  )
}
