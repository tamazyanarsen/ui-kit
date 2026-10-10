import * as React from "react"

import { cn } from "@/lib/utils"
import { compactList } from "@/components/ui/header-menu/compact-list"
import { useItemsValue } from "@/components/ui/tabs/use-items-value"

// Tab Headings — «Заголовки-вкладки» (`ELK / tab-headings`, страница
// «.Title, Link, Bread Crumbs, Divider», 70467:11784).
//
// Из описания макета: «Tab Headings используются для группировки разделов в
// мобильной версии. Заголовок может быть как единственным и находиться в
// активном состоянии без возможности клика, так и одним из нескольких — с
// возможностью переключения между ними». И из примечания к варианту:
// «Компонент поддерживает от 1 до 5 вкладок. Название не должно переноситься
// на вторую строку».
//
// Это не лента `Tabs`: подчёркивания нет, подпись — заголовок H2 Medium
// Mobile (22/30), выбранная вкладка отличается только цветом. Поэтому
// отдельный компонент, но механика выбора общая с Tabs (`useItemsValue`:
// управляемый/неуправляемый режим и откат с пропавшего пункта), и та же
// клавиатура `tablist` — стрелки, Home/End, «бегающий» tabindex.
//
// Геометрия — из компонент-сета `Value=1…5`: вкладки подряд с интервалом
// 16, высота строки 30. Своей высоты/полей у корня нет.

/** Предел из макета: «от 1 до 5 вкладок». */
const MAX_TAB_HEADINGS = 5

interface TabHeadingsItem {
  value: string
  label: React.ReactNode
  /** Состояние `Disabled` у `Title Tab (ELK)` — Grey 166, не выбирается. */
  disabled?: boolean
}

interface TabHeadingsProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  items?: TabHeadingsItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

function TabHeadings({
  items: rawItems,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: TabHeadingsProps) {
  const items = compactList(rawItems) ?? []
  if (import.meta.env.DEV && items.length > MAX_TAB_HEADINGS) {
    console.warn(
      `TabHeadings: макет допускает не больше ${MAX_TAB_HEADINGS} вкладок, передано ${items.length}.`
    )
  }
  const { activeValue, setValue } = useItemsValue(
    items,
    value,
    defaultValue,
    onValueChange
  )
  // Единственный заголовок — «в активном состоянии без возможности клика».
  const single = items.length === 1
  // В порядок Tab попадает активная вкладка, а если она выключена — первая
  // доступная. Выключенная кнопка фокус не принимает, и `tabIndex=0` на ней
  // при `-1` у остальных вычёркивал группу из обхода по Tab целиком (ревью
  // 10.10, п. 5; то же правило, что у Tabs).
  const enabledItems = items.filter((item) => !item.disabled)
  const focusValue = enabledItems.some((item) => item.value === activeValue)
    ? activeValue
    : enabledItems[0]?.value

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const enabled = items.filter((item) => !item.disabled)
    const count = enabled.length
    if (count === 0) return
    const current = enabled.findIndex((item) => item.value === activeValue)
    let next: number
    if (event.key === "ArrowRight") next = current < 0 ? 0 : (current + 1) % count
    else if (event.key === "ArrowLeft") next = current < 0 ? count - 1 : (current - 1 + count) % count
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = count - 1
    else return
    const target = enabled[next]
    event.preventDefault()
    setValue(target.value)
    Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'))
      .find((el) => el.dataset.value === target.value)
      ?.focus()
  }

  return (
    <div
      role="tablist"
      data-slot="tab-headings"
      onKeyDown={onKeyDown}
      className={cn(
        // Названия не переносятся (примечание макета) — если пять вкладок не
        // помещаются в ширину экрана, ряд прокручивается, а не ломается на
        // две строки и не вылезает за край. Полосы не видно: это заголовки,
        // а не список.
        "flex w-full items-start gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const active = item.value === activeValue
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-slot="tab-headings-item"
            data-value={item.value}
            data-active={active || undefined}
            aria-selected={active}
            tabIndex={item.value === focusValue ? 0 : -1}
            disabled={item.disabled}
            onClick={() => {
              if (!active) setValue(item.value)
            }}
            className={cn(
              "flex shrink-0 items-center rounded-[4px] text-h2-mobile whitespace-nowrap outline-none focus-visible:focus-ring transition-colors",
              item.disabled
                ? "cursor-not-allowed text-[var(--tab-headings-fg-disabled)]"
                : active
                  ? "text-[var(--tab-headings-fg-active)]"
                  : "cursor-pointer text-[var(--tab-headings-fg)]",
              (active || single) && "cursor-default"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export { TabHeadings, MAX_TAB_HEADINGS }
export type { TabHeadingsItem, TabHeadingsProps }
