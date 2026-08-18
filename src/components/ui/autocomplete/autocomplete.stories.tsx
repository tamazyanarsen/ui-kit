import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, StorySection, StoryShowcase, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"
import {
  AutocompleteContent,
  AutocompleteList,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteStatus,
} from "./content"
import { AutocompleteItem } from "./item"

interface Org {
  inn: string
  kpp: string
  name: string
}

const ORGS: Org[] = [
  {
    inn: "7710140123",
    kpp: "771301001",
    name: 'АО "ОРГАНИЗАЦИЯ С ОЧЕНЬ ДЛИННЫМ НАИМЕНОВАНИЕМ В НЕСКОЛЬКО СТРОК"',
  },
  { inn: "1230140679", kpp: "771301001", name: 'ООО "Веселая компания"' },
  { inn: "1230140680", kpp: "771301001", name: 'ООО "Ромашка"' },
  { inn: "1230140681", kpp: "771301001", name: 'ООО "Яблочко"' },
  { inn: "1230140682", kpp: "771301001", name: 'ПАО "Дебитор"' },
]

interface OrganizationSearchProps {
  size?: "sm" | "lg"
  label?: string
  comment?: string
  error?: string
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
}

function OrganizationSearch({
  size = "lg",
  label = "ИНН или название организации",
  comment,
  error,
  disabled,
  loading,
  clearable = true,
}: OrganizationSearchProps) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(null)

  // Rules from "Правило поведение поля ввода с ИНН" (Input canvas, node
  // 70240:21241): the list only appears from the third character ("При вводе
  // третьего символа в поле ввода, отображается список"), and it is sorted by
  // company name А→Я ("Сортировка в выпадающем списке идет по названию
  // компании, в алфавитном порядке от А до Я"). Both live here rather than in
  // the component because Autocomplete is deliberately server-driven — it
  // renders whatever `items` it is handed.
  const MIN_CHARS = 3
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < MIN_CHARS) return []
    return ORGS.filter(
      (org) => org.name.toLowerCase().includes(q) || org.inn.includes(q)
    )
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
      .map((org) => org.inn)
  }, [query])

  return (
    <Autocomplete<string>
      inputValue={query}
      onInputValueChange={setQuery}
      items={results}
      value={selected}
      onValueChange={setSelected}
      autoHighlight
      disabled={disabled}
    >
      <AutocompleteField
        size={size}
        label={label}
        comment={comment}
        error={error}
        loading={loading}
        clearable={clearable}
        disabled={disabled}
      />
      <AutocompleteContent>
        <AutocompleteStatus>
          {query.trim().length < MIN_CHARS
            ? "Начните вводить ИНН или название"
            : undefined}
        </AutocompleteStatus>
        {/* "В случает есть значения в списке нет, отображается сообщение
            «Организация не найдена — введите ИНН вручную»" — the wording is
            fixed by the spec. */}
        {query.trim().length >= MIN_CHARS && results.length === 0 && (
          <AutocompleteEmpty>
            Организация не найдена — введите ИНН вручную
          </AutocompleteEmpty>
        )}
        <AutocompleteList>
          <AutocompleteCollection>
            {(inn: string) => {
              const org = ORGS.find((o) => o.inn === inn)!
              return (
                <AutocompleteItem match={query}
                  key={inn}
                  value={inn}
                  subtitle={`ИНН ${org.inn} КПП ${org.kpp}`}
                >
                  {org.name}
                </AutocompleteItem>
              )
            }}
          </AutocompleteCollection>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}

type PlaygroundArgs = OrganizationSearchProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/Autocomplete",
  component: OrganizationSearch,
  parameters: { layout: "padded" },
  // `OrganizationSearch` is declared locally in this file rather than
  // imported from a component module, so react-docgen-typescript doesn't
  // extract its props — declare every control explicitly.
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "sm"] },
    label: { control: "text" },
    comment: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    clearable: { control: "boolean" },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: {
    size: "lg",
    label: "ИНН или название организации",
    disabled: false,
    loading: false,
    clearable: true,
    viewport: "auto" as Viewport,
  },
  // Дизайн-чек №3 №19: контрол `viewport` из панели истории форсирует
  // десктопную/мобильную форму, не трогая размер вьюпорта. Обёртка общая
  // для всех историй файла — в матрицах она не мешает: там форму задаёт
  // сама матрица (`responsive`), а этот скоуп остаётся в «auto».
  decorators: [
    (Story, context) => (
      <ViewportScope viewport={(context.args as { viewport?: Viewport }).viewport}>
        <Story />
      </ViewportScope>
    ),
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: (args) => (
    <div className="w-96">
      <OrganizationSearch {...args} />
    </div>
  ),
}

/* The field reuses Select's own trigger tokens, so its closed states match
   Select cell for cell; the popup is portalled and only appears while typing,
   so it gets a live example rather than a matrix cell. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<OrganizationSearchProps>
        responsive
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
          { label: "Loading", props: { loading: true } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <OrganizationSearch {...props} />}
      />

      <StoryShowcase className="bg-transparent p-0">
        <StorySection
          title="Поиск организации"
          description="Введите «123» или «ООО», чтобы увидеть выпадающий список."
        >
          <div className="h-80 w-96">
            <OrganizationSearch />
          </div>
        </StorySection>
      </StoryShowcase>
    </div>
  ),
}
