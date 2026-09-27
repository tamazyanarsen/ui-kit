import * as React from "react"

import { cn } from "@/lib/utils"

import {
  usePinnedCell,
  useTableScrollState,
  type TablePin,
} from "./pin"

// Общая геометрия липких закреплённых ячеек. Краевая ячейка блока (`edge`)
// несёт разделительную линию, отмечающую границу блока, и только пока
// положение прокрутки действительно прячет за ней содержимое.
//
// ⚠️ Здесь раньше стояла универсальная тень кита — та самая, которую
// рисует и макет (`Left Shadow` и `Right Shadow`, drop-shadow #8B99A93D
// 0/4/12). Её убрали намеренно: продукт отказывается от теневых элементов,
// и закреплённый блок теперь отмечается линией 1px цвета Grey 134 по
// внутренней стороне — у левого блока по правому краю, у правого по
// левому. Та же правка стоит в очереди и для самого кита, поэтому
// последующий проход, обнаруживший «в макете тень», возвращать её НЕ
// должен.
function usePinPresentation<T extends HTMLTableCellElement>(
  pin: TablePin | undefined,
  header: boolean
) {
  const { ref, offset, edge } = usePinnedCell<T>(pin)
  const { scrolledFromStart, scrolledFromEnd } = useTableScrollState()

  // «Блок реально перекрывает прокручиваемый контент». Отдельно от линии,
  // потому что её рисует только крайняя ячейка блока (`edge`), а вот
  // собственная непрозрачная заливка нужна всем ячейкам блока.
  const covers =
    (pin === "left" && scrolledFromStart) ||
    (pin === "right" && scrolledFromEnd)

  const style: React.CSSProperties | undefined = pin
    ? pin === "left"
      ? { left: offset }
      : { right: offset }
    : undefined

  // Ячейки шапки лежат выше ячеек тела, а закреплённая ячейка шапки — выше
  // остальной шапки, иначе прокручиваемые колонки проезжают над углом, где
  // встречаются два липких элемента.
  // Обратите внимание: фона здесь намеренно нет. Закреплённая ячейка обязана
  // быть непрозрачной, но *какая именно* заливка — разное: шапка остаётся
  // белой, а ячейка тела берёт собственную заливку строки. Поэтому каждое
  // место вызова дописывает свою заливку после этой строки классов.
  const className = pin
    ? cn("relative sticky", header ? "z-30" : "z-10")
    : header
      ? "relative z-20"
      : "relative"

  // Настоящий элемент, а не `::after`: у `<th>` оба псевдоэлемента уже
  // заняты нижней линией шапки и разделителем колонок. Спозиционирован
  // абсолютно, чтобы не отъедать пиксель у ширины блока, как это сделала бы
  // `border`, — а именно этот пиксель и увёл бы шапку из выравнивания с
  // телом.
  const divider =
    pin && edge ? (
      <span
        aria-hidden="true"
        data-slot="table-pin-divider"
        className={cn(
          "pointer-events-none absolute inset-y-0 z-[1] w-px bg-[var(--table-pin-divider)] transition-opacity duration-150 ease-out",
          pin === "left" ? "right-0" : "left-0",
          covers ? "opacity-100" : "opacity-0"
        )}
      />
    ) : null

  return { ref, style, className, covers, divider }
}

export { usePinPresentation }
