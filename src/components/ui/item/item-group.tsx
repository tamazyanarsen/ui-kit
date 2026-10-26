import * as React from "react"

import { cn } from "@/lib/utils"

// ItemGroup — список строк `Item` внутри блока (Правки UI-Kit от 25.10).
//
// Зачем отдельный контейнер. Правила разделителя раньше смотрели на соседей
// строки (`:last-child`, `:only-child`, `:has(+ item)`): если строки обёрнуты
// — например, каждая в свой `div` для анимации появления, — каждая строка
// оказывалась единственной в своей обёртке и теряла разделитель. Строка сама
// не знает, где кончается список, а по разметке это не угадать: одиночная
// строка в обёртке и одиночная строка в карточке выглядят одинаково.
// Границу списка задаёт группа:
//
//   • ряд группы — её прямой ребёнок: сама строка или обёртка с ней;
//   • линии нет только у строки последнего ряда (одиночный ряд с явным
//     `divider` линию сохраняет — как и одиночная строка без группы);
//   • линии, прилегающие к залитой (наведённой или нажатой) строке, гаснут
//     и через обёртки.
// Правила — в styles/component-rules.css. Вне группы действуют прежние
// правила по соседям, так что существующие раскладки не меняются.
//
// `bleed` — правило мобильного каркаса «Списки строк Item в мобильном виде —
// во всю ширину, без внешних полей»: уже 1280 группа выходит на боковые и
// нижнее поля блока (по умолчанию 16 — мобильное поле блока; другое —
// переменными `--item-group-bleed-x` / `--item-group-bleed-bottom`), строки
// идут от края до края блока, отступ содержимого даёт поле самой строки.
// Группа обрезает строки по скруглению блока снизу (`overflow: clip`,
// `--item-group-radius`, по умолчанию 16), чтобы заливка наведения и
// нажатия не выступала квадратными углами. На десктопе группа стоит внутри
// полей блока, как раньше.

interface ItemGroupProps extends React.ComponentProps<"div"> {
  /**
   * В мобильном виде выйти на боковые и нижнее поля блока: строки от края до
   * края, обрезка по скруглению блока. На десктопе ничего не меняет.
   */
  bleed?: boolean
}

const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(function ItemGroup(
  { bleed = false, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="item-group"
      data-bleed={bleed || undefined}
      className={cn(
        "flex flex-col",
        bleed &&
          cn(
            "-mx-[var(--item-group-bleed-x,16px)] -mb-[var(--item-group-bleed-bottom,16px)] overflow-clip rounded-b-[var(--item-group-radius,16px)]",
            "desktop:mx-0 desktop:mb-0 desktop:overflow-visible desktop:rounded-none"
          ),
        className
      )}
      {...props}
    />
  )
})

export { ItemGroup }
export type { ItemGroupProps }
