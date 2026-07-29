import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

// Autocomplete — a single-select type-ahead: the visible field IS the
// trigger (an `Input`-styled `Combobox.Input`, not a button that opens a
// popup), and results appear inline below as the user types. Distinct from
// ./combobox, which is always multi-select with a button trigger + a
// checkbox-driven list opened by clicking it.
//
// Real usage is server-driven (e.g. searching an org by ИНН/name via API),
// so internal filtering is disabled by default (`filter={null}`) — the
// caller passes back already-filtered `items` for whatever the current
// `inputValue` is, via `onInputValueChange`.
//
// Base UI has no `Combobox.Trigger` in this tree (there's no button — the
// field itself opens the popup), so its default positioning anchor is just
// the bare `<input>` — narrower than AutocompleteField's outer box (which
// also has label/clear-button padding), making the popup render undersized
// and offset from the field. AnchorContext threads a ref to that outer box
// from field.tsx to content.tsx so the popup anchors to the whole field
// instead, matching every other trigger-based popup in this kit.
const AnchorContext = React.createContext<React.RefObject<HTMLDivElement | null> | null>(null)

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
    <AnchorContext.Provider value={anchorRef}>
      <ComboboxPrimitive.Root multiple={false} filter={null} {...props} />
    </AnchorContext.Provider>
  )
}

export { Autocomplete, useAutocompleteAnchor }
