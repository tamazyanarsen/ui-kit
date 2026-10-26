import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { filterTablePillClass } from "./filter-table"
import { useFilterBarField } from "./filter-bar-context"

// FilterBoolean — «Булев фильтр».
//
// «Не имеет выпадающего окна и срабатывает по значению „Истина“. Примеры
// использования: Ненулевой баланс — система должна показать все счета,
// баланс которых выше нуля».
//
// То есть это вообще не FilterShell: раз всплывающего окна нет, то нет ни
// триггера, который надо заякорить, ни пары «Применить/Сбросить», ни
// значения для показа. Это таблетка-переключатель, которая либо включена
// («фильтр действует»), либо выключена («фильтр не действует»), нарисованная
// той же заливкой `ELK / filter-table`, что и любой другой чип.
//
// В свёрнутом `FilterBar` (мобильный вид, Правки UI-Kit от 25.10) флаг —
// `Checkbox` с подписью в шторе «Фильтры», и, как всё в шторе, — черновик до
// «Применить».

interface FilterBooleanProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "onChange" | "defaultValue"
  > {
  label: React.ReactNode
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (value: boolean) => void
}

const FilterBoolean = React.forwardRef<
  HTMLButtonElement,
  FilterBooleanProps
>(function FilterBoolean({
  className,
  label,
  value,
  defaultValue = false,
  onValueChange,
  disabled = false,
  onClick,
  ...props
}, ref) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const active = value ?? uncontrolled

  function commit(next: boolean) {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  const collapsed = useFilterBarField<boolean>({
    label,
    active,
    value: active,
    empty: () => false,
    commit,
    render: ({ draft, setDraft }) => (
      <Checkbox
        label={label}
        checked={draft}
        disabled={disabled}
        onCheckedChange={(next) => setDraft(next === true)}
      />
    ),
  })
  if (collapsed) return null

  return (
    <button
      ref={ref}
      type="button"
      data-slot="filter-boolean"
      aria-pressed={active}
      disabled={disabled}
      onClick={(event) => {
        commit(!active)
        onClick?.(event)
      }}
      className={cn(
        "max-w-64 min-w-20 cursor-pointer truncate outline-none focus-visible:focus-ring disabled:cursor-not-allowed",
        filterTablePillClass({ selected: active, disabled }),
        className
      )}
      {...props}
    >
      {/* Подпись — в своём узле, как у FilterTable: голый текст во флексе
          кнопки — анонимный элемент, `truncate` ему многоточия не даёт, а
          `justify-center` разводил переполнение в обе стороны. Обрезка —
          `overflow-clip` с запасом, а не `truncate`: тот срезал сглаживание
          первой буквы короткой подписи (2px отличия от прежнего вида). */}
      <span className="min-w-0 flex-1 overflow-clip text-ellipsis whitespace-nowrap [overflow-clip-margin:4px] text-center">{label}</span>
    </button>
  )
})

export { FilterBoolean }
export type { FilterBooleanProps }
