import * as React from "react"

import { cn } from "@/lib/utils"

// Divider — макет поставляет это отдельным именованным версионированным
// компонентом («ELK / divider», v1.0.0): линия 1px, залитая grey-134
// #DEDEDE, которая служит и горизонтальной чертой между строками, и
// вертикальным разделением парных действий в подвале (её инстансы стоят и в
// полосе «Сбросить | Применить» у Calendar, и у Dropdown).
//
// В ките пары ей не было — каждый потребитель выводил ту же линию заново, и
// именно так `SelectSeparator` оказался на общем токене `--border` из shadcn
// (oklch(0.922 0 0) ≈ #E5E5E5) вместо серого ЕЛК. Новые разделители ведите
// через этот компонент, чтобы значение оставалось в одном месте.
interface DividerProps extends React.ComponentProps<"hr"> {
  orientation?: "horizontal" | "vertical"
}

// forwardRef нужен, чтобы примитивы Base UI могли подставить этот
// компонент через свой пропс `render` (так делает SelectSeparator): они
// пробрасывают ref в элемент, который рисуют, а обычный функциональный
// компонент его потерял бы.
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
