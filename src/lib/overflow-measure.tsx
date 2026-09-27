import * as React from "react"

import { cn } from "@/lib/utils"

// Закадровый слой для замера ряда — вторая половина механизма `useOverflowCount`
// (первая — в `use-overflow-count.ts`).
//
// Зачем он нужен вообще: `itemRefs` обязан висеть на ВСЕГДА отрисованной копии
// каждого элемента. Элемент, спрятанный за триггером «Ещё», в видимом ряду
// сообщил бы ширину 0 при следующем пересчёте, и счёт больше никогда не вырос
// бы обратно.
//
// ⚠️ Внешняя обёртка `inset-0 overflow-hidden` обязательна, а не для красоты.
// Мерная копия шире ряда по определению (в ней ВСЕ элементы, в том числе не
// поместившиеся), и хотя она абсолютная, то есть вне потока, в ОБЛАСТЬ
// ПРОКРУТКИ документа она входит: на 1100px шапка раздвигала страницу на лишние
// 23px, и продукт ехал вбок даже там, где всё помещалось. Обёртка нулевой ширины
// с обрезкой снимает вклад в scrollWidth, а замер не трогает —
// `getBoundingClientRect` у обрезанного элемента всё тот же.
//
// Раскладку внутреннего ряда (зазор, направление) задаёт вызывающий код через
// `className`: у панели кнопок, навигации шапки и меню сотрудника зазоры разные.
function OverflowMeasureLayer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none invisible absolute inset-0 overflow-hidden"
    >
      <div className={cn("absolute top-0 left-0 flex", className)} {...props}>
        {children}
      </div>
    </div>
  )
}

export { OverflowMeasureLayer }
