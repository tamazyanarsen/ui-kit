import { useMemo, useState } from "react"

import {
  Autocomplete,
  AutocompleteField,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteCollection,
  AutocompleteItem,
  AutocompleteStatus,
} from "@/components/ui/autocomplete"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

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

function OrganizationSearch() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(null)

  // Stands in for a server-side search — real usage would debounce this
  // and call an API, then hand the response straight to `items`.
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

function AutocompleteDemo() {
  return (
    <AccordionItem value="autocomplete">
      <AccordionTrigger>Autocomplete — поиск организации по ИНН</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Введите "123" — как в референсе</RowLabel>
          <div className="max-w-sm">
            <OrganizationSearch />
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Своей Figma-спеки нет — собран из присланного референса (поиск
          организации по ИНН). Поле само является триггером (без отдельной
          кнопки), список появляется под ним по мере ввода. В отличие от
          Combobox — одиночный выбор, без чекбоксов; фильтрация — на стороне
          вызывающего кода (внутренняя фильтрация Base UI отключена), как и
          должно быть при поиске через API.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { AutocompleteDemo }
