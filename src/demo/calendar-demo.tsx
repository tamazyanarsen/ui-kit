import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

// `Calendar` now manages its own draft selection internally (see its own
// comment) and only calls `onChange` once "Применить" is pressed — so this
// wrapper's `value`/`onChange` reflect the *committed* date, one click
// (plus Apply) behind whatever's currently highlighted in the grid.
function SingleDateCalendar(
  props: Omit<React.ComponentProps<typeof Calendar>, "mode" | "value" | "onChange">
) {
  const [value, setValue] = useState<Date | null>(null)
  return <Calendar {...props} mode="single" value={value} onChange={setValue} />
}

function CalendarDemo() {
  return (
    <>
      <AccordionItem value="calendar-modes">
        <AccordionTrigger>Calendar — режимы (Desktop)</AccordionTrigger>
        <AccordionPanel>
          <div className="flex flex-wrap items-start gap-8">
            <div className="space-y-2">
              <RowLabel>Week (single)</RowLabel>
              <SingleDateCalendar />
            </div>
            <div className="space-y-2">
              <RowLabel>Range</RowLabel>
              <Calendar mode="range" />
            </div>
            <div className="space-y-2">
              <RowLabel>Month</RowLabel>
              <Calendar mode="month" />
            </div>
            <div className="space-y-2">
              <RowLabel>Year</RowLabel>
              <Calendar mode="year" />
            </div>
          </div>
          <p className="mt-6 text-p3-regular text-muted-foreground">
            В режиме "single" клик по названию месяца/года в шапке открывает
            выбор месяца/года (drill-down), как в макете (отдельные
            hit-области у "Май" и "2024").
          </p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="calendar-no-footer">
        <AccordionTrigger>Calendar — без футера</AccordionTrigger>
        <AccordionPanel>
          <div className="flex flex-wrap items-start gap-8">
            <SingleDateCalendar footer={false} />
            <Calendar mode="range" footer={false} />
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="calendar-mobile">
        <AccordionTrigger>Calendar — Mobile (sheet)</AccordionTrigger>
        <AccordionPanel>
          <div className="flex flex-wrap items-start gap-6">
            <div className="space-y-2">
              <RowLabel>Week (single)</RowLabel>
              <SingleDateCalendar layout="sheet" />
            </div>
            <div className="space-y-2">
              <RowLabel>Range</RowLabel>
              <Calendar mode="range" layout="sheet" />
            </div>
            <div className="space-y-2">
              <RowLabel>Month</RowLabel>
              <Calendar mode="month" layout="sheet" />
            </div>
            <div className="space-y-2">
              <RowLabel>Year</RowLabel>
              <Calendar mode="year" layout="sheet" />
            </div>
          </div>
          <p className="mt-6 text-p3-regular text-muted-foreground">
            Мобильная версия — не просто уменьшенная сетка, а другой паттерн:
            шапка "Выберите даты" + закрытие, непрерывный бесконечный скролл
            месяцев/лет/декад вниз (IntersectionObserver, без верхней
            границы) вместо пагинации. Тап по лейблу года открывает экран
            выбора года (для Year — обычный prev/next по декадам), а не
            тупиковую перемотку без возврата. Компонент рендерит только
            контент — оборачивать в модалку/bottom-sheet нужно на уровне
            страницы.
          </p>
        </AccordionPanel>
      </AccordionItem>
    </>
  )
}

export { CalendarDemo }
