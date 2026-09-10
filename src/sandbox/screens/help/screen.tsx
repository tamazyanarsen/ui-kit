import * as React from "react"

import { Download, PlayNew } from "@/icons"
import { Button } from "@/components/ui/button"
import { EmptySearchResults } from "@/components/ui/empty-search"
import { Tabs } from "@/components/ui/tabs"
import { TitleRegistry } from "@/components/ui/title"

import { SandboxBlock, SandboxColumns, SandboxPage } from "../../shell"

import { HELP_SECTIONS } from "./content"
import { Questions } from "./questions"
import { searchSections } from "./search"
import { SectionsPanel } from "./sections-panel"
import { flattenSections, isGroup } from "./types"

// Страница «Помощь» — канвас `ПЕСОЧНИЦА_ПОМОЩЬ` 70400:25863: сам экран
// (70400:30488) плюс две секции с описанием механик, «Как работает поиск»
// (70400:31096) и «Как работает скролл» (70400:31943).
//
// Раскладка: заголовок `ELK / title_table` (у этого экрана — без кнопки
// «Справка» и без подписи, только заголовок и чёрная кнопка выгрузки), табы,
// и ряд из двух колонок 5 + 7 (736 и 1040 при полосе 1800). Обе колонки —
// белые карточки с полем 32; левая закреплена и живёт по высоте экрана, см.
// `SectionsPanel`.
//
// ⚠️ Зазоры между заголовком, табами и контентом здесь 32, а не 24, как у
// конструктора песочных экранов, — отсюда `sectionGap` у `SandboxPage`.

/**
 * Пауза, за которую «идёт поиск». Шаг 2 секции поиска: «Пока осуществляется
 * поиск — в строке появляется лоадер». Число эталон не задаёт; взято
 * заметное на глаз, чтобы состояние с лоадером вообще можно было увидеть.
 */
const SEARCH_DELAY = 600

const TABS = [
  { value: "sections", label: "Разделы" },
  { value: "tours", label: "Интерактивные туры" },
]

function HelpScreen() {
  const [tab, setTab] = React.useState("sections")
  const [query, setQuery] = React.useState("")
  // Запрос, по которому УЖЕ построена выдача. Пока он отстаёт от строки —
  // идёт поиск.
  const [applied, setApplied] = React.useState("")
  const [activeSection, setActiveSection] = React.useState("general")
  const [expanded, setExpanded] = React.useState<string[]>(["training"])

  const trimmed = query.trim()
  const searching = trimmed !== applied

  React.useEffect(() => {
    if (!searching) return
    const id = window.setTimeout(() => setApplied(trimmed), SEARCH_DELAY)
    return () => window.clearTimeout(id)
  }, [searching, trimmed])

  const result = React.useMemo(
    () => searchSections(HELP_SECTIONS, applied),
    [applied]
  )

  // Шаг 3: «Выбранным становится первый по списку раздел». Только по
  // завершении поиска — пока он идёт, список ещё полный и трогать выбор
  // нечем.
  React.useEffect(() => {
    if (!applied) return
    const first = flattenSections(result.nodes)[0]
    if (first) setActiveSection(first.value)
  }, [applied, result])

  const sections = React.useMemo(() => flattenSections(HELP_SECTIONS), [])
  const section =
    sections.find((item) => item.value === activeSection) ?? sections[0]!
  const topics = result.topics[section.value] ?? section.topics

  // Группы в выдаче раскрыты принудительно: иначе найденный вложенный раздел
  // прятался бы за свёрнутым заголовком группы (правило 3 Шага 3).
  const openGroups = applied
    ? Array.from(
        new Set([
          ...expanded,
          ...result.nodes.filter(isGroup).map((n) => n.value),
        ])
      )
    : expanded

  function toggleGroup(value: string) {
    setExpanded((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  return (
    <SandboxPage
      activeSection="help"
      sectionGap={32}
      title={
        <TitleRegistry
          title="Помощь"
          helpLabel={null}
          actions={
            <Button variant="secondary-black" size="sm" icon={Download}>
              Скачать руководство пользователя
            </Button>
          }
        />
      }
      additional={
        <Tabs
          items={TABS}
          showMore={false}
          value={tab}
          onValueChange={setTab}
        />
      }
    >
      {tab === "sections" ? (
        <SandboxColumns widths={[5, 7]}>
          <SectionsPanel
            nodes={applied ? result.nodes : HELP_SECTIONS}
            activeSection={section.value}
            onSectionChange={setActiveSection}
            counts={result.counts}
            expanded={openGroups}
            onToggleGroup={toggleGroup}
            query={query}
            onQueryChange={setQuery}
            searching={searching}
            matches={applied ? result.total : null}
          />
          <Questions section={section} topics={topics} />
        </SandboxColumns>
      ) : (
        // Кадра для второй вкладки в канвасе нет — но и убирать её нельзя,
        // она часть эталона. Ставим честную заглушку вместо мёртвого
        // переключателя.
        <SandboxBlock>
          <EmptySearchResults
            icon={<PlayNew size={24} aria-hidden="true" />}
            title="Интерактивные туры"
            description="Раздел не входит в макеты песочницы — здесь появятся пошаговые туры по личному кабинету."
          />
        </SandboxBlock>
      )}
    </SandboxPage>
  )
}

export { HelpScreen }
