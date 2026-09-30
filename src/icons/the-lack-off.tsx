import type { IconProps } from "./types"

// icon / the lack off — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function TheLackOff({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g fill="currentColor"><path d="M14.157 8h2.448v9.338h-2.448v-3.547h-3.775v3.547H7.934V8h2.448v3.524h3.775z"/><path fillRule="evenodd" d="M5.727 1h12.545c1.444 0 2.625 1.103 2.72 2.503h.002l.006.178v16.635c0 1.424-1.121 2.587-2.542 2.682H5.727c-1.444 0-2.625-1.103-2.72-2.504h-.002L3 20.316V3.681C3 2.258 4.122 1.095 5.54 1zm-.653 2.68-.005.095V20.4c0 .26.314.557.575.593l.093.012h12.535c.273 0 .644-.427.685-.689l.006-.094V3.598c0-.26-.337-.57-.6-.617H5.738c-.273 0-.623.44-.663.7" clipRule="evenodd"/></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11 .998c1.657 0 3 1.341 3 3.002v7.998a3 3 0 0 1-3 3.001H5c-1.657 0-3-1.34-3-3.001V4A3 3 0 0 1 5 .998zM5 3.004c-.553 0-1 .439-1 .996v7.998c0 .557.447.996 1 .996h6c.552 0 1-.439 1-.996V4a.993.993 0 0 0-1-.996zM6.995 7.5h2V4.997h2v7h-2V9.495h-2v2.504h-2v-7h2z"/></svg>
  )
}
