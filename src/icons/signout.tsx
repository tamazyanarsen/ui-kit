import type { IconProps } from "./types"

// icon / signout — 06. Users, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Signout({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h6a1 1 0 0 1 0 2H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h6a1 1 0 0 1 0 2m4.132 3.132a1 1 0 0 1 1.414 0l4.161 4.161a.997.997 0 0 1 0 1.414l-4.161 4.161a.999.999 0 1 1-1.414-1.414L18.586 13H9a1 1 0 0 1 0-2h9.586l-2.454-2.454a1 1 0 0 1 0-1.414" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6.425 0a1 1 0 0 1-.001 2H2.333v12h4.091a1 1 0 0 1 0 2H1.97c-.434 0-.851-.173-1.158-.479a1.64 1.64 0 0 1-.479-1.158V1.637c0-.434.173-.851.479-1.158A1.64 1.64 0 0 1 1.971 0zm4.862 3.951a1 1 0 0 1 1.414.001l3.34 3.341a1 1 0 0 1 0 1.414l-3.34 3.341a1 1 0 0 1-1.414-1.414L12.92 9H6.425a1 1 0 0 1 0-2h6.495l-1.633-1.634a1 1 0 0 1 0-1.415"/></svg>
  )
}
