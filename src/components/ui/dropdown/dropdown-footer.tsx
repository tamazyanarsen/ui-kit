import * as React from "react"

import { cn } from "@/lib/utils"
import { usePressTracking } from "@/lib/use-press-tracking"

/**
 * Нижняя панель кнопок выпадающего списка — свойство `Add` компонент-сета
 * `ELK / dropdown` (Two Buttons / One Button / None).
 *
 * Дизайн-чек «Storybook 3», замечание 7: «в компонент dropdown добавить
 * строку с поиском и с кнопками».
 *
 * ⚠️ Кнопки здесь ПЛОСКИЕ и во всю ширину, а не пилюли `Button`. Замер
 * варианта Desktop (узел `Buttons`): панель прижата к низу списка, сверху
 * линия Grey 134, каждая кнопка `flex: 1`, рост ровно 56,
 * поля 32/16, подпись P1 Medium 16/24, между кнопками вертикальная линия
 * Grey 134 шириной 1. Радиуса у них нет — углы даёт сам список своим
 * `overflow-hidden`.
 *
 * Отсюда же `pb-14` у списка строк: панель лежит абсолютом поверх, и без
 * места под неё последняя строка уезжала бы под кнопки (в макете это
 * `padding-bottom: 56` у узла `Lines (ELK)`).
 */
interface DropdownFooterProps extends React.ComponentProps<"div"> {}

// forwardRef: тип пропсов обещает `ref`, а на React 18 обычная функция его
// молча теряет.
const DropdownFooter = React.forwardRef<HTMLDivElement, DropdownFooterProps>(
  function DropdownFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="dropdown-footer"
      className={cn(
        "sticky bottom-0 z-10 flex w-full shrink-0 items-stretch border-t border-[var(--menu-item-divider)] bg-popover",
        // Разделитель между кнопками — не `gap`, а рамка у второй и далее:
        // так линия остаётся ровно 1px и не зависит от того, сколько кнопок
        // в панели.
        "[&>*+*]:border-l [&>*+*]:border-[var(--menu-item-divider)]",
        className
      )}
      {...props}
    />
  )
})

/**
 * Кнопка подвала выпадающего списка — ОДНА на весь кит: её рисуют и
 * `DropdownFooter`, и `ComboboxFooter` («Сбросить / Применить» у фильтров).
 *
 * Своя, а не `Button`: у той пилюля с радиусом и собственными полями, а
 * здесь плоская ячейка панели (см. выше).
 *
 * Правки UI-Kit от 25.10 («Button внутри выпадающих списков — своё
 * поведение»): кнопки подвала ведут себя как строки списка, а не как
 * отдельные кнопки. Заливка наведения и нажатия — на всю ячейку и без
 * скругления (углы закругляет сам список), цвета — как у строк (`menu-row`:
 * наведение Grey 114 только мышью, нажатие Grey 124, смена 200 мс `ease`).
 * Ячейка при нажатии НЕ ужимается (ни `scale`, ни `clip-path`): прижатая к
 * краям списка и к соседней кнопке, она обнажила бы полосы вдоль границ
 * панели. Сжимается только содержимое — одна обёртка — до 0.97 к центру
 * (`press-scale-content`). Прежде `ComboboxFooter` рисовал здесь `Button`
 * secondary-white: заливка со скруглением 16 ужималась при нажатии, и кнопка
 * выглядела запертой в маленьком белом контейнере.
 *
 * Размер по умолчанию — десктопный (ячейка 56, поля 32/16, P1 Medium); в
 * мобильном `Dropdown` (`size="mobile…"`) — 48, поля 24/14, P1 Medium Mobile
 * 14/20. Место применения с другой схемой форм (`ComboboxFooter` —
 * вариантом `desktop:`) переопределяет размер классами.
 */
interface DropdownFooterButtonProps
  extends React.ComponentProps<"button"> {}

const DropdownFooterButton = React.forwardRef<
  HTMLButtonElement,
  DropdownFooterButtonProps
>(function DropdownFooterButton(
  { className, type = "button", children, ...props },
  ref
) {
  usePressTracking()
  return (
    <button
      ref={ref}
      type={type}
      data-slot="dropdown-footer-button"
      className={cn(
        "menu-row press-scale-content rounded-none",
        "flex min-h-14 min-w-0 flex-1 cursor-pointer items-center justify-center px-8 py-4 text-p1-medium group-data-[size^=mobile]/dropdown:min-h-12 group-data-[size^=mobile]/dropdown:px-6 group-data-[size^=mobile]/dropdown:py-[14px] group-data-[size^=mobile]/dropdown:text-p2-medium text-[var(--menu-item-fg)] outline-none",
        "focus-visible:focus-ring",
        // Выключенная кнопка — Grey 114 / Grey 166 из сета, теми же токенами,
        // что и у обычной кнопки кита.
        "disabled:cursor-not-allowed disabled:bg-[var(--btn-muted-bg)] disabled:text-[var(--btn-muted-fg)]",
        className
      )}
      {...props}
    >
      {/* Единственная обёртка содержимого — её и сжимает
          `press-scale-content`. Флекс, чтобы подпись-узел внутри
          (`ComboboxFooter`) была блоком и получала многоточие. */}
      <span
        data-slot="dropdown-footer-button-content"
        className="flex max-w-full min-w-0 items-center justify-center"
      >
        {children}
      </span>
    </button>
  )
})

export { DropdownFooter, DropdownFooterButton }
export type { DropdownFooterProps, DropdownFooterButtonProps }
