import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxFooter,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  useComboboxSelection,
} from "@/components/ui/combobox"

// Триггер со счётчиком документов и два формата подписи в подвале.

interface DocItem {
  value: string
  label: string
}

const DOCUMENTS: DocItem[] = [
  { value: "doc-1", label: "Паспорт РФ" },
  { value: "doc-2", label: "СНИЛС" },
  { value: "doc-3", label: "ИНН" },
  { value: "doc-4", label: "Договор аренды" },
  { value: "doc-5", label: "Выписка ЕГРЮЛ" },
]

// Document-count trigger ("Выбрано документов: N") with the two footer
// count formats: capped ("Выбрать: N/max") and uncapped ("Выбрать: N").
function DocumentsMultiSelect({ max }: { max?: number }) {
  const sel = useComboboxSelection<DocItem>([])
  const atMax = max !== undefined && sel.draft.length >= max

  return (
    <Combobox
      open={sel.open}
      onOpenChange={(next) => sel.setOpen(next)}
      value={sel.draft}
      onValueChange={(next) => sel.setDraft(next)}
      items={DOCUMENTS}
      itemToStringLabel={(d: DocItem) => d.label}
    >
      <ComboboxTrigger
        label="Название"
        placeholder={sel.committed.length === 0}
        clearable={sel.committed.length > 0}
        onClear={() => sel.setCommitted([])}
      >
        {sel.committed.length > 0
          ? `Выбрано документов: ${sel.committed.length}`
          : ""}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(doc: DocItem) => (
              <ComboboxItem
                key={doc.value}
                value={doc}
                disabled={atMax && !sel.draft.includes(doc)}
              >
                {doc.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
        <ComboboxFooter
          applyLabel={
            max !== undefined
              ? `Выбрать: ${sel.draft.length}/${max}`
              : `Выбрать: ${sel.draft.length}`
          }
          onReset={sel.reset}
          onApply={sel.apply}
          resetDisabled={!sel.canReset}
          applyDisabled={!sel.canApply}
        />
      </ComboboxContent>
    </Combobox>
  )
}

export { DocumentsMultiSelect }
