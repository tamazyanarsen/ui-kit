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
// Движение — бегущий блик (`shimmer-sweep`, styles/motion.css): светлый
// гребень едет слева направо, уходит за край и снова появляется слева.
// Дизайн-чек 08.10, замечание 18: прежняя пульсация прозрачности
// (`animate-pulse` по статичному градиенту) заменена «переливом градиента».
// Цикл — те же 1.8 с из макета. При `prefers-reduced-motion` блик стоит, а
// блок залит ровным светлым серым.
interface ShimmerProps extends React.ComponentProps<"div"> {
  shape?: "square" | "circle"
}

const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(function Shimmer({ shape = "square", className, ...props }, ref) {
  return (
    <div
      data-slot="shimmer"
      data-shape={shape}
      aria-hidden="true"
      className={cn(
        "h-4 w-full shrink-0 shimmer-sweep",
        shape === "circle" ? "rounded-full" : "rounded-[8px]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

export { Shimmer }
export type { ShimmerProps }
