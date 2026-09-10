import * as React from "react"

import { Search } from "@/icons"
import { cn } from "@/lib/utils"
import { Divider } from "@/components/ui/divider"
import { EmptySearchResults } from "@/components/ui/empty-search"
import { Input } from "@/components/ui/input"
import { Scrollbar } from "@/components/ui/scrollbar"

import { SandboxBlock } from "../../shell"

import { SectionList } from "./section-list"
import type { HelpNode } from "./types"

// Остров «Поиск + меню» (нода 70400:30494) — левая колонка страницы
// «Помощь»: заголовок, строка поиска и список разделов со своей прокруткой.
//
// Механика прокрутки описана секцией «Как работает скролл» (70400:31943)
// четырьмя кадрами:
//
//   1. «Остров с левым меню по высоте растягивается на весь экран — занимает
//      всё доступное место»;
//   2. «При скролле вниз вся страница начинает уходить наверх, затем меню
//      слева закрепляется и занимает по высоте всё доступное место. По общим
//      правилам ЕЛК — header страницы тоже уходит и остаётся только
//      горизонтальное меню»;
//   3. «Далее общим скроллом скроллится только раздел, а меню закреплено
//      слева. При этом, если оно длинное, то у него есть свой внутренний
//      скролл»;
//   4. «Внутри меню со списком разделов имеется свой независимый скролл, при
//      этом заголовок и поиск закреплены сверху — скроллится только сам
//      список».
//
// Всё это — один липкий блок, внутри которого прокручивается только список.
//
// ⚠️ Это ПОТОЛОК высоты, а не сама высота, и считается он не константой
// `100vh − занятый верх − 80`, а от собственного верха острова:
//
//   • кадр «Скролл-1»: остров начинается под табами (312) и тянется до 1040
//     — то есть до низа экрана минус 40;
//   • кадр «Скролл-2»: он уже закреплён, шапка схлопнулась, верх 104 —
//     и высота выросла до 936, снова до низа экрана минус 40;
//   • кадр «Поиск-3»: список после поиска короткий, и остров сжимается по
//     содержимому (492), а не растягивается.
//
// Отсюда `max-height` от измеренного верха: пока страница не прокручена,
// липкий отступ ещё не работает, и константа свесила бы низ острова за фолд.
// Обратной связи с высотой нет — у липкого узла верх и так меняется скачком
// (натуральный верх минус прокрутка → отступ закрепления).
const PANEL_BOTTOM_MARGIN = 40

function usePanelHeight() {
  const ref = React.useRef<HTMLElement>(null)
  const [height, setHeight] = React.useState<number>()

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    function measure() {
      const node = ref.current
      if (!node) return
      const top = node.getBoundingClientRect().top
      setHeight(Math.max(320, window.innerHeight - top - PANEL_BOTTOM_MARGIN))
    }

    measure()
    window.addEventListener("scroll", measure, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("scroll", measure)
      window.removeEventListener("resize", measure)
    }
  }, [])

  return { ref, height }
}

/** Линия у обрезанного края списка — `devider` 70400:30501 / 70400:32101. */
function EdgeDivider({ side }: { side: "top" | "bottom" }) {
  return (
    <Divider
      aria-hidden="true"
      // Линия в эталоне идёт во всю ширину карточки, наезжая на её поле 32,
      // — поэтому отрицательные поля, а не `inset-x-0`.
      className={cn(
        // `w-auto` — иначе `w-full` из самого `Divider` перебивает правую
        // границу и линия не доезжает до кромки карточки.
        "pointer-events-none absolute inset-x-[-32px] w-auto",
        side === "top" ? "top-0" : "bottom-0"
      )}
    />
  )
}

/** Какие края списка обрезаны — от этого зависят линии сверху и снизу. */
function useScrollEdges(deps: unknown[]) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ top: false, bottom: false })

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdges({
      top: el.scrollTop > 0,
      // Единица допуска: дробная высота строки даёт остаток вроде 0.5px, и
      // без неё нижняя линия не гасла в самом низу списка.
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
    })
  }, [])

  React.useLayoutEffect(measure, [measure, ...deps])

  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  return { ref, edges, measure }
}

interface SectionsPanelProps {
  nodes: HelpNode[]
  activeSection: string
  onSectionChange: (value: string) => void
  counts: Record<string, number>
  expanded: string[]
  onToggleGroup: (value: string) => void
  query: string
  onQueryChange: (value: string) => void
  /** Идёт поиск — в строке крутится лоадер (Шаг 2). */
  searching: boolean
  /** «Найдено совпадений: N». Показывается только по завершённому поиску. */
  matches: number | null
}

function SectionsPanel({
  nodes,
  activeSection,
  onSectionChange,
  counts,
  expanded,
  onToggleGroup,
  query,
  onQueryChange,
  searching,
  matches,
}: SectionsPanelProps) {
  const { ref, edges, measure } = useScrollEdges([nodes, expanded])
  const panel = usePanelHeight()

  return (
    <SandboxBlock
      ref={panel.ref}
      sticky
      className="gap-6"
      style={{ maxHeight: panel.height }}
      aria-label="Разделы помощи"
    >
      <h2 className="w-full text-h3 text-[var(--grey-1514)]">Разделы</h2>

      <Input
        size="lg"
        placeholder="Поиск"
        aria-label="Поиск по разделам помощи"
        iconLeft={<Search size={24} aria-hidden="true" className="size-6" />}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        loading={searching}
        clearable
        onClear={() => onQueryChange("")}
      />

      {matches != null && (
        <p className="w-full text-p2-medium text-[var(--grey-517)]">
          Найдено совпадений: {matches}
        </p>
      )}

      {/* Кадра «ничего не нашлось» в секции поиска нет, но состояние
          достижимо — иначе список просто становился бы пустой белой
          коробкой. Взят китовый набор пустого состояния, кнопка возвращает
          полный перечень разделов (Шаг 3: «если стереть поисковый запрос…»). */}
      {nodes.length === 0 ? (
        <EmptySearchResults
          icon={<Search size={24} aria-hidden="true" />}
          title="По вашему запросу ничего не найдено"
          description="Попробуйте изменить критерии поиска"
          buttonLabel="Сбросить поиск"
          onButtonClick={() => onQueryChange("")}
          className="flex-1"
        />
      ) : (
        <div className="relative flex min-h-0 w-full flex-1 flex-col">
          {edges.top && <EdgeDivider side="top" />}
          <Scrollbar
            ref={ref}
            inset="dropdown"
            onScroll={measure}
            // Полоса стоит не у края списка, а в поле карточки: в эталоне её
            // дорожка на 8px от правой кромки острова и на 20px правее самих
            // строк. Отрицательное поле выводит окно прокрутки на кромку
            // карточки, `inset="dropdown"` отступает от неё положенные 8, а
            // `pr-5` возвращает строкам их ширину.
            className="-mr-8 min-h-0 flex-1 pr-5"
          >
            <SectionList
              nodes={nodes}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              counts={counts}
              expanded={expanded}
              onToggleGroup={onToggleGroup}
            />
          </Scrollbar>
          {edges.bottom && <EdgeDivider side="bottom" />}
        </div>
      )}
    </SandboxBlock>
  )
}

export { SectionsPanel }
