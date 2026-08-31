import type { IconProps } from "./types"

// icon / ahead — 10. Fav Like, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Ahead({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -124)"><defs><clipPath id="ahead-24-clip0_70326_26"><path fill="#fff" d="M160 124h24v24h-24z"/></clipPath></defs><g clipPath="url(#ahead-24-clip0_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M175.662 124.113a1 1 0 0 1 .518 1.087l-1.429 7.015 5.595 2.061a1 1 0 0 1 .379 1.627l-11.2 11.786a1 1 0 0 1-1.705-.889l1.429-7.015-5.595-2.061a1 1 0 0 1-.379-1.627l11.2-11.786a1 1 0 0 1 1.187-.198m-9.89 12.26 4.974 1.832a1 1 0 0 1 .634 1.137l-.905 4.444 7.753-8.159-4.974-1.831a1 1 0 0 1-.634-1.138l.905-4.444z" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8.406.506a.999.999 0 0 1 1.763.647v4.226l3.222.952a1 1 0 0 1 .461 1.627L7.07 15.516a1 1 0 0 1-1.733-.812l.641-4.445-3.306-.741a1 1 0 0 1-.543-1.624zM4.723 7.928l2.597.582a1 1 0 0 1 .771 1.119l-.303 2.092L11.305 7.8l-2.42-.714a1 1 0 0 1-.716-.959V3.874z"/></svg>
  )
}
