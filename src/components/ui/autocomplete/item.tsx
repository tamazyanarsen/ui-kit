import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"

import { highlightMatch } from "./highlight"

// Строка результата: заголовок (жирный, по макету переносится на
// несколько строк для длинных названий организаций, а не обрезается) плюс
// необязательная серая строка подзаголовка (например, «ИНН ... КПП ...»).
// Флажка нет: выбор здесь одиночный, и выбранный результат просто
// заполняет поле, а не набирает список чипов.

interface AutocompleteItemOwnProps {
  subtitle?: React.ReactNode
  /** Текущая строка поиска. В заголовке и подзаголовке отмечается каждое
   * её вхождение без учёта регистра — в подзаголовке тоже, потому что
   * фильтры по связанным параметрам (ИНН и КПП) ищут по обеим половинам:
   * «Настроить поиск таким образом, чтобы он работал и по главному, и по
   * второстепенному параметру» (Фильтрация (ЕЛК)). */
  match?: string
}

function AutocompleteItem({
  className,
  children,
  subtitle,
  match,
  ...props
}: ComboboxPrimitive.Item.Props & AutocompleteItemOwnProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="autocomplete-item"
      // Строка идёт вровень, без скруглений, с отступом p-4 — совпадает с
      // собственными пунктами Select и Combobox, которые делят ровно эту
      // же оболочку Dropdown (см. dropdown.tsx): скруглён только контейнер
      // всплывающего окна, а пункты идут от края до края без собственного
      // радиуса.
      className={cn(
        "flex w-full cursor-default flex-col gap-0.5 p-4 text-p2-medium outline-hidden select-none data-highlighted:bg-[var(--autocomplete-highlighted-bg)] data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* `anywhere`, а не `break-words`: ширина списка берётся по
          содержимому, и только `anywhere` уменьшает min-content —
          иначе неразрывное слово давало прокрутку вбок (аудит 18). */}
      <span className="font-semibold text-[var(--autocomplete-title-fg)] [overflow-wrap:anywhere]">
        {highlightMatch(children, match)}
      </span>
      {subtitle && (
        // Второй проход: добавлен font-medium — каждая литеральная строка
        // «Description», снятая с инстансов Menu Point (ELK), использует
        // Object Sans Medium (500), а не Regular, при том же размере 12px.
        // Отдельного кадра Autocomplete, однако, не существует, поэтому это
        // перенос с общего компонента пункта списка у Select и Combobox, а
        // не значение, подтверждённое по собственному макету Autocomplete.
        <span className="text-p3-medium text-[var(--autocomplete-subtitle-fg)] [overflow-wrap:anywhere]">
          {highlightMatch(subtitle, match)}
        </span>
      )}
    </ComboboxPrimitive.Item>
  )
}

export { AutocompleteItem }
