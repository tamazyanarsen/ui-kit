import type { IconProps } from "./types"

// icon / share — 03. Copy Link Share Download Upload, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Share({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.298 2.693a1 1 0 0 1 1.414 0l4.535 4.53a1 1 0 1 1-1.414 1.415L13 5.807V15.5a1 1 0 0 1-2 0V5.818l-2.823 2.82a1 1 0 0 1-1.414-1.415zM3 15a1 1 0 0 1 1 1v5h16v-5a1 1 0 0 1 2 0v5.25c0 .529-.254.99-.623 1.299A2 2 0 0 1 20.1 23H3.9c-.451 0-.912-.148-1.277-.451A1.7 1.7 0 0 1 2 21.25V16a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-112 -312)"><defs><clipPath id="share-16-clip0_70326_26"><path fill="#fff" d="M112 312h16v16h-16z"/></clipPath></defs><g clipPath="url(#share-16-clip0_70326_26)"><path fill="currentColor" d="M127 320.909a1 1 0 0 1 1 1v4.454c0 .434-.173.851-.479 1.158a1.64 1.64 0 0 1-1.158.479h-12.726c-.434 0-.851-.173-1.158-.479a1.64 1.64 0 0 1-.479-1.158v-4.454a1 1 0 0 1 2 0V326h12v-4.091a1 1 0 0 1 1-1M120 312a1 1 0 0 1 1 1v6.495l1.634-1.633a1 1 0 0 1 1.414 1.414l-3.341 3.34a1 1 0 0 1-1.414 0l-3.341-3.34a1 1 0 0 1 1.414-1.414l1.634 1.633V313a1 1 0 0 1 1-1"/></g></g></svg>
  )
}
