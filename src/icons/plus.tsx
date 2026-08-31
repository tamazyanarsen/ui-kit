import type { IconProps } from "./types"

// Figma's `icon / plus` (нода 1168:11537) — 14×14 глиф, вписанный в 16-й
// бокс с инсетом 6.25% со всех сторон, то есть со сдвигом на 1px. Именно он
// стоит в кнопке «Создать» в `Menu Header (ELK)`; CirclePlus, который
// использовался там раньше, — другая иконка (дизайн-чек №30: «используется
// некорректная иконка кнопки»).
export function Plus({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7 14V9H2a1 1 0 0 1 0-2h5V2a1 1 0 0 1 2 0v5h5a1 1 0 1 1 0 2H9v5a1 1 0 1 1-2 0"/></svg>
  )
}
