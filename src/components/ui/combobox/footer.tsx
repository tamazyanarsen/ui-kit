import type * as React from "react"

import { cn } from "@/lib/utils"
import { DropdownFooterButton } from "@/components/ui/dropdown/dropdown-footer"
import { Divider } from "@/components/ui/divider"

// «Сбросить» слева и «Применить» или «Выбрать N» справа, разделённые
// вертикальной линией, вровень с нижними углами всплывающего окна.
//
// Кнопки — общая кнопка подвала выпадающих списков `DropdownFooterButton`
// (Правки UI-Kit от 25.10, «Button внутри выпадающих списков — своё
// поведение»): заливка наведения и нажатия на всю ячейку без скругления,
// цвета строк списка (Grey 114 / Grey 124), при нажатии сжимается только
// подпись до 0.97. Прежде здесь стоял `Button` secondary-white L: его
// скруглённая заливка ужималась при нажатии, и кнопка выглядела запертой в
// маленьком белом контейнере. Выключенное состояние у общей кнопки то же,
// что было у Button: заливка grey-114 и подпись grey-166
// (--btn-muted-bg / --btn-muted-fg).
//
// Размер — из «ELK / button» L, которым кнопки были в макете: 48 и P2 Medium
// в мобильной форме, 56 и P1 Medium на десктопе (вариант `desktop:`, а не
// `size` мобильного Dropdown — комбобокс переключает форму по окну).
// Боковое поле подписи — 8px (сверка r19: короткое «Сбросить» в поле 200px
// иначе обрезалось, хотя раньше помещалось, заходя в поле кнопки).

const FOOTER_BUTTON =
  "min-h-12 px-2 py-0 text-p1-medium-adaptive whitespace-nowrap desktop:min-h-14"

export function ComboboxFooter({
  className,
  resetLabel = "Сбросить",
  applyLabel,
  onReset,
  onApply,
  resetDisabled,
  applyDisabled,
}: {
  className?: string
  resetLabel?: React.ReactNode
  applyLabel: React.ReactNode
  onReset: () => void
  onApply: () => void
  resetDisabled?: boolean
  applyDisabled?: boolean
}) {
  return (
    <div
      data-slot="combobox-footer"
      // Второй проход: и верхняя линия, и вертикальная линия между двумя
      // кнопками — литеральный grey-134 #DEDEDE в снятом подвале
      // «ELK / dropdown» (и в примере с деревом флажков, и в обычном), а не
      // общий токен кита --border (#E5E5E5).
      //
      // Высота подвала в макете равна высоте кнопок (56px на десктопе, 48 на
      // мобильной): верхняя линия — отдельный элемент «Devider», лежащий
      // поверх верхней кромки кнопок, а не рамка поверх 56px кнопок (та
      // давала 57px). Поэтому линия рисуется наложением (`after`), а не
      // `border-t`, и размер не растёт; высоту задают сами кнопки.
      className={cn(
        "relative flex shrink-0 after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-[var(--menu-item-divider)]",
        className
      )}
    >
      <DropdownFooterButton
        onClick={onReset}
        disabled={resetDisabled}
        className={FOOTER_BUTTON}
      >
        {/* Своим узлом: текст прямо во флексе — анонимный элемент,
            многоточия он не получает, и в узком поле подпись срезалась
            краем без него (аудит 18). `overflow-clip` с запасом 4px, а не
            `truncate`: тот срезает сглаживание последней буквы. */}
        <span className="min-w-0 overflow-clip text-ellipsis whitespace-nowrap [overflow-clip-margin:4px]">{resetLabel}</span>
      </DropdownFooterButton>
      {/* Макет рисует разделение собственным элементом «Devider» толщиной
          1px, а не рамкой на одной из кнопок. Этот элемент — общий
          компонент «ELK / divider». */}
      <Divider orientation="vertical" />
      <DropdownFooterButton
        onClick={onApply}
        disabled={applyDisabled}
        className={FOOTER_BUTTON}
      >
        <span className="min-w-0 overflow-clip text-ellipsis whitespace-nowrap [overflow-clip-margin:4px]">{applyLabel}</span>
      </DropdownFooterButton>
    </div>
  )
}
