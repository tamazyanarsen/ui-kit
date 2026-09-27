import { useEffect, useRef, useState } from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxFooter,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxSearchInput,
  ComboboxSectionLabel,
  ComboboxStatus,
  ComboboxTrigger,
  useComboboxSelection,
} from "@/components/ui/combobox"

// Поиск с подгрузкой: Рис. 1-6 спецификации — подсказка пустого
// состояния, порог в три символа, загрузка, пустой результат, повтор
// запроса и закреплённая секция «Выбраны».

interface Company {
  inn: string
  name: string
}

const COMPANIES: Company[] = [
  { inn: "7425678993", name: "ООО «Спецмастер»" },
  { inn: "7425671122", name: "ООО «Спецмастер Плюс»" },
  { inn: "7425609981", name: "ООО «Спецмонтаж»" },
  { inn: "5029384756", name: "ООО «Стройтех»" },
  { inn: "6312345678", name: "ИП Иванов И.И." },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Имитация бэкенда: порог «не меньше трёх символов» проверяется в
// вызывающем коде. Запрос «error» всегда завершается ошибкой — чтобы
// прогонять правило «повторить с тем же параметром, до 5 попыток» из макета
// без настоящей нестабильной сети.
async function searchCompanies(
  query: string,
  signal: AbortSignal
): Promise<Company[]> {
  await delay(450)
  if (signal.aborted) throw new DOMException("aborted", "AbortError")
  if (query === "error") throw new Error("network")
  const q = query.toLowerCase()
  return COMPANIES.filter(
    (c) => c.inn.includes(query) || c.name.toLowerCase().includes(q)
  )
}

interface CompanySection {
  key: string
  label?: string
  items: Company[]
}

// Выпадающий список с поиском и множественным выбором: рис. 1–6 из макета
// — пустая подсказка, порог в 3 символа, загрузка, отсутствие результатов,
// повтор после ошибки (максимум 5 попыток) и закреплённый раздел «Выбраны»,
// который снова появляется при повторном открытии с уже сделанным выбором.
function CompanySearchDropdown() {
  const sel = useComboboxSelection<Company>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Company[]>([])
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)
  const retryTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    const trimmed = query.trim()
    const controller = new AbortController()
    window.clearTimeout(retryTimeout.current)
    setAttempt(0)
    setFailed(false)

    if (trimmed.length < 3) {
      setResults([])
      setLoading(false)
      return () => controller.abort()
    }

    setLoading(true)
    let tries = 0
    const run = () => {
      searchCompanies(trimmed, controller.signal)
        .then((res) => {
          if (controller.signal.aborted) return
          setResults(res)
          setLoading(false)
        })
        .catch(() => {
          if (controller.signal.aborted) return
          tries += 1
          setAttempt(tries)
          if (tries >= 5) {
            setLoading(false)
            setFailed(true)
            return
          }
          retryTimeout.current = window.setTimeout(run, 400)
        })
    }
    run()

    return () => {
      controller.abort()
      window.clearTimeout(retryTimeout.current)
    }
  }, [query])

  const trimmed = query.trim()
  const selectedCompanies = sel.draft
  const resultCompanies = results.filter((c) => !sel.draft.includes(c))

  const sections: CompanySection[] = [
    ...(selectedCompanies.length > 0
      ? [{ key: "selected", label: "Выбраны", items: selectedCompanies }]
      : []),
    { key: "results", items: resultCompanies },
  ]

  // Порядок приоритетов: неудавшийся запрос побеждает всегда, затем
  // загрузка подавляет любое сообщение, затем случаи «слишком коротко для
  // поиска» и «ещё ничего не набрано, но кое-что уже выбрано» остаются
  // молчаливыми, и только после всего этого включаются собственно подсказки
  // пустого состояния.
  function getStatusMessage(): string | null {
    if (failed) {
      return `Не удалось загрузить результаты (попытка ${attempt}/5). Повторите запрос позже.`
    }
    if (loading) return null
    if (trimmed.length > 0 && trimmed.length < 3) return null
    if (trimmed.length === 0 && selectedCompanies.length > 0) return null
    if (trimmed.length === 0) return "Начните вводить параметры поиска"
    if (results.length === 0) {
      return "Поиск не дал результатов. Попробуйте ввести другое значение"
    }
    return null
  }
  const status = getStatusMessage()

  return (
    <Combobox
      open={sel.open}
      onOpenChange={(next) => sel.setOpen(next)}
      value={sel.draft}
      onValueChange={(next) => sel.setDraft(next)}
      inputValue={query}
      onInputValueChange={(next) => setQuery(next)}
      items={sections}
      itemToStringLabel={(c: Company) => c.name}
      filter={null}
    >
      <ComboboxTrigger
        placeholder={sel.committed.length === 0}
        clearable={sel.committed.length > 0}
        onClear={() => sel.setCommitted([])}
      >
        {sel.committed.length > 0
          ? `Выбрано: ${sel.committed.length}`
          : "Search"}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxSearchInput placeholder="Search" loading={loading} />
        <ComboboxList>
          {(section: CompanySection) => (
            <ComboboxGroup key={section.key} items={section.items}>
              {section.label && (
                <ComboboxSectionLabel>{section.label}</ComboboxSectionLabel>
              )}
              <ComboboxCollection>
                {(company: Company) => (
                  <ComboboxItem
                    key={company.inn}
                    value={company}
                    description={`ИНН ${company.inn}`}
                  >
                    {company.name}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
        <ComboboxStatus>{status}</ComboboxStatus>
        <ComboboxFooter
          applyLabel="Применить"
          onReset={sel.reset}
          onApply={sel.apply}
          resetDisabled={!sel.canReset}
          applyDisabled={!sel.canApply}
        />
      </ComboboxContent>
    </Combobox>
  )
}

export { CompanySearchDropdown }
