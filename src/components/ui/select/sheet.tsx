import * as React from "react"

// Мобильная штора Select — общее состояние корня, триггера, окна и пунктов.
//
// Правки UI-Kit от 25.10, «Выпадающие списки — нет мобильного варианта
// „штора“»: в мобильном виде (уже 1280) поле выбора открывает не поповер, а
// штору `MenuSheet` со строками во всю ширину; у выбранной — галка, нажатие
// строки применяет выбор и закрывает штору, кнопок нет.
//
// ⚠️ Примитив Base UI при этом остаётся корнем поля, только его собственное
// окно держится закрытым (`open={false}`): так у поля сохраняются значение,
// скрытый `<input name>` для формы, `required`/`disabled`/`readOnly`,
// подпись значения в `SelectValue` и `onValueChange` потребителя. Пункты
// Base UI без своего окна жить не могут (их регистрирует окно), поэтому в
// шторе `SelectItem` рисует строку шторы, а выбор идёт через ту же функцию
// смены значения, что и крестик «Очистить».

interface SelectSheetContextValue {
  open: boolean
  setOpen: (open: boolean, event?: Event) => void
  /** Выбор пункта: одиночный — заменяет значение, множественный — переключает. */
  choose: (value: unknown, event: Event) => void
  isSelected: (value: unknown) => boolean
  multiple: boolean
  /** Поле не открывается (выключено или только для чтения). */
  locked: boolean
  /** Подпись триггера — заголовок шторы; её сообщает `SelectTrigger`. */
  titleRef: React.MutableRefObject<React.ReactNode>
}

const SelectSheetContext = React.createContext<SelectSheetContextValue | null>(null)

/** Мобильная штора поля — есть только в мобильном виде. */
function useSelectSheet() {
  return React.useContext(SelectSheetContext)
}

export { SelectSheetContext, useSelectSheet }
export type { SelectSheetContextValue }
