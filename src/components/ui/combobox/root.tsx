import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

// Текст строки поиска, видимый частям кита. Base UI держит его в своём
// закрытом контексте, а кнопке очистки поиска нужно знать, есть ли текст:
// показывать её надо по тексту, а не по выбору.
const SearchTextContext = React.createContext<string | null>(null)

export function useComboboxSearchText() {
  return React.useContext(SearchTextContext)
}

// Тонкий реэкспорт. Этот фасет дизайна (поиск, дерево и подвал с
// «Сбросить» и «Применить») всегда работает с множественным выбором,
// поэтому вызывающему коду не нужно передавать `multiple` самому.
export function Combobox<Value = string>({
  inputValue,
  defaultInputValue,
  onInputValueChange,
  ...props
}: Omit<ComboboxPrimitive.Root.Props<Value, true>, "multiple">) {
  const [ownText, setOwnText] = React.useState(String(defaultInputValue ?? ""))
  const text = inputValue !== undefined ? String(inputValue) : ownText

  return (
    <SearchTextContext.Provider value={text}>
      <ComboboxPrimitive.Root
        multiple
        inputValue={inputValue}
        defaultInputValue={defaultInputValue}
        onInputValueChange={(next, details) => {
          setOwnText(next)
          onInputValueChange?.(next, details)
        }}
        {...props}
      />
    </SearchTextContext.Provider>
  )
}
