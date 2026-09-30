import type { IconProps } from "./types"

// icon / alcohol — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Alcohol({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7 1.5a1 1 0 0 1 1-1h2.935a1 1 0 0 1 0 2H9v3.384c0 .238-.085.47-.24.65L6.5 9.177v10.322h3.11l-1.085-4.778a1 1 0 0 1 .975-1.22h3V9.116L10.675 6.45a1 1 0 1 1 1.65-1.129l2 2.923a1 1 0 0 1 .175.565V13.5h4a1.002 1.002 0 0 1 .966 1.26l-2.148 7.999a1 1 0 0 1-.965.741h-5.037a1 1 0 0 1-.975-.78l-.28-1.228a1 1 0 0 1-.133.008H5.5a1 1 0 0 1-1-1V8.808c0-.239.085-.47.24-.65L7 5.514zm3.752 14 1.363 6h3.471l1.61-6z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.5 0a1 1 0 1 1 0 2h-1v2c0 .216-.07.427-.2.599L5 6.332V12h1.38l-.36-1.803A1 1 0 0 1 7 9h2V6.332L7.7 4.6a.999.999 0 1 1 1.6-1.198L10.8 5.4a1 1 0 0 1 .2.6v3h1a.998.998 0 0 1 .98 1.196l-1 5A1 1 0 0 1 11 16H8a1 1 0 0 1-.98-.804L6.78 14H4a1 1 0 0 1-1-1V6a1 1 0 0 1 .2-.6l1.3-1.734V1a1 1 0 0 1 1-1zm1.32 14h1.36l.6-3H8.22z"/></svg>
  )
}
