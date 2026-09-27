import { ChevronUp } from "@/icons"

// Шеврон сворачивания и разворачивания, общий у шапки («свернуть весь блок
// до строк первого уровня») и у каждой родительской строки. Макет рисует
// его область нажатия полосой во всю высоту вокруг глифа 16px
// («Кликабельная область ограничена белой зоной»), и псевдоэлемент даёт
// именно это, не меняя собственную flex-раскладку ячейки.
//
// Сквозное правило проекта: **свёрнуто — шеврон вниз, развёрнуто — вверх**,
// вправо он не смотрит никогда, даже если так нарисовано в ките
// (документация таблиц описывала свёрнутую строку данных как «шеврон
// вправо» — расхождение закрыто в пользу «вниз/вверх», внутри одной таблицы
// двух логик быть не может).
//
// Техника тоже часть правила, иначе компоненты кита разъедутся:
//  • иконка ОДНА и переворачивается, а не подменяется на вторую — подмена не
//    даёт плавного переворота, а он здесь читается как одно событие;
//  • крутится ИКОНКА, а не кнопка: коробка кнопки шире глифа, и поворот
//    кнопки увёл бы шеврон в сторону;
//  • состояние берётся из `aria-expanded` — второго источника правды не
//    заводим.
function TableCollapseToggle({
  expanded,
  onExpandedChange,
  label,
}: {
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      data-slot="table-collapse-toggle"
      aria-expanded={expanded}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onExpandedChange?.(!expanded)
      }}
      // Глиф и так нарисован полным контрастом, поэтому смена цвета
      // признаком фокуса не была бы вовсе: он получает стандартное кольцо
      // кита, как и любой другой контрол в таблице.
      className="group/collapse relative flex shrink-0 cursor-pointer rounded-[4px] text-[var(--table-fg)] outline-none before:absolute before:-inset-x-2 before:-inset-y-4 before:content-[''] focus-visible:focus-ring"
    >
      <ChevronUp
        aria-hidden="true"
        className="size-4 transition-transform duration-150 ease-out group-aria-[expanded=false]/collapse:rotate-180"
      />
    </button>
  )
}

/** Подпись шеврона: она же различает уровень (весь блок или одна строка). */
function collapseLabel(expanded: boolean | undefined, scope: "all" | "row") {
  if (scope === "all") {
    return expanded ? "Свернуть все строки" : "Развернуть все строки"
  }
  return expanded ? "Свернуть строку" : "Развернуть строку"
}

export { TableCollapseToggle, collapseLabel }
