import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix, StorySection, StoryShowcase } from "@/stories/matrix"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"
import {
  AutocompleteContent,
  AutocompleteList,
  AutocompleteCollection,
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

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return ORGS.filter(
      (org) => org.name.toLowerCase().includes(q) || org.inn.includes(q)
    ).map((org) => org.inn)
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
          {query.trim() === "" ? "Начните вводить ИНН или название" : undefined}
        </AutocompleteStatus>
        <AutocompleteList>
          <AutocompleteCollection>
            {(inn: string) => {
              const org = ORGS.find((o) => o.inn === inn)!
              return (
                <AutocompleteItem
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

const meta = {
  title: "Interaction/Autocomplete",
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
  },
  args: {
    size: "lg",
    label: "ИНН или название организации",
    disabled: false,
    loading: false,
    clearable: true,
  },
} satisfies Meta<OrganizationSearchProps>

export default meta
type Story = StoryObj<OrganizationSearchProps>

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
