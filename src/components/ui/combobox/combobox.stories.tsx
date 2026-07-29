import type { Meta, StoryObj } from "@storybook/react-vite"

import { Combobox } from "./root"
import { ComboboxTrigger } from "./trigger"
import { ComboboxContent, ComboboxList, ComboboxCollection } from "./content"
import { ComboboxItem, ComboboxGroupRow } from "./item"
import { ComboboxFooter } from "./footer"
import { useComboboxSelection } from "./use-combobox-selection"
import type { ComboboxCheckboxState } from "./checkbox"

interface Doc {
  value: string
  label: string
}

const DOCUMENTS: Doc[] = [
  { value: "doc-1", label: "Паспорт РФ" },
  { value: "doc-2", label: "СНИЛС" },
  { value: "doc-3", label: "ИНН" },
  { value: "doc-4", label: "Договор аренды" },
  { value: "doc-5", label: "Выписка ЕГРЮЛ" },
]

function DocumentsMultiSelect({ max }: { max?: number }) {
  const sel = useComboboxSelection<Doc>([])
  const atMax = max !== undefined && sel.draft.length >= max

  return (
    <Combobox
      open={sel.open}
      onOpenChange={sel.setOpen}
      value={sel.draft}
      onValueChange={sel.setDraft}
      items={DOCUMENTS}
      itemToStringLabel={(d: Doc) => d.label}
    >
      <ComboboxTrigger
        label="Название"
        placeholder={sel.committed.length === 0}
        clearable={sel.committed.length > 0}
        onClear={() => sel.setCommitted([])}
      >
        {sel.committed.length > 0 ? `Выбрано документов: ${sel.committed.length}` : ""}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(doc: Doc) => (
              <ComboboxItem key={doc.value} value={doc} disabled={atMax && !sel.draft.includes(doc)}>
                {doc.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
        <ComboboxFooter
          applyLabel={max !== undefined ? `Выбрать: ${sel.draft.length}/${max}` : `Выбрать: ${sel.draft.length}`}
          onReset={sel.reset}
          onApply={sel.apply}
          resetDisabled={!sel.canReset}
          applyDisabled={!sel.canApply}
        />
      </ComboboxContent>
    </Combobox>
  )
}

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

function TreeMultiSelect() {
  const sel = useComboboxSelection<TreeChild>([])
  const checkedChildren = TREE_CHILDREN.filter((c) => sel.draft.includes(c)).length
  const parentState: ComboboxCheckboxState =
    checkedChildren === 0 ? "unchecked" : checkedChildren === TREE_CHILDREN.length ? "checked" : "indeterminate"

  function toggleParent() {
    if (parentState === "checked") {
      sel.setDraft((prev) => prev.filter((v) => !TREE_CHILDREN.includes(v)))
    } else {
      sel.setDraft((prev) => [...prev.filter((v) => !TREE_CHILDREN.includes(v)), ...TREE_CHILDREN])
    }
  }

  return (
    <Combobox
      open={sel.open}
      onOpenChange={sel.setOpen}
      value={sel.draft}
      onValueChange={sel.setDraft}
      items={TREE_CHILDREN}
      itemToStringLabel={(c: TreeChild) => c.label}
    >
      <ComboboxTrigger
        placeholder={sel.committed.length === 0}
        clearable={sel.committed.length > 0}
        onClear={() => sel.setCommitted([])}
      >
        {sel.committed.length > 0 ? `Выбрано: ${sel.committed.length}` : "Список"}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroupRow label="Text" description="Description" state={parentState} onToggle={toggleParent} />
          <ComboboxCollection>
            {(child: TreeChild) => (
              <ComboboxItem key={child.value} value={child} description={child.description} level={1}>
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

const meta = {
  title: "UI/Combobox",
  component: DocumentsMultiSelect,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DocumentsMultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const MultiSelect: Story = {
  render: () => <DocumentsMultiSelect />,
}

export const MultiSelectWithLimit: Story = {
  name: "Multi-select with a 5-item cap",
  render: () => <DocumentsMultiSelect max={5} />,
}

export const TreeCascade: Story = {
  name: "Tree (parent/child checkbox cascade)",
  render: () => <TreeMultiSelect />,
}
