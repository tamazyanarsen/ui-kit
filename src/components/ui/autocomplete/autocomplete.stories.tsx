import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Autocomplete } from "./root"
import { AutocompleteField } from "./field"
import { AutocompleteContent, AutocompleteList, AutocompleteCollection, AutocompleteStatus } from "./content"
import { AutocompleteItem } from "./item"

interface Org {
  inn: string
  kpp: string
  name: string
}

const ORGS: Org[] = [
  { inn: "7710140123", kpp: "771301001", name: 'АО "ОРГАНИЗАЦИЯ С ОЧЕНЬ ДЛИННЫМ НАИМЕНОВАНИЕМ В НЕСКОЛЬКО СТРОК"' },
  { inn: "1230140679", kpp: "771301001", name: 'ООО "Веселая компания"' },
  { inn: "1230140680", kpp: "771301001", name: 'ООО "Ромашка"' },
  { inn: "1230140681", kpp: "771301001", name: 'ООО "Яблочко"' },
  { inn: "1230140682", kpp: "771301001", name: 'ПАО "Дебитор"' },
]

function OrganizationSearch() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return ORGS.filter((org) => org.name.toLowerCase().includes(q) || org.inn.includes(q)).map(
      (org) => org.inn
    )
  }, [query])

  return (
    <div className="w-96">
      <Autocomplete<string>
        inputValue={query}
        onInputValueChange={setQuery}
        items={results}
        value={selected}
        onValueChange={setSelected}
        autoHighlight
      >
        <AutocompleteField label="ИНН или название организации" />
        <AutocompleteContent>
          <AutocompleteStatus>
            {query.trim() === "" ? "Начните вводить ИНН или название" : undefined}
          </AutocompleteStatus>
          <AutocompleteList>
            <AutocompleteCollection>
              {(inn: string) => {
                const org = ORGS.find((o) => o.inn === inn)!
                return (
                  <AutocompleteItem key={inn} value={inn} subtitle={`ИНН ${org.inn} КПП ${org.kpp}`}>
                    {org.name}
                  </AutocompleteItem>
                )
              }}
            </AutocompleteCollection>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

const meta = {
  title: "Interaction/Autocomplete",
  component: OrganizationSearch,
  parameters: { layout: "padded" },
} satisfies Meta<typeof OrganizationSearch>

export default meta
type Story = StoryObj<typeof meta>

export const OrganizationLookup: Story = {
  name: "Поиск организации по ИНН (введите «123»)",
}
