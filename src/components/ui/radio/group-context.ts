import * as React from "react"

/**
 * Выбор в RadioGroup кита мимо пользователя: запись `ref.checked` формой
 * (`defaultValues`, `setValue`, `reset` в react-hook-form) попадает сюда и
 * становится значением группы. Есть только у неуправляемой группы — у
 * управляемой значение задаёт родитель.
 *
 * `isSelected` нужен, чтобы отличить снятие выбора формой от записи самого
 * React: при выборе другой кнопки React пишет `checked = false` прежней,
 * но к этому моменту значение группы уже новое.
 */
interface RadioGroupSelect {
  select: (value: unknown) => void
  isSelected: (value: unknown) => boolean
}

const RadioGroupSelectContext = React.createContext<RadioGroupSelect | null>(null)

export { RadioGroupSelectContext }
export type { RadioGroupSelect }
