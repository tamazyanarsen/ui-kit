import * as React from "react"

import { Divider } from "@/components/ui/divider"
import { cn } from "@/lib/utils"

// List of Errors — список проблем (`Errors List (ELK)`): разделитель во всю
// ширину + зазор 23 + коробка строк с зазором 8 между ними. Высоты сета
// сходятся один в один: 48 / 80 / 112 при одной, двух и трёх строках.
//
// Дизайн-чек от 13.09, замечание 9: «Переименовать Issue List в List of
// Errors и перепроверить. Компонент добавлен в ДС, пересобрать на его
// основе: …ESnThXjNXu55oAZWZJEKra?node-id=69901-25857». Переименование
// сделано; сверить геометрию с новым мастером не удалось — файл
// `ESnThXjNXu55oAZWZJEKra` открыт только на чтение и по MCP не отдаётся, а в
// доступной копии `lSQi6Xn5HHrt1yvGCIFPZb` этой ноды нет. Числа ниже — с
// прежнего сета `Errors List (ELK)`, и их надо перемерить, как только
// появится ссылка на тот же кадр в копии.
//
// ⚠️ Зазор 23 — не промах дизайнера, и «исправлять» его на 24 нельзя. Линия
// 1px стоит В ПОТОКЕ, поэтому от кромки линии до текста получается ровно 24:
// 1 + 23 + 24 = 48.
//
// Свойство `Value` (1 / 2 / 3) из сета пропом НЕ становится — это
// перечисленные примеры количества, а количество приходит содержимым.
//
// Разделитель принадлежит СПИСКУ, а не строке (так он лежит в сете):
// одиночная строка линии не рисует, два списка подряд дадут две линии.

interface ListOfErrorsProps extends React.ComponentProps<"div"> {
  /**
   * Показывать разделитель над списком. Наша надстройка (булевых свойств у
   * сета нет), умолчание — «показывать», как во всех трёх вариантах сета:
   * список ставится и там, где линия уже есть выше.
   *
   * Отдельного правила отступа выключение не потребовало: зазор 23 объявлен
   * МЕЖДУ линией и коробкой строк, и при одном ребёнке flex его не рисует —
   * то есть выключение убирает и линию, и отступ разом (замер: 80 и 24 с
   * линией против 56 и 0 без неё).
   */
  showDivider?: boolean
}

function ListOfErrors({
  showDivider = true,
  className,
  children,
  ...props
}: ListOfErrorsProps) {
  const items = React.Children.toArray(children)

  return (
    <div
      data-slot="list-of-errors"
      className={cn("flex flex-col gap-[23px]", className)}
      {...props}
    >
      {showDivider && <Divider />}
      <ul data-slot="list-of-errors-items" className="flex flex-col gap-2">
        {items.map((child, index) => (
          <li
            key={index}
            data-slot="list-of-errors-item"
            className="motion-safe:animate-[issue-item-in_200ms_ease-out_both]"
            // Лесенка 40 мс по первым четырём строкам, дальше задержка
            // держится на 160 мс: иначе пятая строка обгоняет первые
            // четыре, и вместо «проблем несколько, читать сверху» список
            // проявляется как попало.
            style={{ animationDelay: `${Math.min(index, 4) * 40}ms` }}
          >
            {child}
          </li>
        ))}
      </ul>
    </div>
  )
}

export { ListOfErrors }
export type { ListOfErrorsProps }
