import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

// ⚠️ У компонента НЕТ истории в Storybook, и это намеренно.
// (Для проверок в браузере есть QA-истории в src/qa-stories, они в каталог не входят: см. .storybook/main.ts.)
//
// Дизайн-чек Storybook (Аня Багрова) №7: «в UI Kit Web LK не существует как
// такового компонента — у нас есть отдельно Input + Dropdown». То есть в
// дизайн-системе Autocomplete не самостоятельный компонент, а композиция, и
// в каталоге Storybook ему не место. Код при этом остаётся: он экспортирован
// из пакета и используется потребителями, удалять его — ломающее изменение,
// которое дизайн-чек не решает. Новую вёрстку собирайте из `Input` и
// `Dropdown` (или берите `Combobox`, если нужен множественный выбор).
//
// Autocomplete — поле с подсказками и одиночным выбором: видимое поле И
// ЕСТЬ триггер (это `Combobox.Input`, оформленный как `Input`, а не кнопка,
// открывающая всплывающее окно), а результаты появляются прямо под ним по
// мере набора. Отличается от ./combobox, который всегда работает с
// множественным выбором, имеет триггер-кнопку и список с флажками,
// открываемый по клику.
//
// В реальном применении поиск идёт на сервере (например, организация по ИНН
// или названию через API), поэтому внутренняя фильтрация по умолчанию
// выключена (`filter={null}`): вызывающий код сам возвращает уже
// отфильтрованные `items` под текущее значение `inputValue` через
// `onInputValueChange`.
//
// `Combobox.Trigger` из Base UI в этом дереве отсутствует (кнопки нет —
// всплывающее окно открывает само поле), поэтому его якорем для
// позиционирования по умолчанию оказывается голый `<input>`, а он уже
// внешней коробки AutocompleteField (у той есть ещё отступы под подпись и
// кнопку очистки). Из-за этого окно рисовалось бы уже, чем нужно, и со
// смещением относительно поля. AnchorContext протягивает ref на эту внешнюю
// коробку из field.tsx в content.tsx, и окно заякоривается на всё поле, как
// и у всех прочих всплывающих окон с триггером в этом ките.
const AnchorContext = React.createContext<React.RefObject<HTMLDivElement> | null>(null)

function useAutocompleteAnchor() {
  const ref = React.useContext(AnchorContext)
  if (!ref) {
    throw new Error("Autocomplete parts must be used within <Autocomplete>")
  }
  return ref
}

function Autocomplete<Value>(
  props: Omit<ComboboxPrimitive.Root.Props<Value, false>, "multiple" | "filter"> & {
    filter?: ComboboxPrimitive.Root.Props<Value, false>["filter"]
  }
) {
  const anchorRef = React.useRef<HTMLDivElement>(null)
  return (
    // Выводимый тип useRef здесь различается между версиями @types/react
    // (в React 19 RefObject<T> включает `| null` в сам T, в React 18 —
    // нет), поэтому приведение типа держит объявленный тип AnchorContext
    // одинаковым для обеих версий вместо того, чтобы разводить тип по
    // версии React.
    <AnchorContext.Provider value={anchorRef as React.RefObject<HTMLDivElement>}>
      <ComboboxPrimitive.Root multiple={false} filter={null} {...props} />
    </AnchorContext.Provider>
  )
}

export { Autocomplete, useAutocompleteAnchor }
