import * as React from "react"

import { ChevronLeft, X } from "@/icons"
import { Button } from "@/components/ui/button"

import { HeaderLabel } from "./nav-header"

// Обвязка мобильного листа: заголовок, строка навигации и две подписи
// секций внутри бесконечной прокрутки.

// Строка «Title» из макета: pt-24/pb-8/px-16, текст 18px medium с
// интерлиньяжем 24, кнопка закрытия на круге #f4f4f4
// (--calendar-range-bg). Снято с настоящего макета применения нижней
// шторки, а не с изолированного символа анатомии.
function SheetHeader({
  title,
  onClose,
}: {
  title: string
  onClose?: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 pt-6 pb-2">
      <h2 className="text-h4-mobile text-[var(--calendar-fg)]">{title}</h2>
      {/* Инстанс `ELK / button` в макете на заливке grey-109 #F4F4F4 — это
          собственный `secondary-grey` у Button, а не токен наведения на
          день у календаря, который случайно совпадает по hex. */}
      <Button
        variant="secondary-grey"
        size="sm"
        iconPosition="only"
        icon={X}
        aria-label="Закрыть"
        onClick={onClose}
        className="shrink-0"
      />
    </div>
  )
}

// Строка навигации «Subtitle» из макета: тот же зазор 8px, что и в коде
// (gap-2), но pb-8 (pb-2), а не pb-3. Снято с того же настоящего макета
// нижней шторки, что и SheetHeader.
function SheetNav({ label, onBack }: { label: string; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-2 px-4 pb-2">
      {onBack && (
        // `ELK / button` instance in Figma, white fill.
        <Button
          variant="secondary-white"
          size="sm"
          iconPosition="only"
          icon={ChevronLeft}
          aria-label="Назад"
          onClick={onBack}
          className="shrink-0"
        />
      )}
      {/* Совпадает с подписью «Май» и «2024» на десктопной
          навигационной таблетке — Object Sans Medium (P2 Medium), а не
          Regular. */}
      <span className="text-p2-medium text-[var(--calendar-fg)]">{label}</span>
    </div>
  )
}

// Заголовок месяца внутри бесконечной прокрутки Day и Range
// (mode="single" и "range"): в макете он нарисован той же скруглённой
// таблеткой-подписью, что и десктопная навигация («Май»), а не обычным
// заголовком. Сверено с настоящим макетом применения нижней шторки
// (заголовок «Выберите даты» → навигация «2024» → таблетка «Май»).
function MonthPillHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start px-3 pt-2 pb-4 text-p2-medium text-[var(--calendar-fg)]">
      <HeaderLabel>{children}</HeaderLabel>
    </div>
  )
}

// Заголовок года или десятилетия внутри бесконечной прокрутки Month и Year
// (mode="month" и "year"): в анатомии MonthYear (Mobile) это заголовок 22px
// medium с интерлиньяжем 30 («2024», «2013 – 2024»), а не text-lg с
// font-semibold.
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-4 pt-[22px] pb-4 text-h2-mobile text-[var(--calendar-fg)]">
      {children}
    </h3>
  )
}

export { MonthPillHeading, SectionHeading, SheetHeader, SheetNav }
