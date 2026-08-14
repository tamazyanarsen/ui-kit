import * as React from "react"

// useComboboxSelection — the "draft vs. committed" apply pattern used by
// every multi-select facet in the spec: opening the popup starts a draft
// copy of the committed value, checkbox clicks only mutate the draft, and
// the footer's Сбросить/Применить commit or discard it. Closing the popup
// any other way (Escape, outside click) discards the draft silently.
//
// `T` is whatever the caller uses as the selectable item — matching Base
// UI's own model where a `Combobox.Item`'s `value` can be the full item
// object, not just a string id. Equality is by reference (`Array#includes`),
// which is fine as long as the source item list is a stable identity (a
// module-level constant or same-reference filter/slice of one) — true for
// every facet built on this hook so far.
export function useComboboxSelection<T>(initialValue: T[] = []) {
  const [committed, setCommitted] = React.useState(initialValue)
  const [draft, setDraft] = React.useState(initialValue)
  const [open, setOpenState] = React.useState(false)

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (next) setDraft(committed)
      setOpenState(next)
    },
    [committed]
  )

  const reset = React.useCallback(() => setDraft([]), [])

  const apply = React.useCallback(() => {
    setCommitted(draft)
    setOpenState(false)
  }, [draft])

  const hasChanges =
    draft.length !== committed.length ||
    draft.some((v) => !committed.includes(v))

  return {
    committed,
    setCommitted,
    draft,
    setDraft,
    open,
    setOpen,
    reset,
    apply,
    hasChanges,
    // Дизайн-чек №22: «по умолчанию кнопки сброса и выбора значений не
    // блокируются, даже если не выбрано ничего или выбрано всё». Раньше эти
    // два флага прокидывались в `disabled` подвала, и на пустом списке обе
    // кнопки были серыми — именно это и попало в дизайн-чек.
    //
    // Сами флаги оставлены: они честно описывают состояние черновика и
    // полезны потребителю (например, чтобы подсветить наличие изменений).
    // Но подвал ими больше не блокируется — ни в историях, ни в тестах.
    canReset: draft.length > 0,
    canApply: draft.length > 0 && hasChanges,
  }
}
