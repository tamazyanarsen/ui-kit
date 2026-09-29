import * as React from "react"

import { cn } from "@/lib/utils"
import { useComposedRefs } from "@/lib/compose-refs"

import { Checkbox } from "./checkbox"
import { useFormReset } from "./use-form-reset"

// CheckboxGroup — набор флажков, которым правит один массив выбранных
// значений, с необязательной родительской строкой «выбрать всё».
//
// В отличие от Radio, у Base UI нет группового примитива, который брал бы
// это поведение на себя, поэтому совместная часть — какие дети включены и
// какое трёхзначное состояние родителя (отмечен, частично, не отмечен) из
// них выводится — живёт здесь. В этом и весь смысл компонента: интересное
// поведение набора флажков — это отношение родителя и детей (то самое
// состояние «Partial», которым пользуется шапка выбора всех строк в
// Table), и проверить его, в том числе тестом, можно только когда что-то
// владеет ими всеми сразу.
//
// Раскладка совпадает с RadioGroup: вертикальная стопка с шагом 24px, по
// общему кадру «Use» («Вертикальный отступ ... составляет 24 px»).

interface CheckboxGroupItem {
  value: string
  label?: React.ReactNode
  comment?: React.ReactNode
  disabled?: boolean
}

interface CheckboxGroupProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  items: (CheckboxGroupItem | null | false)[]
  /** Controlled set of checked values. */
  value?: string[] | null
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  /** Рисует родительскую строку над детьми. Отметка в ней выбирает всех
   * доступных детей, снятие — снимает выбор со всех, а частичный выбор
   * показывает промежуточное состояние. */
  selectAllLabel?: React.ReactNode
  /** Имя поля в нативной форме: каждый отмеченный флажок уходит в
   * `FormData` парой `name=value` — как у RadioGroup. Без `name` группа в
   * нативную форму ничего не отправляет, значение берётся из
   * `value`/`onValueChange`. */
  name?: string
}

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup({
  className,
  items,
  value,
  defaultValue = [],
  onValueChange,
  disabled = false,
  selectAllLabel,
  name,
  ...props
}, ref) {
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue)
  const selected = value ?? uncontrolled

  // Нативный сброс формы возвращает неуправляемую группу к `defaultValue`.
  // Флажки внутри управляемые (им правит массив группы), и их собственный
  // сброс держал бы текущий выбор — на экране и в форме оставалось
  // отмеченным то, что пользователь выбрал до сброса.
  const [node, setNode] = React.useState<HTMLDivElement | null>(null)
  const composedRef = useComposedRefs(ref, setNode)
  const defaultRef = React.useRef(defaultValue)
  useFormReset(node, () => {
    if (value == null) setUncontrolled(defaultRef.current)
  })

  function commit(next: string[]) {
    // Всегда пишем и в своё состояние: если родитель позже вернёт `null`, покажется
    // последний выбор, а не устаревший (r27).
    setUncontrolled(next)
    onValueChange?.(next)
  }

  function toggle(itemValue: string) {
    commit(
      selected.includes(itemValue)
        ? selected.filter((entry) => entry !== itemValue)
        : [...selected, itemValue]
    )
  }

  // «Выбрать всё» всегда охватывает только те опции, до которых
  // пользователь может дотянуться: выключенную строку родитель не должен ни
  // переключать, ни удерживать себя из-за неё от состояния «отмечено
  // полностью».
  // Пункты собирают условиями: `null`/`false` среди них отбрасываются.
  const rows = items.filter((item): item is CheckboxGroupItem => !!item)
  const selectable = rows.filter((item) => !item.disabled).map((i) => i.value)
  const selectedCount = selectable.filter((entry) =>
    selected.includes(entry)
  ).length
  const allSelected = selectable.length > 0 && selectedCount === selectable.length
  const someSelected = selectedCount > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      commit(selected.filter((entry) => !selectable.includes(entry)))
      return
    }
    commit([...new Set([...selected, ...selectable])])
  }

  return (
    <div
      ref={composedRef}
      data-slot="checkbox-group"
      role="group"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {selectAllLabel !== undefined && (
        <Checkbox
          data-slot="checkbox-group-all"
          label={selectAllLabel}
          checked={allSelected}
          indeterminate={someSelected}
          disabled={disabled || selectable.length === 0}
          onCheckedChange={toggleAll}
        />
      )}
      {rows.map((item) => (
        <Checkbox
          key={item.value}
          name={name}
          value={item.value}
          label={item.label}
          comment={item.comment}
          checked={selected.includes(item.value)}
          disabled={disabled || item.disabled}
          onCheckedChange={() => toggle(item.value)}
        />
      ))}
    </div>
  )
})

export { CheckboxGroup }
export type { CheckboxGroupProps, CheckboxGroupItem }
