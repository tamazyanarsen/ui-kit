import type * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"

// «Сбросить» слева и «Применить» или «Выбрать N» справа, разделённые
// вертикальной линией, вровень с нижними углами всплывающего окна.
//
// Оба действия в макете — инстансы `ELK / button` (56px высотой, 32px по
// бокам, P1 Medium 16/24), та же конструкция подвала, что и у карточки
// Calendar, поэтому здесь рисуется настоящий Button. Важнее всего это для
// выключенного состояния: макет гасит кнопку целиком (заливка grey-114
// #EFEFEF, подпись grey-166 #C8C8CB), а это ровно пара
// --btn-muted-bg и --btn-muted-fg у Button. Самодельный вариант, который
// это заменило, приглушал только *подпись*, оставляя заливку белой.
//
// `rounded-none` — потому что подвал стоит вровень внутри собственной
// скруглённой оболочки всплывающего окна с overflow-hidden (см. Dropdown).

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
      className={cn(
        "flex shrink-0 border-t border-[var(--menu-item-divider)]",
        className
      )}
    >
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onReset}
        disabled={resetDisabled}
        className="min-w-0 flex-1 rounded-none whitespace-nowrap"
      >
        {resetLabel}
      </Button>
      {/* Макет рисует разделение собственным элементом «Devider» толщиной
          1px, а не рамкой на одной из кнопок; да и border-r здесь всё равно
          проиграл бы собственному базовому `border-transparent` у Button.
          Этот элемент — общий компонент «ELK / divider». */}
      <Divider orientation="vertical" />
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onApply}
        disabled={applyDisabled}
        className="min-w-0 flex-1 rounded-none whitespace-nowrap"
      >
        {applyLabel}
      </Button>
    </div>
  )
}
