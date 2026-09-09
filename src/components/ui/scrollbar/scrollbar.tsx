import * as React from "react"

import { cn } from "@/lib/utils"

// Scrollbar — "Скролл": themed vertical/horizontal scrollbar styling for any
// overflowing container (dropdown lists, tables, modal bodies). Per the
// spec, thickness genuinely differs by axis — 4px vertical, 8px horizontal
// ("Горизонтальный скролл ... имеет большую толщину") — handled by the
// `.themed-scrollbar` CSS class (styles/base.css) via WebKit's `:vertical`/
// `:horizontal` scrollbar pseudo-classes, with `scrollbar-width: thin` as
// Firefox's best-available (axis-uniform) fallback.
//
// Отступ полосы от края поверхности компонент теперь УМЕЕТ САМ (проп
// `inset`). Раньше это считалось задачей вызывающего — «пусть добавит
// padding», — и оказалось, что так его в принципе не решить: нативная
// полоса стоит по краю рамки, а не паддинга (подробности — у правила
// `.themed-scrollbar[data-inset]` в styles/base.css). Дизайн-чек от 07.09,
// замечание 26.
interface ScrollbarProps extends React.ComponentProps<"div"> {
  orientation?: "vertical" | "horizontal"
  /**
   * Отступ полосы от края поверхности.
   *
   *   • `none` — полоса по краю коробки. Годится там, где Scrollbar сам и
   *     есть край: прокручиваемая область страницы, тело таблицы;
   *   • `dropdown` — 8px, норма для выпадающих списков и панелей;
   *   • `rounded` — 16px, для скруглённых поверхностей, где 8 не хватает,
   *     чтобы полоса не наезжала на закругление;
   *   • `panel` — 8px справа и 32px сверху/снизу: панель раскрытого меню
   *     скруглена снизу на 32, и дорожка должна заканчиваться ДО этого
   *     закругления (дизайн-чек от 08.09, замечание 8).
   *
   * ⚠️ Отступ теперь ставится и вдоль оси полосы, а не только поперёк:
   * дорожка тянется во всю высоту окна и упирается в скруглённый угол
   * поверхности, где её и срезает `overflow: hidden` родителя.
   */
  inset?: "none" | "dropdown" | "rounded" | "panel"
}

// forwardRef because consumers need the scrolling node itself, not just its
// styling — ModalBody, for one, reads scrollTop/scrollHeight off it to decide
// which edge divider to show. Under React 18 a plain function component here
// would drop the ref outright (see the same constraint on Button/Dropdown).
const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  function Scrollbar(
    { orientation = "vertical", inset = "none", className, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-slot="scrollbar"
        data-orientation={orientation}
        data-inset={inset === "none" ? undefined : inset}
        // Окно прокрутки фокусируемо БЕЗ `tabindex` — браузер даёт его
        // само, чтобы область можно было листать клавиатурой. Маркер
        // ничего не добавляет в обход табом, он только выдаёт кольцо
        // фокуса кита (см. styles/base.css).
        data-scroll-window=""
        className={cn(
          "themed-scrollbar",
          orientation === "vertical"
            ? "overflow-y-auto overflow-x-hidden"
            : "overflow-x-auto overflow-y-hidden",
          className
        )}
        {...props}
      />
    )
  }
)

export { Scrollbar }
export type { ScrollbarProps }
