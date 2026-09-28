import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

import { RadioGroupSelectContext } from "./group-context"
import { Radio } from "./radio"

// Группирует пункты Radio — по макету «включение одной означает отключение
// другой» (выбор одного снимает выбор с остальных). Рисует <div>, а
// раскладку оставляет вызывающему коду через className (по умолчанию —
// вертикальная стопка).
//
// Второй проход: зазор стоял 12px (gap-3), а документационный кадр «Use» и
// для Radio, и для Checkbox говорит об этом прямо: «Вертикальный отступ
// между радиокнопками составляет 24 px, для мобильной версии 24 px», то
// есть 24px на обоих брейкпоинтах.
//
// Заполнить группу можно двумя способами. Передача `items` объявляет всю
// группу в одном месте, и именно это делает *групповое* поведение (выбор по
// одному за раз, перемещение фокуса стрелками, пропуск выключенных опций)
// проверяемым как единое целое, а не как кучка отдельных радиокнопок.
// Передача детей сохраняет исходную композиционную форму для раскладок,
// которые списком пунктов не выразить.

interface RadioGroupItem {
  value: string
  label?: React.ReactNode
  comment?: React.ReactNode
  disabled?: boolean
}

interface RadioGroupProps
  extends Omit<RadioGroupPrimitive.Props, "children"> {
  items?: RadioGroupItem[]
  children?: React.ReactNode
}

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
const RadioGroup = React.forwardRef<
  HTMLDivElement,
  RadioGroupProps
>(function RadioGroup({
  className,
  items,
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}, ref) {
  // Неуправляемая группа держит значение сама, а не в Base UI: иначе запись
  // формы в `ref.checked` радиокнопки было бы некуда применить.
  const [own, setOwn] = React.useState<unknown>(defaultValue ?? null)
  const controlled = value !== undefined
  // Текущее значение группы. Запись React `checked = false` прежней кнопке
  // приходит в коммите, когда группа уже выбрала новую. `select` обновляет
  // ref СРАЗУ, а не на рендере: форма пишет `checked` всем кнопкам подряд
  // (`a = true`, затем `c = false`), и к записи в `c` группа должна уже
  // считать выбранной `a` — иначе `false` в прежде выбранную `c` снимал бы
  // только что сделанный выбор.
  const ownRef = React.useRef(own)
  ownRef.current = own
  const selectApi = React.useMemo(
    () => ({
      select: (next: unknown) => {
        ownRef.current = next
        setOwn(next)
      },
      isSelected: (candidate: unknown) => Object.is(ownRef.current, candidate),
    }),
    []
  )

  const group = (
    <RadioGroupPrimitive
      ref={ref}
      data-slot="radio-group"
      className={cn("flex flex-col gap-6", className)}
      value={controlled ? value : own}
      onValueChange={(next, details) => {
        onValueChange?.(next, details)
        if (!controlled && !details.isCanceled) setOwn(next)
      }}
      {...props}
    >
      {items
        ? items.map((item) => (
            <Radio
              key={item.value}
              value={item.value}
              label={item.label}
              comment={item.comment}
              disabled={item.disabled}
            />
          ))
        : children}
    </RadioGroupPrimitive>
  )

  // Провайдер стоит всегда: условная обёртка пересоздавала бы группу при
  // смене управляемости.
  return (
    <RadioGroupSelectContext.Provider value={controlled ? null : selectApi}>
      {group}
    </RadioGroupSelectContext.Provider>
  )
})

export { RadioGroup }
export type { RadioGroupProps, RadioGroupItem }
