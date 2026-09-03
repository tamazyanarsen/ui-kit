import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { ChevronDown, ChevronUp, X } from "@/icons"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { filterTablePillClass } from "@/components/ui/filter-table"

const ICON_SIZE = "size-4"

interface FilterTriggerProps {
  label: React.ReactNode
  icon?: React.ReactNode
  background: "white" | "grey"
  count?: number
  disabled: boolean
  /** Пилюля `ELK / filter-table` вместо обычной коробки фильтра. */
  asChip: boolean
  /** Figma's `Checked` property on filter-table — тёмная пилюля. */
  chipChecked: boolean
  open: boolean
  hasValue: boolean
  activeValue: string | null
  onClear: (event: React.SyntheticEvent) => void
  anchorRef: React.RefObject<HTMLDivElement>
  className?: string
}

/**
 * Заливка и обводка триггера.
 *
 * Три взаимоисключающих вида (chip / disabled / обычный) — и только у
 * обычного цвет ещё зависит от открытости и фона, поэтому цепочка `if`
 * читается лучше, чем вложенный тернарник.
 *
 * Round-2 audit fix: `disabled` проверяется ПЕРВЫМ, а не `asChip` — эти два
 * состояния не исключают друг друга (chip + disabled + hasValue вполне
 * бывает), и прежний порядок молча терял оформление отключённой чипсы с
 * значением. У макета `State=Disabled,Checked=True` (filter-table нода
 * 1303:99261) заливка #EFEFEF и текст #C8C8CB — это ровно
 * `--btn-muted-bg`/`-fg` (которому `--filter-disabled-fg` равен hex в hex),
 * а не более светлый `--filter-disabled-bg` #F4F4F4.
 */
function triggerToneClass({
  asChip,
  chipChecked,
  disabled,
  open,
  hasValue,
  background,
}: Pick<
  FilterTriggerProps,
  "asChip" | "chipChecked" | "disabled" | "open" | "hasValue" | "background"
>) {
  if (asChip) {
    // Вид-пилюля — это Figma `ELK / filter-table`, та же пилюля, что рисует
    // NPS, поэтому её заливка/ховер/отключённое состояние берутся из общего
    // помощника, а не переписываются здесь. Локальной остаётся только
    // обводка: у filter-table её нет, но триггер держит прозрачный
    // `border-2`, чтобы переключение между видами не меняло размер коробки.
    return cn(
      "border-transparent",
      filterTablePillClass({ selected: chipChecked, disabled })
    )
  }

  if (disabled) return "border-transparent bg-[var(--filter-disabled-bg)]"

  // Дизайн-чек №19/№20: брендовая обводка — это состояние «фильтр выбран», а
  // не «поповер открыт». В макете `State=Active` у обоих типов — Filter
  // (White), нода 54887:29390, и Filter (Grey), нода 54887:29400 — это
  // пилюля с выставленным значением: заливка своя (white-101 у белого,
  // grey-109 у серого), сверху `border-2` цвета Base/Blue 223. Раньше
  // обводка держалась только пока открыт список и пропадала сразу после
  // выбора — то есть «выбранную чипсу с брендовой обводкой» увидеть было
  // нельзя, о чём дизайн-чек и говорит.
  return cn(
    open || hasValue
      ? "border-[var(--filter-active-border)]"
      : "border-transparent",
    background === "grey"
      ? "bg-[var(--filter-grey-bg)] hover:bg-[var(--filter-grey-bg-hover)]"
      : "bg-[var(--filter-white-bg)] hover:bg-[var(--filter-white-bg-hover)]"
  )
}

/** Значок справа: крестик у фильтра со значением, иначе шеврон. */
function TriggerAction({
  hasValue,
  open,
  disabled,
  asChip,
  onClear,
}: Pick<
  FilterTriggerProps,
  "hasValue" | "open" | "disabled" | "asChip" | "onClear"
>) {
  // Design-check #26: раньше значок держал один тёмный цвет независимо от
  // `disabled`, вразрез с подписью, которая рядом светлела.
  const toneClass = disabled
    ? "text-[var(--filter-disabled-fg)]"
    : asChip
      ? "text-current"
      : "text-[var(--filter-icon-fg)]"

  if (hasValue) {
    return (
      <button
        type="button"
        aria-label="Сбросить фильтр"
        disabled={disabled}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={onClear}
        className={cn("outline-none focus-visible:focus-ring", toneClass)}
      >
        <X aria-hidden="true" className={ICON_SIZE} />
      </button>
    )
  }

  const Chevron = open ? ChevronUp : ChevronDown
  return (
    <Chevron
      aria-hidden="true"
      className={cn(ICON_SIZE, "shrink-0", toneClass)}
    />
  )
}

function FilterTrigger({
  label,
  icon,
  background,
  count,
  disabled,
  asChip,
  chipChecked,
  open,
  hasValue,
  activeValue,
  onClear,
  anchorRef,
  className,
}: FilterTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      disabled={disabled}
      nativeButton={false}
      render={
        <div
          ref={anchorRef}
          data-slot="filter"
          data-disabled={disabled || undefined}
          className={cn(
            // Design-check #24: the open-state border and the generic
            // focus-visible ring used to layer into a double outline — the
            // border alone is the DS's actual "open" indicator, so the ring
            // only kicks in for keyboard focus while closed.
            //
            // Round-2 audit fix: border is `border-2` (not the
            // Tailwind-default 1px) — Figma's Active/Active(Hover) states
            // (nodes 54887:29390/29395/29400/29405) are a literal `border-2
            // border-[#80e3ff]`. Kept at a constant 2px across every state
            // (color-only swap between transparent/active) rather than
            // growing on open, so the box doesn't jump size when the border
            // becomes visible. Radius is conditionally a full pill for the
            // `asChip` look — its actual Figma source (the filter-table dark
            // pill, node 1303:99241) is `rounded-[16px]` on a ~32px box,
            // i.e. a capsule, not the plain Filter's `rounded-[8px]`.
            "group/filter inline-flex w-fit max-w-64 cursor-pointer flex-col items-start gap-0 border-2 whitespace-nowrap px-4 py-1.5 outline-none transition-colors select-none not-data-popup-open:focus-visible:focus-ring data-disabled:pointer-events-none data-disabled:cursor-not-allowed",
            // filter-table hugs its label (max-w only); the plain
            // chips-filter box keeps its own 80px floor and 8px radius.
            asChip ? "min-w-0" : "min-w-20 rounded-[8px]",
            triggerToneClass({
              asChip,
              chipChecked,
              disabled,
              open,
              hasValue,
              background,
            }),
            className
          )}
        />
      }
    >
      <span className="flex w-full min-w-0 items-center gap-2">
        {icon && !asChip && (
          <span
            aria-hidden="true"
            className={cn(ICON_SIZE, "shrink-0 text-[var(--filter-icon-fg)]")}
          >
            {icon}
          </span>
        )}
        <span
          className={cn(
            // Round-2 audit fix: the `asChip` look's real Figma source
            // (filter-table's dark pill, P2 Medium 14/20) has no separate
            // desktop size — the `desktop:text-base` bump only applies to
            // the plain Filter label.
            "min-w-0 truncate text-p2-medium",
            !asChip && "desktop:text-p1-medium",
            // In chip mode the pill class already sets the text colour for
            // its own Checked/Disabled state — overriding it here would
            // repaint the dark pill's white label.
            asChip
              ? chipChecked
                ? undefined
                : "flex-1 text-center"
              : disabled
                ? "text-[var(--filter-disabled-fg)]"
                : "text-[var(--filter-fg)]"
          )}
        >
          {chipChecked ? activeValue : label}
        </span>
        {count !== undefined && (
          <Badge
            type="counter"
            value={count}
            color={asChip ? "dark-grey" : "light-grey"}
            disabled={disabled}
          />
        )}
        <span className="ml-auto flex shrink-0 items-center">
          <TriggerAction
            hasValue={hasValue}
            open={open}
            disabled={disabled}
            asChip={asChip}
            onClear={onClear}
          />
        </span>
      </span>
    </PopoverPrimitive.Trigger>
  )
}

export { FilterTrigger, ICON_SIZE }
