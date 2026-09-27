import * as React from "react"

import { cn } from "@/lib/utils"
import { Scrollbar } from "@/components/ui/scrollbar"

import { CalendarFooter } from "./footer"
import { SheetHeader, SheetNav } from "./mobile-chrome"
import {
  SheetDecadeSections,
  SheetMonthSections,
  SheetYearSections,
} from "./mobile-sections"
import { HeaderLabel, NavHeader } from "./nav-header"
import { YearGrid } from "./picker-grid"
import type { CalendarMode, CalendarSingleMonth } from "./types"
import { useInfiniteCount } from "./use-infinite-count"

interface CalendarMobileProps {
  mode: CalendarMode
  title: string
  onClose?: () => void
  className?: string
  footer: boolean
  showSecondaryButton?: boolean
  onReset?: () => void
  onApply?: () => void

  today: Date
  focus: CalendarSingleMonth
  setFocus: React.Dispatch<React.SetStateAction<CalendarSingleMonth>>
  decadeEnd: number
  setDecadeEnd: React.Dispatch<React.SetStateAction<number>>

  value: Date | null
  normStart: Date | null
  normEnd: Date | null
  monthValue?: { year: number; month: number } | null
  onMonthChange?: (value: { year: number; month: number }) => void
  yearValue?: number | null
  onYearChange?: (year: number) => void
  onSelectDay: (date: Date) => void
  disabledDate?: (date: Date) => boolean
}

function CalendarMobile({
  mode,
  title,
  onClose,
  className,
  footer,
  showSecondaryButton = true,
  onReset,
  onApply,
  today,
  focus,
  setFocus,
  decadeEnd,
  setDecadeEnd,
  value,
  normStart,
  normEnd,
  monthValue,
  onMonthChange,
  yearValue,
  onYearChange,
  onSelectDay,
  disabledDate,
}: CalendarMobileProps) {
  // Бесконечная прокрутка вперёд плюс переход к выбору года по нажатию на
  // подпись в навигации — вместо односторонней кнопки «назад на 12»,
  // которая могла оставить пользователя без пути обратно к сегодняшнему
  // дню. Только для шторки: поповер вместо этого листает страницами.
  const sheetScrollRef = React.useRef<HTMLDivElement>(null)
  const monthsInfinite = useInfiniteCount(sheetScrollRef, 6, 6)
  const yearsInfinite = useInfiniteCount(sheetScrollRef, 3, 3)
  const decadesInfinite = useInfiniteCount(sheetScrollRef, 2, 2)
  const [jumpOpen, setJumpOpen] = React.useState(false)
  const [jumpDecadeEnd, setJumpDecadeEnd] = React.useState(decadeEnd)

  function openJumpPicker() {
    setJumpDecadeEnd(focus.year)
    setJumpOpen(true)
  }

  function handleJumpToYear(year: number) {
    setFocus((current) => ({ ...current, year }))
    setJumpOpen(false)
    monthsInfinite.reset()
    yearsInfinite.reset()
    sheetScrollRef.current?.scrollTo({ top: 0 })
  }

  function shiftDecade(step: number) {
    setDecadeEnd((year) => year + step)
    decadesInfinite.reset()
  }

  // И навигация в шапке, и прокручиваемое тело под ней переключаются между
  // тремя совершенно разными состояниями (выбор года для перехода, режим
  // года, режим месяца или дня), поэтому здесь ранние возвраты, а не
  // цепочка вложенных тернарных операторов: по состоянию на ветку.
  function renderHeaderNav() {
    if (jumpOpen) {
      return (
        <NavHeader
          onPrev={() => setJumpDecadeEnd((year) => year - 12)}
          onNext={() => setJumpDecadeEnd((year) => year + 12)}
          variant="picker"
        >
          <HeaderLabel>
            {jumpDecadeEnd - 11} — {jumpDecadeEnd}
          </HeaderLabel>
        </NavHeader>
      )
    }
    if (mode === "year") {
      return (
        <NavHeader
          onPrev={() => shiftDecade(-12)}
          onNext={() => shiftDecade(12)}
          variant="picker"
        >
          <HeaderLabel>
            {decadeEnd - 11} — {decadeEnd}
          </HeaderLabel>
        </NavHeader>
      )
    }
    return (
      <SheetNav
        label={
          mode === "month"
            ? `${focus.year - 11} — ${focus.year}`
            : String(focus.year)
        }
        onBack={openJumpPicker}
      />
    )
  }

  function renderSheetBody() {
    if (jumpOpen) {
      return (
        <YearGrid
          decadeEnd={jumpDecadeEnd}
          selectedYear={focus.year}
          currentYear={today.getFullYear()}
          onSelectYear={handleJumpToYear}
          size="mobile"
        />
      )
    }
    if (mode === "month") {
      return (
        <>
          <SheetYearSections
            anchorYear={focus.year}
            count={yearsInfinite.count}
            today={today}
            monthValue={monthValue}
            onSelectMonth={(year, month) => onMonthChange?.({ year, month })}
          />
          <div ref={yearsInfinite.sentinelRef} className="h-px" />
        </>
      )
    }
    if (mode === "year") {
      return (
        <>
          <SheetDecadeSections
            anchorDecadeEnd={decadeEnd}
            count={decadesInfinite.count}
            today={today}
            yearValue={yearValue ?? null}
            onSelectYear={(year) => onYearChange?.(year)}
          />
          <div ref={decadesInfinite.sentinelRef} className="h-px" />
        </>
      )
    }
    return (
      <>
        <SheetMonthSections
          mode={mode}
          anchor={focus}
          count={monthsInfinite.count}
          today={today}
          value={value}
          normStart={normStart}
          normEnd={normEnd}
          onSelectDay={onSelectDay}
          disabledDate={disabledDate}
        />
        <div ref={monthsInfinite.sentinelRef} className="h-px" />
      </>
    )
  }

  return (
    // По макету: «Календарь открывается в Bottom Sheet на весь экран, без
    // скруглений». Этот компонент рисует только собственное содержимое (см.
    // комментарий к CalendarProps.layout), а страница размещает его внутри
    // своего настоящего примитива нижней шторки или модального окна.
    // Поэтому здесь это означает лишь отсутствие радиуса и отсутствие
    // собственного ограничения максимальной ширины.
    <div
      data-slot="calendar"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-white shadow-universal",
        className
      )}
    >
      <SheetHeader title={title} onClose={onClose} />
      {renderHeaderNav()}
      {/* Настоящий мобильный макет складывает повторяющиеся секции
          месяцев с зазором 24px (обёртка «Calendar», gap-[24px]); здесь это
          применено единообразно к спискам месяцев, лет и десятилетий. */}
      <Scrollbar ref={sheetScrollRef} className="flex flex-1 flex-col gap-6">
        {renderSheetBody()}
      </Scrollbar>
      {footer && (
        <CalendarFooter
          compact
          showSecondary={showSecondaryButton}
          onReset={onReset}
          onApply={onApply}
        />
      )}
    </div>
  )
}

export { CalendarMobile }
