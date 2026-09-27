import * as React from "react"
import { X } from "@/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// «ELK / filter-table» (v1.0.1) — компактная таблетка, которая служит и
// нажимаемой подсказкой (чипы ответов в NPS), и выбранным фильтром
// таблицы. В макете оба вида сделаны одним компонентом со свойством
// `Checked`, поэтому и здесь они живут вместе, а не двумя похожими
// близнецами.
//
// Значения ниже прочитаны прямо с символов вариантов:
//   Checked=False  Default  — фон grey-109 #F4F4F4, текст #252628
//                  Hover    — фон grey-114 #EFEFEF
//                  Disabled — фон grey-114 #EFEFEF, текст grey-166 #C8C8CB
//   Checked=True   Default  — фон dark-blue-1412 #012F42, текст белый,
//                             плюс крестик закрытия 16px
// Коробка общая: max-w-256, px-16/py-6, радиус 16, P2 Medium 14/20, зазор 8.
// Обратите внимание: оба выключенных вида — это #EFEFEF/#C8C8CB (то есть
// --btn-muted-*), а НЕ более светлый #F4F4F4 из --chips-disabled-bg.

/** Внешний вид самой таблетки вынесен из компонента, потому что два
 * реальных места использования не могут делить один тип элемента: подсказка
 * в NPS сама является кнопкой, а чип у `FilterTableSelect` — это триггер
 * поповера, *внутрь* которого вложена кнопка сброса, а вложенные <button>
 * недопустимы в HTML. Общие классы при этом оставляют геометрию и цвета в
 * одном месте. */
function filterTablePillClass({
  selected = false,
  disabled = false,
}: { selected?: boolean; disabled?: boolean } = {}) {
  return cn(
    // ⚠️ `min-w-20` — не догадка, а «Правила отступов» из доки компонента
    // (файл-копия): «минимальная ширина — 80 px,
    // максимальная ширина — 256 px. Если название не умещается в
    // максимальную ширину, то оно скрывается в многоточие». Дизайн-чек
    // «Storybook 3», замечание 8: без нижней границы короткая подпись («Тип»)
    // давала пилюлю уже 80, и ряд фильтров рассыпался по ширинам.
    // ⚠️ Мобильная адаптация: у пилюли меняется
    // ТОЛЬКО типографика подписи — P2 Medium Mobile (12/16) против
    // десктопного P2 Medium (14/20). Коробка одна и та же на обеих формах:
    // px-16/py-6, радиус 16, зазор 8, крестик и шеврон по 16, плашка
    // счётчика 16 — сверено по мобильным и десктопным символам мастера.
    // Отсюда и разница высот: 28 px на мобайле против 32 на десктопе — она
    // выходит сама из line-height, отдельной высоты задавать не надо.
    // В ките 12/16 Medium — это ключ `p3`, см. таблицу масштаба: мобильный
    // P2 и десктопный P3 совпадают по числам.
    "inline-flex max-w-64 min-w-20 items-center justify-center gap-2 rounded-[16px] px-4 py-1.5 text-p3-medium whitespace-nowrap transition-colors desktop:text-p2-medium",
    disabled
      ? // «Disabled гасит ВСЁ» — сквозное правило проекта. В ките у
        // выключенного чипа гаснет подпись (#C8C8CB), а шеврон остаётся
        // #252628; воспроизводить это не надо, глифы наследуют `currentColor`
        // и гаснут вместе с подписью.
        "bg-[var(--btn-muted-bg)] text-[var(--btn-muted-fg)]"
      : selected
        ? "bg-[var(--chips-dark-bg)] text-[var(--chips-dark-fg)] hover:bg-[var(--chips-dark-bg-hover)] active:bg-[var(--chips-dark-bg-active)]"
        : "bg-[var(--chips-light-bg)] text-[var(--chips-fg)] hover:bg-[var(--chips-light-bg-hover)] active:bg-[var(--chips-light-bg-active)]"
  )
}

interface FilterTableProps
  extends Omit<React.ComponentProps<"button">, "onSelect"> {
  /** Figma's `Checked` property: false = grey suggestion, true = dark
   * selected filter. */
  selected?: boolean
  /** Figma's `Counter` property — число в плашке `Badge` рядом с подписью. */
  count?: number
  /**
   * Показывать плашку-счётчик.
   *
   * ⚠️ **По умолчанию выключено, и это отступление от кита.** Вариант сета с
   * `Counter` существует, но в продукте плашка не используется: выбранный чип
   * **называет выбранное** — одно значение подписывается им самим
   * («Действующий»), несколько сворачиваются в «Подпись: N» («Статус: 3»)
   * обычным текстом подписи. По превью кажется, что вокруг цифры плашка, но
   * пипеткой по шаблону фон там тот же `#012F42`, что и у чипа.
   *
   * Механика самой подписи живёт у вызывающей стороны (`children`) — чип
   * рисует то, что ему дали.
   */
  showCounter?: boolean
  /**
   * Рисовать ли крестик у выбранного чипа.
   *
   * У фильтра таблицы выбор снимается крестиком, поэтому по умолчанию он
   * есть. В NPS выбранная подсказка — не фильтр, а «какой вариант сейчас
   * подставлен в поле»: снимается он правкой текста, а не крестиком
   * (дизайн-чек №3 №15), поэтому там чип тёмно-синий, но без креста.
   */
  showClose?: boolean
}

const FilterTable = React.forwardRef<HTMLButtonElement, FilterTableProps>(
  function FilterTable(
    {
      selected = false,
      count,
      showCounter = false,
      showClose = true,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        data-slot="filter-table"
        data-selected={selected || undefined}
        disabled={disabled}
        className={cn(
          filterTablePillClass({ selected, disabled }),
          "cursor-pointer outline-none focus-visible:focus-ring disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {/* Подпись по центру только у невыбранного вида: у выбранного она
            прижата влево, потому что правый край занимает крестик. */}
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            (!selected || !showClose) && "text-center"
          )}
        >
          {children}
        </span>
        {/* Счётчик — один и тот же значок #6D6D6D на белом в обоих
            состояниях Checked: варианты Counter=True в макете (и серая
            таблетка, и тёмная) несут одинаковый `ELK / badge`, так что на
            тёмной таблетке он не переключается на бледный. */}
        {showCounter && count !== undefined && (
          <Badge type="counter" value={count} color="dark-grey" disabled={disabled} />
        )}
        {selected && showClose && (
          <X aria-hidden="true" className="size-4 shrink-0" />
        )}
      </button>
    )
  }
)

export { FilterTable, filterTablePillClass }
export type { FilterTableProps }
