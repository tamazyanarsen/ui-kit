import type { IconProps } from "./types"

// «icon / arrow back small» и «icon / arrow right small» — компактная пара
// шевронов, которую макет кладёт внутрь бегунка Range Input. Это
// действительно другой глиф, а не уменьшенный обычный chevron-left/right:
// малая стрелка — 5,5 × 9 в коробке 16px (пропорция 0,61), тогда как
// обычный шеврон — 7,07 × 12,73 (пропорция 0,56). Контур взят из выгрузки
// дословно и сдвинут в центр коробки 16 × 16, чтобы иконка вставала в
// обычный для кита размер `size-4`.
const SMALL_ARROW_PATH =
  "M0.199121 0.184239C0.464616 -0.0614131 0.895067 -0.0614131 1.16056 0.184239L5.27025 3.98678C5.57659 4.27022 5.57658 4.72978 5.27025 5.01322L1.16056 8.81576C0.895067 9.06141 0.464616 9.06141 0.199121 8.81576C-0.0663736 8.57011 -0.0663736 8.17183 0.199121 7.92617L3.90204 4.5L0.199121 1.07383C-0.0663736 0.828173 -0.0663736 0.429892 0.199121 0.184239Z"

export function ArrowRightSmall({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d={SMALL_ARROW_PATH}
        transform="translate(5.25 3.5)"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function ArrowLeftSmall({ size: _size, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Figma draws the back arrow as this same asset rotated 180°
          (the export wraps it in a `rotate-180` container). */}
      <path
        d={SMALL_ARROW_PATH}
        transform="translate(10.75 12.5) rotate(180)"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}
