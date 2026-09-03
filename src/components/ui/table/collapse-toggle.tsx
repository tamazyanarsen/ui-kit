import { ChevronUp } from "@/icons"

// The collapse/expand chevron shared by the header ("свернуть весь блок до
// строк первого уровня") and by every parent row. The spec draws its hit
// area as a full-height band around the 16px glyph ("Кликабельная область
// ограничена белой зоной"), which a pseudo-element gives without changing
// the cell's own flex layout.
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
      // The glyph is already at full contrast, so a colour change would be
      // no focus indicator at all — it gets the kit's ring like every other
      // control in the table.
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
