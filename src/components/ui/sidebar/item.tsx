import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "@/icons"

import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"

import { useSidebarContext } from "./sidebar"

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const ICON_SIZE = "size-6"

// Shows the label as a tooltip whenever the sidebar is collapsed (there's no
// visible label to read) or the label text itself overflows even while open
// — per the spec's "длинного элемента меню, который не помещается" mockup.
//
// Checks BOTH axes: labels are `line-clamp-2`, so a label too long to fit
// overflows vertically (scrollHeight), not horizontally — a width-only test
// would silently stop showing the tooltip for exactly the case the spec
// mocks up.
function useTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [truncated, setTruncated] = React.useState(false)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setTruncated(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
  })

  return { ref, truncated }
}

// Figma's sidebar labels are `min-h-[24px] max-h-[48px]` with an ellipsis,
// i.e. one line that may grow to two before truncating — so the row is a
// 40px *minimum*, not a fixed height (`Sidebar Item (ELK)`, node
// 40433:14471, whose own trigger is `p-[8px]` with `items-start`).
const LABEL_CLASS = "min-w-0 line-clamp-2"

interface SidebarItemProps {
  icon?: IconComponent
  label: React.ReactNode
  active?: boolean
  nested?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

// Leaf nav item — per spec, clicking it always just navigates, in both the
// open and collapsed rail (no auto-expand behavior; that's SidebarGroup's).
// `nested` renders the indented, icon-less form used for a group's children
// ("Платежи СБП" / "QR-коды СБП" in the anatomy).
function SidebarItem({
  icon: Icon,
  label,
  active = false,
  nested = false,
  href,
  onClick,
  className,
}: SidebarItemProps) {
  const { open } = useSidebarContext()
  const { ref: labelRef, truncated } = useTruncated<HTMLSpanElement>()

  const content = (
    <a
      href={href}
      onClick={onClick}
      data-slot="sidebar-item"
      data-active={active || undefined}
      aria-label={!open && typeof label === "string" ? label : undefined}
      className={cn(
        "flex min-h-10 shrink-0 cursor-pointer items-center gap-4 rounded-[8px] text-p1-medium text-[var(--nav-sidebar-fg)] outline-none transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)]",
        // Nested rows are `pl-[48px] pr-[8px] py-[8px]` in the master; 48
        // is exactly px-2 + a 24px icon + the 16px gap, so their labels
        // line up under the parent's.
        //
        // Дизайн-чек 3/3 №23: «в свёрнутом варианте меню при наведении/
        // нажатии на иконку выделяется неверная область клика, она должна
        // быть больше». Свёрнутая полоса центрирует детей (`items-center` в
        // sidebar.tsx), поэтому пункт сжимался по содержимому, а `px-0`
        // оставлял его шириной ровно в иконку — подсветка выходила 24×40
        // вместо квадрата 40×40. В макете (2314:30693) свёрнутый пункт —
        // `p-[8px] rounded-[8px]` вокруг 24px-иконки, то есть те же 8px
        // отступа, что и в развёрнутом состоянии.
        open ? (nested ? "py-2 pr-2 pl-12" : "p-2") : "size-10 justify-center p-2",
        className
      )}
    >
      {Icon && !nested && (
        <Icon
          aria-hidden="true"
          className={cn(ICON_SIZE, "shrink-0 text-[var(--nav-sidebar-icon-fg)]")}
        />
      )}
      {open && (
        <span ref={labelRef} className={LABEL_CLASS}>
          {label}
        </span>
      )}
    </a>
  )

  if (open && !truncated) return content

  return (
    <Tooltip content={label} direction="left">
      {content}
    </Tooltip>
  )
}

interface SidebarGroupProps {
  value: string
  icon?: IconComponent
  label: React.ReactNode
  active?: boolean
  children: React.ReactNode
  className?: string
}

// Expandable group header — per spec: collapsed-rail click doesn't toggle
// its own (invisible) panel, it opens the whole sidebar *and* pre-expands
// this group via SidebarContext, so the subcategories are already visible
// the moment the rail finishes expanding.
function SidebarGroup({
  value,
  icon: Icon,
  label,
  active = false,
  children,
  className,
}: SidebarGroupProps) {
  const { open, requestOpenGroup } = useSidebarContext()

  const collapsedTrigger = (
    <button
      type="button"
      data-slot="sidebar-group-trigger"
      data-active={active || undefined}
      aria-label={typeof label === "string" ? label : undefined}
      onClick={() => requestOpenGroup(value)}
      className={cn(
        // Дизайн-чек 3/3 №23: та же область 40×40 с 8px отступа, что и у
        // обычного пункта в свёрнутой полосе (2314:30693) — `w-full` здесь
        // не помогал, потому что родитель сжат по содержимому.
        "flex size-10 shrink-0 items-center justify-center rounded-[8px] p-2 text-[var(--nav-sidebar-fg)] outline-none transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)]",
        className
      )}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={cn(ICON_SIZE, "shrink-0 text-[var(--nav-sidebar-icon-fg)]")}
        />
      )}
    </button>
  )

  return (
    <AccordionPrimitive.Item value={value} data-slot="sidebar-group">
      <AccordionPrimitive.Header>
        {open ? (
          <AccordionPrimitive.Trigger
            nativeButton={false}
            render={<div />}
            data-slot="sidebar-group-trigger"
            data-active={active || undefined}
            className={cn(
              // `items-start` + `min-h-10`, matching the master's own
              // `p-[8px] items-start` trigger: a two-line label grows the
              // row downward and keeps the icon and chevron pinned to the
              // first line rather than re-centring them.
              "flex min-h-10 w-full cursor-pointer items-start gap-4 rounded-[8px] p-2 text-left text-p1-medium text-[var(--nav-sidebar-fg)] outline-none transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)] [&[data-panel-open]_[data-slot=sidebar-group-chevron]]:rotate-180",
              className
            )}
          >
            {Icon && (
              <Icon
                aria-hidden="true"
                className={cn(ICON_SIZE, "shrink-0 text-[var(--nav-sidebar-icon-fg)]")}
              />
            )}
            <span className={cn(LABEL_CLASS, "flex-1")}>{label}</span>
            {/* The master wraps the chevron in an "Arrow Box" with
                `pt-[4px]`, which centres it on the first 24px line — with
                a single-line label that lands in the same place as
                centring, but it stays put when the label wraps. */}
            <ChevronDown
              aria-hidden="true"
              data-slot="sidebar-group-chevron"
              className="mt-1 size-4 shrink-0 text-[var(--nav-sidebar-icon-fg)] transition-transform duration-200"
            />
          </AccordionPrimitive.Trigger>
        ) : (
          <Tooltip content={label} direction="left">
            {collapsedTrigger}
          </Tooltip>
        )}
      </AccordionPrimitive.Header>
      {/* The collapsed rail never shows nested children — even while this
          group's accordion value is technically "expanded" (it stays that
          way across a collapse so the group reopens pre-expanded once the
          rail widens again, per requestOpenGroup). Skipping the Panel
          entirely while collapsed avoids it rendering the icon-less nested
          rows into the icon-only rail as an empty gap. */}
      {open && (
        <AccordionPrimitive.Panel
          data-slot="sidebar-group-panel"
          className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
        >
          <div className="flex flex-col gap-4 pt-4 pb-2">{children}</div>
        </AccordionPrimitive.Panel>
      )}
    </AccordionPrimitive.Item>
  )
}

export { SidebarItem, SidebarGroup }
export type { SidebarItemProps, SidebarGroupProps }
