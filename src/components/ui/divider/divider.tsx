import * as React from "react"

import { cn } from "@/lib/utils"

// Divider — Figma ships this as its own named, versioned component
// ("ELK / divider", node 58890:9260, v1.0.0): a 1px line filled with
// grey-134 #DEDEDE, used both as a horizontal rule between rows and as the
// vertical split between paired footer actions (Calendar's and the
// Dropdown's "Сбросить | Применить" bars both instantiate it).
//
// The kit had no counterpart — every consumer re-derived the same line,
// which is how `SelectSeparator` ended up on the generic shadcn `--border`
// (oklch(0.922 0 0) ≈ #E5E5E5) instead of the ELK grey. Route new dividers
// through this component so the value stays in one place.
//
// Правило, ради которого компонент вообще заводится: **везде, где в макете
// виден серый разделитель — это он.** Не локальная линия и не `border` по
// месту.
//
// Главная ценность при этом не в компоненте, а в ЦЕНТРАЛИЗАЦИИ ЦВЕТА: до
// него шестнадцать компонентных токенов брали серый каждый сам по себе, и
// цвет линии всего кита нельзя было поменять одной правкой. Теперь все они
// ссылаются на `--divider` (styles/tokens-forms.css).
//
// Не переведены и не должны быть: обводки фигур (белый тег, карточка тоста)
// и кромка боковой панели — это края, а не разделители.
//
// Отступов у компонента нет вовсе — их держит вызывающий. Норма для стопки
// информационных полей: от содержимого поля до линии 16, от линии до
// следующего поля 16, зазор между самими полями 0.
//
// ⚠️ Грабля: `InformationField` рисует СОБСТВЕННУЮ линию только при типе
// `Label Left`. Внешний `Divider` законен у типа `Line` и даёт двойную
// линию у `Label Left`.
//
// Note: a divider drawn as a *border* on a neighbouring element (Modal's
// scroll-edge rules, Notification's `divide-y`) legitimately stays a border
// — this component is for the standalone 1px element Figma draws as its own
// "Devider" node.
interface DividerProps extends React.ComponentProps<"hr"> {
  orientation?: "horizontal" | "vertical"
}

// forwardRef so Base UI primitives can swap this in via their `render` prop
// (SelectSeparator does) — they forward a ref to the element they render,
// and a plain function component would drop it.
const Divider = React.forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { orientation = "horizontal", className, ...props },
  ref
) {
  return (
    // Разметка — семантический разделитель (`<hr>`), а не пустой блок: у него
    // роль `separator` встроенная, и без разметки-обманки её читает любая
    // вспомогательная технология. `aria-orientation` при этом обязателен для
    // вертикального: роль `separator` по умолчанию читается как
    // горизонтальная.
    //
    // `border-0` — сброс собственной рамки `<hr>`: линию рисует заливка, а
    // не рамка, иначе вертикальный вариант остался бы без линии вовсе.
    <hr
      ref={ref}
      data-slot="divider"
      data-orientation={orientation}
      aria-orientation={orientation}
      className={cn(
        // `shrink-0` — линия НЕ сжимается в тесной колонке: без него она
        // схлопывалась в ноль ровно там, где разделяет что-то узкое.
        "m-0 shrink-0 border-0 bg-[var(--divider)]",
        // ⚠️ `h-auto` у вертикального обязателен: сброс задаёт `<hr>`
        // высоту 0, и одного `self-stretch` мало — явная высота сильнее
        // выравнивания, линия выходила нулевой.
        orientation === "horizontal"
          ? "h-px w-full"
          : "h-auto w-px self-stretch",
        className
      )}
      {...props}
    />
  )
})

export { Divider }
export type { DividerProps }
