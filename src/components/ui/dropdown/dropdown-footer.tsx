import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Нижняя панель кнопок выпадающего списка — свойство `Add` компонент-сета
 * `ELK / dropdown` (Two Buttons / One Button / None).
 *
 * Дизайн-чек «Storybook 3», замечание 7: «в компонент dropdown добавить
 * строку с поиском и с кнопками».
 *
 * ⚠️ Кнопки здесь ПЛОСКИЕ и во всю ширину, а не пилюли `Button`. Замер
 * варианта Desktop (5691:38719, узел `Buttons` 5865:70386): панель прижата к
 * низу списка, сверху линия Grey 134, каждая кнопка `flex: 1`, рост ровно 56,
 * поля 32/16, подпись P1 Medium 16/24, между кнопками вертикальная линия
 * Grey 134 шириной 1. Радиуса у них нет — углы даёт сам список своим
 * `overflow-hidden`.
 *
 * Отсюда же `pb-14` у списка строк: панель лежит абсолютом поверх, и без
 * места под неё последняя строка уезжала бы под кнопки (в макете это
 * `padding-bottom: 56` у узла `Lines (ELK)`).
 */
interface DropdownFooterProps extends React.ComponentProps<"div"> {}

function DropdownFooter({ className, ...props }: DropdownFooterProps) {
  return (
    <div
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
}

/**
 * Кнопка нижней панели. Своя, а не `Button`: у той пилюля с радиусом 16 и
 * собственными полями, а здесь плоская ячейка панели (см. выше).
 */
interface DropdownFooterButtonProps
  extends React.ComponentProps<"button"> {}

function DropdownFooterButton({
  className,
  type = "button",
  ...props
}: DropdownFooterButtonProps) {
  return (
    <button
      type={type}
      data-slot="dropdown-footer-button"
      className={cn(
        "flex min-h-14 flex-1 cursor-pointer items-center justify-center px-8 py-4 text-p1-medium text-[var(--menu-item-fg)] outline-none transition-colors",
        "hover:bg-[var(--menu-item-bg-highlighted)] focus-visible:focus-ring",
        // Выключенная кнопка — Grey 114 / Grey 166 из сета, теми же токенами,
        // что и у обычной кнопки кита.
        "disabled:cursor-not-allowed disabled:bg-[var(--btn-muted-bg)] disabled:text-[var(--btn-muted-fg)]",
        className
      )}
      {...props}
    />
  )
}

export { DropdownFooter, DropdownFooterButton }
export type { DropdownFooterProps, DropdownFooterButtonProps }
