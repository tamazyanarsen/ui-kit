import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "@/icons"

import { cn } from "@/lib/utils"

// AccordionCard — самостоятельный аккордеон-«карточка» из макета
// (`ELK / accordion`: шапка с заголовком и подзаголовком, цветовые типы
// Default и Blocked, размеры Desktop и Mobile). Отличается от простого
// текстового Accordion из `src/demo/scaffold`, который используется только
// для оформления страницы документации в этом репозитории и говорит на
// другом визуальном языке (нет фона карточки, нет подзаголовка, всегда
// видимый шеврон в конце всей строки), и от AccordionList
// (`ELK / content accordion`). У каждой карточки собственный
// Accordion.Root из Base UI на один пункт, поэтому несколько карточек на
// странице открываются и закрываются независимо.
const ITEM_VALUE = "item"

interface AccordionCardProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  blocked?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  className?: string
}

function AccordionCard({
  title,
  subtitle,
  blocked = false,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: AccordionCardProps) {
  const controlled = open !== undefined

  return (
    <AccordionPrimitive.Root
      data-slot="accordion-card"
      value={controlled ? (open ? [ITEM_VALUE] : []) : undefined}
      defaultValue={defaultOpen ? [ITEM_VALUE] : []}
      onValueChange={
        onOpenChange
          ? (value: string[]) => onOpenChange(value.includes(ITEM_VALUE))
          : undefined
      }
      className={cn(
        "w-full overflow-hidden rounded-[12px]",
        blocked
          ? "bg-[var(--accordion-card-blocked-bg)]"
          : "bg-[var(--accordion-card-bg)]",
        className
      )}
    >
      <AccordionPrimitive.Item value={ITEM_VALUE}>
        <AccordionPrimitive.Header>
          <AccordionPrimitive.Trigger
            data-slot="accordion-card-trigger"
            className={cn(
              // Мобильная форма (`Size=Mobile`): вся шапка ужимается —
              // отступ 16px вместо 24, расстояние от текста до шеврона
              // 16px вместо 24, шрифты H4 Mobile и P1 Medium Mobile. Зазор
              // 4px между заголовком и подзаголовком и шеврон 16px
              // одинаковы в обеих формах.
              "flex w-full flex-col gap-1 p-4 text-left outline-none focus-visible:focus-ring transition-colors desktop:p-6 [&[data-panel-open]_svg]:rotate-180",
              blocked
                ? "hover:bg-[var(--accordion-card-blocked-bg-hover)]"
                : "hover:bg-[var(--accordion-card-bg-hover)]"
            )}
          >
            {/* `items-start`: шеврон прижат к верху строки заголовка (в
                макете он стоит на y=24, то есть ровно в верхний отступ
                самой карточки), а не отцентрован по строке высотой 28px —
                центрирование опускало его на 6px ниже, чем у мастера. */}
            <span className="flex items-start justify-between gap-4 desktop:gap-6">
              <span className="text-h4-mobile text-[var(--accordion-card-title-fg)] desktop:text-h4">
                {title}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--accordion-card-icon-fg)] transition-transform duration-200"
              />
            </span>
            {subtitle && (
              <span className="text-p2-medium text-[var(--accordion-card-subtitle-fg)] desktop:text-p1-medium">
                {subtitle}
              </span>
            )}
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        {children && (
          <AccordionPrimitive.Panel
            data-slot="accordion-card-panel"
            className="h-(--accordion-panel-height) overflow-hidden text-p2-medium transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
          >
            {/* Разделитель шапки и содержимого — подтверждён литеральным
                выводом по вариантам Open=True (и для типа Default, и для
                Blocked): «Content» несёт border-t grey-134/#DEDEDE плюс
                собственный верхний отступ 24px поверх нижнего отступа 24px
                у шапки. Прежний проход заключил, что разделителя нет,
                опираясь на перепроверку по вектору, которая против этих
                литеральных данных не устояла. */}
            <div className="border-t border-[var(--accordion-card-divider)] p-4 desktop:p-6">
              {children}
            </div>
          </AccordionPrimitive.Panel>
        )}
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  )
}

export { AccordionCard }
