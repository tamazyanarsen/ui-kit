import * as React from "react"

import { cn } from "@/lib/utils"

// Shimmer — «Скелетная загрузка»: заглушка на время загрузки, которая
// ставится везде, где настоящий компонент читает из базы (таблицы,
// превью карточек, сами карточки), пока данные ещё не пришли. По макету
// каждый настоящий текстовый или графический элемент заменяется ровно
// одним блоком скелетона подходящего размера: многострочный текстовый блок
// всё равно схлопывается в одну скелетную строку, а блок под графику обязан
// в точности повторять её настоящий размер. Отдельного компонента или
// пропса под «строку текста», «аватар» или «заглушку кнопки» нет
// (собственное разделение макета на «Текст» и «Фигуру» — это лишь указание,
// какой `shape` и какие размеры в className выбирать), а ширина и высота
// целиком задаются потребителем через className, так же как и у настоящего
// содержимого, которое маскируется.
//
// Движение — это обычная пульсация прозрачности (`animate-pulse`), а не
// бегущий блик: сам блик запечён в статичный фоновый градиент (см.
// комментарий к токенам --shimmer-* в styles/tokens-table.css). Цикл — 1.8 с
// из макета, а не 2 с по умолчанию в Tailwind.
interface ShimmerProps extends React.ComponentProps<"div"> {
  shape?: "square" | "circle"
}

function Shimmer({ shape = "square", className, ...props }: ShimmerProps) {
  return (
    <div
      data-slot="shimmer"
      data-shape={shape}
      aria-hidden="true"
      className={cn(
        "h-4 w-full shrink-0 animate-pulse bg-[linear-gradient(90deg,var(--shimmer-from)_0%,var(--shimmer-via)_50%)] [animation-duration:1.8s]",
        shape === "circle" ? "rounded-full" : "rounded-[8px]",
        className
      )}
      {...props}
    />
  )
}

export { Shimmer }
export type { ShimmerProps }
