import type { IconProps } from "./types"

// icon / user — 06. Users, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function User({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12m4.261 12.772a8 8 0 1 0-8.521 0c-.7.262-1.379.589-2.027.978a12.8 12.8 0 0 0-4.587 4.764 1 1 0 0 0 1.748.972 10.8 10.8 0 0 1 3.868-4.021A10.2 10.2 0 0 1 12 17c1.844 0 3.657.504 5.259 1.465a10.8 10.8 0 0 1 3.867 4.021 1 1 0 1 0 1.748-.972 12.8 12.8 0 0 0-4.586-4.764 12.4 12.4 0 0 0-2.027-.978" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -120)"><defs><clipPath id="user-16-clip0_70326_26"><path fill="#fff" d="M56 120h16v16H56z"/></clipPath></defs><g clipPath="url(#user-16-clip0_70326_26)"><path fill="currentColor" d="M67.666 126a3.668 3.668 0 1 0-3.856 3.662l.19.005.188-.005A3.667 3.667 0 0 0 67.666 126m2 0c0 1.799-.839 3.4-2.146 4.438q.433.197.843.443a8.86 8.86 0 0 1 3.177 3.3 1 1 0 0 1-1.748.972 6.85 6.85 0 0 0-2.458-2.557 6.47 6.47 0 0 0-3.334-.929 6.47 6.47 0 0 0-3.335.929 6.85 6.85 0 0 0-2.458 2.557 1 1 0 0 1-1.748-.972 8.86 8.86 0 0 1 3.178-3.3q.41-.245.841-.443A5.667 5.667 0 1 1 69.666 126"/></g></g></svg>
  )
}
