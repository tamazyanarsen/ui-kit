import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

// Тонкий реэкспорт. Этот фасет дизайна (поиск, дерево и подвал с
// «Сбросить» и «Применить») всегда работает с множественным выбором,
// поэтому вызывающему коду не нужно передавать `multiple` самому.
export function Combobox<Value = string>(
  props: Omit<ComboboxPrimitive.Root.Props<Value, true>, "multiple">
) {
  return <ComboboxPrimitive.Root multiple {...props} />
}
