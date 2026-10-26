import type * as React from "react"

import { cn } from "@/lib/utils"
import { Icon, type IconName } from "@/components/ui/icon"

import { getTagStyle, type TagColor, type TagVariant } from "./variants"

// Tag — «Тег»: маленькая неинтерактивная подпись, которая помечает смену
// статуса (Green, Orange, Red, Blue, Grey) или обычные признаки (Black,
// White, Grey-Info) у объекта. По макету он не нажимается и никогда не
// показывает подсказку по наведению.
//
// Свойства компонент-сета `ELK / tag` — ровно три: Size (Desktop/Mobile),
// Style (13 значений) и Show Icon. Style разложен здесь на пару
// `color` + `variant` (5 статусных цветов × сплошной/контурный + 3
// «признака» = те же 13 сочетаний), Show Icon — это `icon`.
//
// Дизайн-чек №3 №1: «У тега много лишних вариантов и нет разбивки
// desktop/mobile». Проп `size` (l/s) убран: в Figma это не самостоятельное
// свойство, а те же Desktop (22px, P2) и Mobile (18px, P3), поэтому размер
// переключается вариантом `desktop:`, как у остальных компонентов кита.
interface TagProps {
  color?: TagColor
  variant?: TagVariant
  /**
   * Ведущая иконка. Имя из набора кита (`"check"`, `"clock"`, …) либо
   * готовый узел, если нужен глиф не из набора.
   *
   * Раньше здесь стоял булев `showIcon`, который всегда рисовал галочку:
   * тег «В обработке» или «Отклонён» получал ту же `check`, что и
   * «Исполнено». В Figma иконка внутри тега — instance swap, то есть
   * выбирается, а не включается.
   */
  icon?: IconName | React.ReactNode
  className?: string
  children: React.ReactNode
}

function Tag({
  color = "green",
  variant = "main",
  icon,
  className,
  children,
}: TagProps) {
  const style = getTagStyle(color, variant)

  return (
    <span
      data-slot="tag"
      data-color={color}
      data-variant={variant}
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[4px] px-1.5 whitespace-nowrap",
        // Mobile-first, как и везде в ките. Мобильная коробка не центрирует
        // текст, а сдвигает его на 2px вниз (мастер `Size=Mobile`:
        // `pt-[2px]` на 18px при 16px строке) — тот же приём, что у Badge.
        //
        // Десктоп (Правки UI-Kit от 25.10, «Tag — текст выше середины»):
        // строка 20 в коробке 22 раньше центрировалась, но у Object Sans
        // середина заглавных и цифр оказывалась на ~1,6px выше середины тега.
        // Теперь текст на 1px ниже — `pt-[2px]` при той же высоте 22.
        // Значок уже стоял по центру, поэтому возвращается на место
        // `translate: 0 -1px` (отступы 3/3). Сдвиг только десктопный:
        // в мобильной форме значок лежит в той же строке с `pt-[2px]`, что
        // и в мастере, и не уезжает.
        "h-[18px] pt-[2px] text-p2-medium-adaptive desktop:h-[22px]",
        "desktop:[&>:is([data-slot=icon],svg)]:[translate:0_-1px]",
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.fg,
        // Обводка внутренней тенью, а не `border`: в мастере она лежит внутри
        // коробки и на ширину не влияет (Desktop: 104px и у сплошного тега, и
        // у «Text»), а настоящий border раздвигал обводочные теги на 2px.
        boxShadow: style.border ? `inset 0 0 0 1px ${style.border}` : undefined,
      }}
    >
      {typeof icon === "string" ? (
        // // Имя пришло строкой (контрол, данные): типом не проверить, проверит Icon — пусто и предупреждение в разработке.
        <Icon name={icon as IconName} aria-hidden="true" className="size-4 shrink-0" />
      ) : (
        icon
      )}
      {children}
    </span>
  )
}

export { Tag }
export type { TagProps }
