import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxFooter,
  ComboboxGroupRow,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  useComboboxSelection,
  type ComboboxCheckboxState,
} from "@/components/ui/combobox"

// Двухуровневый каскад чекбоксов без поиска.

interface TreeChild {
  value: string
  label: string
  description?: string
}

const TREE_CHILDREN: TreeChild[] = [
  { value: "child-1", label: "Text", description: "Description" },
  { value: "child-2", label: "Text", description: "Description" },
  { value: "child-3", label: "Text", description: "Description" },
]

// Plain multi-select with a two-level checkbox cascade: parent goes
// indeterminate/checked/unchecked from its children, and toggling the
// parent selects/clears all of them at once (no search facet here).
function TreeMultiSelectDropdown() {
  const sel = useComboboxSelection<TreeChild>([])

  const checkedChildren = TREE_CHILDREN.filter((c) =>
    sel.draft.includes(c)
  ).length
  const parentState: ComboboxCheckboxState =
    checkedChildren === 0
      ? "unchecked"
      : checkedChildren === TREE_CHILDREN.length
        ? "checked"
        : "indeterminate"

  function toggleParent() {
    if (parentState === "checked") {
      sel.setDraft((prev) => prev.filter((v) => !TREE_CHILDREN.includes(v)))
    } else {
      sel.setDraft((prev) => [
        ...prev.filter((v) => !TREE_CHILDREN.includes(v)),
        ...TREE_CHILDREN,
      ])
    }
  }

  return (
    <Combobox
      open={sel.open}
      onOpenChange={(next) => sel.setOpen(next)}
      value={sel.draft}
      onValueChange={(next) => sel.setDraft(next)}
      items={TREE_CHILDREN}
      itemToStringLabel={(c: TreeChild) => c.label}
    >
      <ComboboxTrigger
        placeholder={sel.committed.length === 0}
        clearable={sel.committed.length > 0}
        onClear={() => sel.setCommitted([])}
      >
        {sel.committed.length > 0
          ? `Выбрано: ${sel.committed.length}`
          : "Список"}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroupRow
            label="Text"
            description="Description"
            state={parentState}
            onToggle={toggleParent}
          />
          <ComboboxCollection>
            {(child: TreeChild) => (
              <ComboboxItem
                key={child.value}
                value={child}
                description={child.description}
                level={1}
              >
                {child.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
        <ComboboxFooter
          applyLabel={`Выбрать: ${sel.draft.length}`}
          onReset={sel.reset}
          onApply={sel.apply}
          resetDisabled={!sel.canReset}
          applyDisabled={!sel.canApply}
        />
      </ComboboxContent>
    </Combobox>
  )
}

export { TreeMultiSelectDropdown }
