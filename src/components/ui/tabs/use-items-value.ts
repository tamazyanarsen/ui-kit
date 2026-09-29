import * as React from "react"

interface ValueItem {
  value: string
  disabled?: boolean
}

/**
 * Значение ряда пунктов (Tabs, Switcher) в управляемом и неуправляемом
 * режиме.
 *
 * Неуправляемое значение, которого нет среди `items` (активный пункт удалили
 * или пункты пришли асинхронно), откатывается на первый доступный пункт.
 * Раньше откат жил только в отрисовке: внутреннее значение оставалось
 * прежним, `onValueChange` не вызывался — потребитель показывал раздел
 * пропавшего пункта под выбранным первым, а когда пункт возвращали, выбор
 * сам прыгал обратно без действия пользователя. Теперь откат фиксируется во
 * внутреннем состоянии и сообщается наружу один раз.
 *
 * Управляемое значение не трогается: решать, что выбрано, — дело родителя.
 */
function useItemsValue(
  items: ValueItem[],
  value: string | undefined,
  defaultValue: string | undefined,
  onValueChange: ((value: string) => void) | undefined
) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const fallbackValue = (items.find((item) => !item.disabled) ?? items[0])?.value
  const internalPresent = items.some((item) => item.value === internalValue)
  const activeValue = value ?? (internalPresent ? internalValue : fallbackValue)

  const onValueChangeRef = React.useRef(onValueChange)
  onValueChangeRef.current = onValueChange
  // Откат с одного и того же значения сообщается один раз — защита от
  // двойного запуска эффекта в StrictMode. Метка снимается, как только
  // значение снова есть среди пунктов: иначе повторное удаление того же
  // пункта (вернули, пользователь выбрал его, снова убрали) не откатывалось.
  const reportedFromRef = React.useRef<string | undefined>(undefined)
  React.useEffect(() => {
    if (internalPresent) reportedFromRef.current = undefined
    if (value !== undefined || internalValue === undefined || internalPresent) return
    // Пункты ещё не пришли (пустой массив) — откатываться некуда, значение
    // ждёт своих пунктов.
    if (fallbackValue === undefined) return
    if (reportedFromRef.current === internalValue) return
    reportedFromRef.current = internalValue
    setInternalValue(fallbackValue)
    onValueChangeRef.current?.(fallbackValue)
  }, [value, internalValue, internalPresent, fallbackValue])

  function setValue(next: string) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  return { activeValue, setValue }
}

export { useItemsValue }
