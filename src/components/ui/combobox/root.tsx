import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

// Thin re-export. This facet of the design (search + tree + footer with
// Сбросить/Применить) is always multi-select, so callers don't need to pass
// `multiple` themselves.
export function Combobox<Value = string>(
  props: Omit<ComboboxPrimitive.Root.Props<Value, true>, "multiple">
) {
  return <ComboboxPrimitive.Root multiple {...props} />
}
