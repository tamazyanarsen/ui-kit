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

// Simulated backend: min-3-chars gate happens in the caller. Query "error"
// always fails, to exercise the "retry with the same parameter, up to 5
// attempts" rule from the spec without needing a real flaky network.
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

// Search + multi-select dropdown: Рис. 1-6 from the spec — empty hint,
// 3-char gate, loading, no-results, error retry (5 attempts max), and the
// pinned "Выбраны" section that reappears when reopening with a selection.
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

  // Ordered precedence: a failed fetch always wins, then loading suppresses
  // any message, then the "too short to search" / "nothing typed yet, but
  // something's already picked" cases stay silent, and only after all of
  // that do the actual empty-state hints kick in.
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
