import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, StorySection, StoryShowcase } from "@/stories/matrix"

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

interface DocumentsMultiSelectProps {
  max?: number
  size?: "sm" | "lg"
  label?: string
  comment?: string
  error?: string
  disabled?: boolean
}

function DocumentsMultiSelect({
  max,
  size = "lg",
  label = "Название",
  comment,
  error,
  disabled,
}: DocumentsMultiSelectProps) {
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
      disabled={disabled}
    >
      <ComboboxTrigger
        size={size}
        label={label}
        comment={comment}
        error={error}
        disabled={disabled}
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
  title: "Компоненты/Combobox",
  component: DocumentsMultiSelect,
  parameters: { layout: "padded" },
  // `DocumentsMultiSelect` is declared locally in this file rather than
  // imported from a component module, so react-docgen-typescript doesn't
  // extract its props — declare every control explicitly.
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "sm"] },
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    max: { control: { type: "number", min: 1, max: 5 } },
    disabled: { control: "boolean" },
  },
  args: { size: "lg", label: "Название", disabled: false },
} satisfies Meta<DocumentsMultiSelectProps>

export default meta
type Story = StoryObj<DocumentsMultiSelectProps>

export const Playground: Story = {
  render: (args) => (
    <div className="w-96">
      <DocumentsMultiSelect {...args} />
    </div>
  ),
}

/* The trigger reuses Select's own tokens, so its closed states match Select
   cell for cell; the list is a portalled popup that can only be open once at
   a time, so the open forms are live examples instead of matrix cells. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<DocumentsMultiSelectProps>
        stretch
        cellClassName="min-w-[320px]"
        baseProps={{ label: "Label" }}
        columns={[
          { label: "L (default)", props: { size: "lg" } },
          { label: "S", props: { size: "sm" } },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Focus", props: {}, pseudo: "focus-within" },
          { label: "Comment", props: { comment: "Comment" } },
          { label: "Error", props: { error: "Text about error here" } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <DocumentsMultiSelect {...props} />}
      />

      <StoryShowcase className="bg-transparent p-0">
        <StorySection
          title="Множественный выбор"
          description="Чекбоксы, кнопки «Сбросить» / «Выбрать» в подвале списка."
        >
          <div className="h-96 w-96">
            <DocumentsMultiSelect />
          </div>
        </StorySection>
        <StorySection
          title="С ограничением количества"
          description="После 5 выбранных остальные пункты становятся недоступными."
        >
          <div className="h-96 w-96">
            <DocumentsMultiSelect max={5} />
          </div>
        </StorySection>
        <StorySection
          title="Дерево"
          description="Родительский чекбокс каскадом переключает дочерние и показывает промежуточное состояние."
        >
          <div className="h-96 w-96">
            <TreeMultiSelect />
          </div>
        </StorySection>
      </StoryShowcase>
    </div>
  ),
}
