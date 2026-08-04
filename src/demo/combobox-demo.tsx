import { useEffect, useRef, useState } from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxFooter,
  ComboboxGroup,
  ComboboxGroupRow,
  ComboboxItem,
  ComboboxList,
  ComboboxSearchInput,
  ComboboxSectionLabel,
  ComboboxStatus,
  ComboboxTrigger,
  useComboboxSelection,
  type ComboboxCheckboxState,
} from "@/components/ui/combobox"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

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

interface DocItem {
  value: string
  label: string
}

const DOCUMENTS: DocItem[] = [
  { value: "doc-1", label: "Паспорт РФ" },
  { value: "doc-2", label: "СНИЛС" },
  { value: "doc-3", label: "ИНН" },
  { value: "doc-4", label: "Договор аренды" },
  { value: "doc-5", label: "Выписка ЕГРЮЛ" },
]

// Document-count trigger ("Выбрано документов: N") with the two footer
// count formats: capped ("Выбрать: N/max") and uncapped ("Выбрать: N").
function DocumentsMultiSelect({ max }: { max?: number }) {
  const sel = useComboboxSelection<DocItem>([])
  const atMax = max !== undefined && sel.draft.length >= max

  return (
    <Combobox
      open={sel.open}
      onOpenChange={(next) => sel.setOpen(next)}
      value={sel.draft}
      onValueChange={(next) => sel.setDraft(next)}
      items={DOCUMENTS}
      itemToStringLabel={(d: DocItem) => d.label}
    >
      <ComboboxTrigger
        label="Название"
        placeholder={sel.committed.length === 0}
        clearable={sel.committed.length > 0}
        onClear={() => sel.setCommitted([])}
      >
        {sel.committed.length > 0
          ? `Выбрано документов: ${sel.committed.length}`
          : ""}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>
          <ComboboxCollection>
            {(doc: DocItem) => (
              <ComboboxItem
                key={doc.value}
                value={doc}
                disabled={atMax && !sel.draft.includes(doc)}
              >
                {doc.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
        <ComboboxFooter
          applyLabel={
            max !== undefined
              ? `Выбрать: ${sel.draft.length}/${max}`
              : `Выбрать: ${sel.draft.length}`
          }
          onReset={sel.reset}
          onApply={sel.apply}
          resetDisabled={!sel.canReset}
          applyDisabled={!sel.canApply}
        />
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxDemo() {
  return (
    <AccordionItem value="select-dropdown">
      <AccordionTrigger>
        Select — Dropdown (поиск / дерево / множественный выбор)
      </AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <RowLabel>Поиск + множественный выбор</RowLabel>
            <CompanySearchDropdown />
            <p className="text-p3-regular text-muted-foreground">
              Введите 3+ символа (например «742»). Значение «error» всегда
              завершается ошибкой — проверка авто-повтора (до 5 попыток).
            </p>
          </div>
          <div className="space-y-2">
            <RowLabel>Дерево (checkbox-каскад)</RowLabel>
            <TreeMultiSelectDropdown />
            <p className="text-p3-regular text-muted-foreground">
              Родительский чекбокс не является отдельным значением —
              отражает состояние дочерних (indeterminate/checked) и
              переключает их все разом.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <RowLabel>Триггер «Выбрано документов: N»</RowLabel>
              <DocumentsMultiSelect max={5} />
              <p className="text-p3-regular text-muted-foreground">
                Футер с ограничением: «Выбрать: N/5», остальные пункты
                блокируются по достижении лимита.
              </p>
            </div>
            <div className="space-y-2">
              <DocumentsMultiSelect />
              <p className="text-p3-regular text-muted-foreground">
                Без ограничения: «Выбрать: N».
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-p3-regular text-muted-foreground">
          Шаг 2 из 3: Dropdown-контейнер — поиск (со всеми состояниями Рис.
          1-6 из макета), список с чекбоксами, каскад родитель/потомок и
          футер Сбросить/Применить или Сбросить/Выбрать N(/max).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ComboboxDemo }
