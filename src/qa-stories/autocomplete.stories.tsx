// Истории для проверок в браузере (npm run qa), в каталог Storybook НЕ входят: подключаются только при STORYBOOK_QA=1
// (см. .storybook/main.ts). Autocomplete по дизайн-чеку №7 в каталоге не показывается — у него нет своего мастера.
import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  StorySection,
  StoryShowcase,
  optionsArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { ORGANIZATIONS, searchOrganizations, type Organization } from "@/stories/autocomplete-fixtures"
import { type Viewport } from "@/lib/viewport"

import { Autocomplete } from "@/components/ui/autocomplete/root"
import { AutocompleteField } from "@/components/ui/autocomplete/field"
import {
  AutocompleteContent,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/ui/autocomplete/content"
import { AutocompleteItem } from "@/components/ui/autocomplete/item"

/* Autocomplete в макете отдельного мастера не имеет (дизайн-чек №7: это
   Input + Dropdown), поэтому имён свойств Figma нет — контролы названы по
   пропсам компонента, а форма Desktop/Mobile и псевдосостояния — по общей
   схеме Playground других компонентов. */

interface DemoAutocompleteProps {
  size?: "sm" | "lg"
  label?: string
  placeholder?: string
  comment?: string
  error?: string
  loading?: boolean
  clearable?: boolean
  disabled?: boolean
  readOnly?: boolean
  /** Открытый список: управляемый, но закрывается мышью и клавишей, как обычный. */
  open?: boolean
  /** Начальный текст поля (у Matrix — уже введённый запрос). */
  defaultQuery?: string
  /** `server` — фильтрует сама витрина (filter=null, как при поиске по API); `local` — фильтр Base UI. */
  filterMode?: "server" | "local"
  /** Подзаголовок «ИНН … КПП …» у строк. */
  showSubtitle?: boolean
  /** Подсветка введённого текста в заголовке и подзаголовке (проп `match` у AutocompleteItem). */
  highlight?: boolean
  emptyText?: string
  /** Подсказка при пустом запросе в режиме server (Base UI без items показал бы «ничего не найдено» на пустое поле). */
  hintText?: string
  /** Строка-статус над списком («Найдено: N»). */
  showStatus?: boolean
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
}

function DemoAutocomplete({
  size,
  label = "Организация",
  placeholder,
  comment,
  error,
  loading,
  clearable,
  disabled,
  readOnly,
  open,
  defaultQuery = "",
  filterMode = "server",
  showSubtitle = true,
  highlight = true,
  emptyText = "Ничего не найдено",
  hintText = "Начните вводить название или ИНН",
  showStatus = false,
  side,
  align,
  sideOffset,
  alignOffset,
}: DemoAutocompleteProps) {
  const [query, setQuery] = React.useState(defaultQuery)
  const [value, setValue] = React.useState<Organization | null>(
    () => ORGANIZATIONS.find((o) => o.label === defaultQuery) ?? null
  )
  // Контрол Open живой: `defaultOpen` читается только при монтировании, поэтому
  // состояние держим у себя и сверяем с пропсом при каждом изменении.
  const [isOpen, setIsOpen] = React.useState(Boolean(open))
  const [lastOpen, setLastOpen] = React.useState(open)
  if (open !== lastOpen) {
    setLastOpen(open)
    setIsOpen(Boolean(open))
  }

  const local = filterMode === "local"
  const items = local ? ORGANIZATIONS : searchOrganizations(query)
  const hint = !local && !query.trim()
  const filterProps = local
    ? { filter: (o: Organization, q: string) => o.label.toLowerCase().includes(q.trim().toLowerCase()) }
    : {}

  return (
    <Autocomplete<Organization>
      items={items}
      itemToStringLabel={(o) => o.label}
      inputValue={query}
      onInputValueChange={setQuery}
      value={value}
      onValueChange={setValue}
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={disabled}
      readOnly={readOnly}
      {...filterProps}
    >
      <AutocompleteField
        size={size}
        label={label}
        placeholder={placeholder}
        comment={comment}
        error={error}
        loading={loading}
        clearable={clearable}
      />
      <AutocompleteContent side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
        {hint && <AutocompleteStatus>{hintText}</AutocompleteStatus>}
        {showStatus && !hint && <AutocompleteStatus>{`Найдено: ${items.length}`}</AutocompleteStatus>}
        {!hint && <AutocompleteEmpty>{emptyText}</AutocompleteEmpty>}
        <AutocompleteList>
          <AutocompleteCollection>
            {(org: Organization) => (
              <AutocompleteItem
                key={org.value}
                value={org}
                subtitle={showSubtitle ? org.subtitle : undefined}
                match={highlight ? query : undefined}
              >
                {org.label}
              </AutocompleteItem>
            )}
          </AutocompleteCollection>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}

type PlaygroundArgs = DemoAutocompleteProps & {
  state?: PlaygroundState
  viewport?: Viewport
}

const meta = {
  title: "QA/Autocomplete",
  component: DemoAutocomplete,
  parameters: { layout: "padded" },
  // Демо-обёртка объявлена в этом файле, docgen её пропсы не видит — каждый контрол явный.
  argTypes: {
    viewport: optionsArgType<Viewport>("Viewport (Desktop / Mobile)", { auto: "Auto", desktop: "Desktop", mobile: "Mobile" }, "inline-radio"),
    size: optionsArgType("Size (L / S)", { lg: "L", sm: "S" }, "inline-radio"),
    // Hover/Focus — псевдосостояния аддона, Disabled и Loading — настоящие пропы.
    state: stateArgTypeOf(["default", "hover", "focus", "loading", "disabled"]),
    // Значения оси State — отдельных контролов у них нет.
    loading: { table: { disable: true } },
    disabled: { table: { disable: true } },
    filterMode: optionsArgType("Фильтр", { server: "Server (filter=null)", local: "Local (Base UI)" }, "inline-radio"),
    showSubtitle: toggleArgType("Show Subtitle"),
    highlight: toggleArgType("Highlight match"),
    showStatus: toggleArgType("Show Status"),
    clearable: toggleArgType("Clearable"),
    readOnly: toggleArgType("Read only"),
    open: toggleArgType("Open"),
    label: { control: "text", table: { category: "Контент" } },
    placeholder: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    error: { control: "text", table: { category: "Контент" } },
    emptyText: { control: "text", table: { category: "Контент" } },
    hintText: { control: "text", table: { category: "Контент" } },
    defaultQuery: { control: "text", table: { category: "Контент" } },
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"], table: { category: "Список" } },
    align: { control: "inline-radio", options: ["start", "center", "end"], table: { category: "Список" } },
    sideOffset: { control: "number", table: { category: "Список" } },
    alignOffset: { control: "number", table: { category: "Список" } },
  },
  args: {
    viewport: "desktop" as Viewport,
    size: "lg",
    state: "default" as PlaygroundState,
    filterMode: "server",
    showSubtitle: true,
    highlight: true,
    showStatus: false,
    clearable: true,
    readOnly: false,
    open: false,
    label: "Организация",
    comment: "",
    error: "",
    emptyText: "Ничего не найдено",
    hintText: "Начните вводить название или ИНН",
    defaultQuery: "",
    side: "bottom",
    align: "start",
    sideOffset: 8,
    alignOffset: 0,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, comment, error, ...args }) => (
    <PseudoBox state={state} viewport={viewport} className="w-96 max-w-full">
      <DemoAutocomplete
        {...args}
        // Пустая строка в контроле = «нет подписи/ошибки»: иначе у поля
        // всегда рисовалась бы пустая строка-подпись.
        comment={comment || undefined}
        error={error || undefined}
        loading={state === "loading"}
        disabled={state === "disabled"}
      />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<DemoAutocompleteProps>
      stretch
      responsive
      cellClassName="min-w-72"
      columns={[
        { label: "L (default)", props: { size: "lg" } },
        { label: "S", props: { size: "sm" } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Focus", props: {}, pseudo: "focus-within" },
        { label: "Filled", props: { defaultQuery: "ООО «Ромашка»" } },
        { label: "Comment", props: { comment: "Comment" } },
        { label: "Error", props: { error: "Text about error here" } },
        { label: "Loading", props: { loading: true, defaultQuery: "Ром" } },
        { label: "Read only", props: { readOnly: true, defaultQuery: "ООО «Ромашка»" } },
        { label: "Disabled", props: { disabled: true, defaultQuery: "ООО «Ромашка»" } },
      ]}
      render={(props) => <DemoAutocomplete {...props} />}
    />
  ),
}

/* Открытый список — всплывающее окно в портале, в матрицу ячейкой не
   помещается: каждая ячейка накрывала бы соседнюю. Поэтому — живые примеры. */
export const Opened: Story = {
  name: "Раскрытый список",
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <StoryShowcase className="bg-transparent p-0">
      <StorySection title="Подсветка совпадения" description="Запрос «ром» отмечен в заголовке и в подзаголовке.">
        <div className="h-96 w-96 max-w-full">
          <DemoAutocomplete open defaultQuery="ром" />
        </div>
      </StorySection>
      <StorySection title="Ничего не найдено" description="Запрос без результатов: вместо списка — текст Empty.">
        <div className="h-40 w-96 max-w-full">
          <DemoAutocomplete open defaultQuery="яяяя" />
        </div>
      </StorySection>
      <StorySection title="Статус над списком" description="AutocompleteStatus: сводка результата поиска.">
        <div className="h-96 w-96 max-w-full">
          <DemoAutocomplete open showStatus defaultQuery="ооо" />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
