import * as React from "react"

import { cn } from "@/lib/utils"

// Scrollbar — «Скролл»: оформление вертикальной и горизонтальной полосы
// прокрутки в стиле кита для любого контейнера с переполнением (списки
// выпадающих меню, таблицы, тела модальных окон). По макету толщина
// действительно зависит от оси — 4px по вертикали и 8px по горизонтали
// («Горизонтальный скролл ... имеет большую толщину»), — и это делает
// CSS-класс `.themed-scrollbar` (styles/base.css) через псевдоклассы
// `:vertical` и `:horizontal` у полосы в WebKit, а для Firefox запасным
// вариантом идёт `scrollbar-width: thin` (одинаковый для обеих осей —
// лучшее, что там есть).
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
   *   • `panel` — 8px справа, 8px сверху и 48px снизу: панель раскрытого
   *     меню упирается верхом в шапку, а низ у неё скруглён на 32, и дорожка
   *     обязана заканчиваться ДО закругления. Числа сняты с кадров адаптации
   *     (раздел «Адаптация»), а не подобраны (дизайн-чек от 08.09,
   *     замечание 8).
   *
   * ⚠️ Отступ теперь ставится и вдоль оси полосы, а не только поперёк:
   * дорожка тянется во всю высоту окна и упирается в скруглённый угол
   * поверхности, где её и срезает `overflow: hidden` родителя.
   */
  inset?: "none" | "dropdown" | "rounded" | "panel"
}

// forwardRef нужен потому, что потребителям требуется сам прокручиваемый
// узел, а не только его оформление: ModalBody, например, читает с него
// scrollTop и scrollHeight, чтобы решить, какой краевой разделитель
// показать. На React 18 обычный функциональный компонент здесь потерял бы
// ref совсем (то же ограничение см. у Button и Dropdown).
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
