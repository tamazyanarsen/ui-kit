import type { IconProps } from "./types"

// Figma's `icon / plus` (нода 1168:11537) — 14×14 глиф, вписанный в 16-й
// бокс с инсетом 6.25% со всех сторон, то есть со сдвигом на 1px. Именно он
// стоит в кнопке «Создать» в `Menu Header (ELK)`; CirclePlus, который
// использовался там раньше, — другая иконка (дизайн-чек №30: «используется
// некорректная иконка кнопки»).
export function Plus({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 13V8H1C0.447715 8 0 7.55228 0 7C0 6.44772 0.447715 6 1 6H6V1C6 0.447715 6.44772 0 7 0C7.55228 0 8 0.447715 8 1V6H13C13.5523 6 14 6.44772 14 7C14 7.55228 13.5523 8 13 8H8V13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13Z"
        transform="translate(1 1)"
        fill="currentColor"
      />
    </svg>
  )
}
