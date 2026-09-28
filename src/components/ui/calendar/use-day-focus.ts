import * as React from "react"

import { isSameDay, isSameMonth } from "@/lib/calendar"
import type { CalendarSingleMonth } from "./types"

// Клавиатура сетки дней по образцу APG «Date Picker Dialog»: в порядке Tab
// ровно один день (roving tabindex), остальное — стрелками. Раньше каждый
// день был своей остановкой Tab, и чтобы выйти из календаря к «Применить»,
// требовалось 35 с лишним нажатий.
//
// Хук живёт у владельца ВСЕХ сеток сразу (у Range их две, у мобильного листа
// — лента месяцев): остановка Tab одна на весь календарь, и стрелка с
// последнего дня первого месяца переходит в первый день второго.
//
//   ←/→ — день, ↑/↓ — неделя, Home/End — начало и конец недели (ПН–ВС),
//   PageUp/PageDown — месяц, Shift+PageUp/PageDown — год.
// Выключенные дни пропускаются в сторону движения. Если цель за пределами
// показанных месяцев, окно сдвигается через `onShiftMonths`; без него (лента
// мобильного листа) фокус останавливается на краю.

const DAY = 24 * 60 * 60 * 1000
/** Сколько дней искать доступный, прежде чем сдаться (год с запасом). */
const SEARCH_LIMIT = 400

interface UseDayFocusOptions {
  months: CalendarSingleMonth[]
  /** Кандидаты на остановку Tab по порядку: выбранный день, начало диапазона… */
  preferred: (Date | null | undefined)[]
  today: Date
  isDisabled?: (date: Date) => boolean
  /** Сдвинуть показанные месяцы на `delta`. */
  onShiftMonths?: (delta: number) => void
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function shiftDays(date: Date, days: number) {
  // Через полдень: переход на летнее время не уводит дату на соседний день.
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12)
  const next = new Date(noon.getTime() + days * DAY)
  return new Date(next.getFullYear(), next.getMonth(), next.getDate())
}

function shiftMonthsClamped(date: Date, months: number) {
  const first = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  return new Date(first.getFullYear(), first.getMonth(), Math.min(date.getDate(), last))
}

function monthIndex(year: number, month: number) {
  return year * 12 + month
}

function targetFor(date: Date, event: React.KeyboardEvent): Date | null {
  const weekday = (date.getDay() + 6) % 7 // ПН = 0
  switch (event.key) {
    case "ArrowLeft":
      return shiftDays(date, -1)
    case "ArrowRight":
      return shiftDays(date, 1)
    case "ArrowUp":
      return shiftDays(date, -7)
    case "ArrowDown":
      return shiftDays(date, 7)
    case "Home":
      return shiftDays(date, -weekday)
    case "End":
      return shiftDays(date, 6 - weekday)
    case "PageUp":
      return shiftMonthsClamped(date, event.shiftKey ? -12 : -1)
    case "PageDown":
      return shiftMonthsClamped(date, event.shiftKey ? 12 : 1)
    default:
      return null
  }
}

function useDayFocus({
  months,
  preferred,
  today,
  isDisabled,
  onShiftMonths,
}: UseDayFocusOptions) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState<Date | null>(null)
  const pendingFocus = React.useRef<string | null>(null)

  // Выбор сменился снаружи (дату ввели в поле DatePicker, сбросили) — день,
  // на котором последним стоял фокус, больше не остановка: иначе ArrowDown
  // из поля возвращал бы фокус на старый день, а не на введённый. Если же
  // этот день сам вошёл в выбор (Enter на нём, конец диапазона), остановка
  // остаётся на нём — там, где стоит фокус.
  const preferredKey = preferred.map((date) => date?.getTime() ?? "").join("|")
  const [seenPreferred, setSeenPreferred] = React.useState(preferredKey)
  if (seenPreferred !== preferredKey) {
    setSeenPreferred(preferredKey)
    if (active && !preferred.some((date) => date && isSameDay(date, active))) {
      setActive(null)
    }
  }

  const visible = (date: Date) =>
    months.some((m) => isSameMonth(date, m.year, m.month))
  const enabled = (date: Date) => !isDisabled?.(date)

  let tabbable: Date | null = null
  for (const candidate of [active, ...preferred, today]) {
    if (candidate && visible(candidate) && enabled(candidate)) {
      tabbable = candidate
      break
    }
  }
  if (!tabbable) {
    outer: for (const m of months) {
      const days = new Date(m.year, m.month + 1, 0).getDate()
      for (let d = 1; d <= days; d++) {
        const date = new Date(m.year, m.month, d)
        if (enabled(date)) {
          tabbable = date
          break outer
        }
      }
    }
  }

  // ⚠️ Поповер Base UI (DatePicker), пока фокус снаружи, выключает всё
  // фокусируемое внутри: прежний `tabindex` уходит в `data-tabindex`, а
  // сам становится -1, и при возврате фокуса восстанавливается ИЗ этой
  // метки. Если остановка за это время переехала (ввели дату в поле,
  // пролистали месяц), метка у старого дня осталась бы «0», и после
  // возврата остановок Tab стало бы две. Поэтому метка сверяется с
  // остановкой после каждой отрисовки.
  React.useLayoutEffect(() => {
    const days = containerRef.current?.querySelectorAll<HTMLElement>(
      '[data-slot="calendar-day"][data-tabindex]'
    )
    days?.forEach((day) => {
      day.dataset.tabindex = day.hasAttribute("data-roving") ? "0" : "-1"
    })
  })

  // Фокус ставится после отрисовки: цель могла появиться только после сдвига
  // месяцев. Без зависимостей — эффект дешёвый и срабатывает лишь с меткой.
  React.useLayoutEffect(() => {
    const key = pendingFocus.current
    if (!key) return
    const button = containerRef.current?.querySelector<HTMLElement>(
      `[data-slot="calendar-day"][data-date="${key}"]`
    )
    if (button) {
      pendingFocus.current = null
      button.focus()
    }
  })

  function onDayKeyDown(date: Date, event: React.KeyboardEvent) {
    let target = targetFor(date, event)
    if (!target) return
    event.preventDefault()

    if (event.key === "Home" || event.key === "End") {
      // Home/End не выходят за пределы недели: выключенный край (выходные)
      // ищется обратно к исходному дню. Иначе End со среды при выключенных
      // выходных уводил на понедельник следующей недели.
      const back = event.key === "End" ? -1 : 1
      while (!enabled(target) && !isSameDay(target, date)) {
        target = shiftDays(target, back)
      }
    } else {
      // Выключенный день пропускается в сторону движения.
      const step = target.getTime() < date.getTime() ? -1 : 1
      for (let i = 0; target && !enabled(target); i++) {
        target = i < SEARCH_LIMIT ? shiftDays(target, step) : null
      }
    }
    if (!target || isSameDay(target, date)) return

    const first = months[0]
    const last = months[months.length - 1]
    const index = monthIndex(target.getFullYear(), target.getMonth())
    const delta =
      index < monthIndex(first.year, first.month)
        ? index - monthIndex(first.year, first.month)
        : index > monthIndex(last.year, last.month)
          ? index - monthIndex(last.year, last.month)
          : 0
    if (delta !== 0) {
      if (!onShiftMonths) return
      onShiftMonths(delta)
    }
    pendingFocus.current = dateKey(target)
    setActive(target)
  }

  return {
    containerRef,
    /** Для `DayGrid`: какой день в порядке Tab и обработчики клавиш. */
    gridProps: {
      tabbableDate: tabbable,
      onDayKeyDown,
      onDayFocus: setActive,
    },
  }
}

export { useDayFocus, dateKey }
