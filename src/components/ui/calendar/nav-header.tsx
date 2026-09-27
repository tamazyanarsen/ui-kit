import * as React from "react"

import { ChevronLeft, ChevronRight } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavHeaderProps {
  onPrev: () => void
  onNext: () => void
  children: React.ReactNode
  /** У ELK/calendar в макете два разных отступа контейнера: карточка Day и
   * Range — 14px по горизонтали с зазором 8px вниз до строки дней недели
   * («day»), а карточка Month и Year — 16px по горизонтали с зазором 16px
   * вниз до сетки («picker»). И то и другое зашито здесь как собственные
   * боковые и нижний отступы шапки, а не как зазор на уровне родителя. */
  variant?: "day" | "picker"
}

// Стрелки «назад» и «вперёд» в макете — это инстансы `ELK / button`
// (32×32, радиус 16, глиф 16px, белая заливка), то есть ровно геометрия
// `icon-sm` у Button, поэтому здесь рисуется настоящий Button. Раньше они
// были самодельной подделкой, которая брала для наведения
// `--calendar-range-bg` (#F4F4F4), но этот токен — наведение на *ячейку
// дня* (grey-109 в макете); инстанс кнопки берёт собственное наведение
// Button #EFEFEF.
function NavHeader({ onPrev, onNext, children, variant = "day" }: NavHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between pt-4",
        variant === "picker" ? "px-4 pb-4" : "px-3.5 pb-2"
      )}
    >
      <Button
        variant="secondary-white"
        size="sm"
        iconPosition="only"
        icon={ChevronLeft}
        aria-label="Назад"
        onClick={onPrev}
      />
      <div className="flex items-center text-p2-medium text-[var(--calendar-fg)]">
        {children}
      </div>
      <Button
        variant="secondary-white"
        size="sm"
        iconPosition="only"
        icon={ChevronRight}
        aria-label="Вперёд"
        onClick={onNext}
      />
    </div>
  )
}

/** Подпись в шапке: таблетка-кнопка, если по ней можно переключить вид. */
function HeaderLabel({
  onClick,
  children,
}: {
  onClick?: () => void
  children: React.ReactNode
}) {
  if (!onClick) {
    return (
      <span className="inline-flex h-8 items-center rounded-[16px] px-4">
        {children}
      </span>
    )
  }
  // Переопределение text-p2-medium: у `sm` в Button до `desktop:` стоит
  // text-p3-medium, а таблетка месяца и года в макете имеет 14px с
  // интерлиньяжем 20 и на десктопной карточке, и в мобильной шторке,
  // поэтому размер закреплён, а не переключается по брейкпоинту.
  return (
    <Button
      variant="secondary-white"
      size="sm"
      className="text-p2-medium"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export { HeaderLabel, NavHeader }
