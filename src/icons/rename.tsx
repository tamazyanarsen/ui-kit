import type { IconProps } from "./types"

// icon / rename — 01. Text Editing, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Rename({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M16.168 3.047 14.04 5.175l4.785 4.785 2.128-2.128zm3.371 9.027 2.909-2.909a1.89 1.89 0 0 0 0-2.666l-4.947-4.947a1.886 1.886 0 0 0-2.666 0L1.552 14.835a1.9 1.9 0 0 0-.408.612l-.02.049-.007.02a1.9 1.9 0 0 0-.117.652v4.946A1.89 1.89 0 0 0 2.886 23h4.946a1.88 1.88 0 0 0 1.333-.552l10.36-10.36.007-.007zm-2.128-.7-4.785-4.785-9.212 9.212 4.785 4.785zM5.784 21H3v-2.784z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -312)"><defs><clipPath id="rename-16-clip0_70326_26"><path fill="#fff" d="M56 312h16v16H56z"/></clipPath></defs><g clipPath="url(#rename-16-clip0_70326_26)"><path fill="currentColor" d="M58 323.075V326h2.925l6.438-6.438-2.924-2.925zm7.853-7.852 2.924 2.924 1.066-1.065-2.925-2.925zM72 317.082c0 .43-.171.842-.475 1.146l-9.298 9.297a1.63 1.63 0 0 1-1.145.475H57.62a1.62 1.62 0 0 1-1.62-1.62v-3.462c0-.213.042-.424.123-.62l.068-.144a1.6 1.6 0 0 1 .284-.382l9.297-9.297.12-.108c.288-.236.65-.367 1.026-.367l.16.008c.318.031.619.157.866.359l.12.108 3.461 3.462c.304.303.475.716.475 1.145"/></g></g></svg>
  )
}
