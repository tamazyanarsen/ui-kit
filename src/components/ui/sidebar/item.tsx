import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"

import { useSidebarContext } from "./sidebar"

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const ICON_SIZE = "size-6"

// Shows the label as a tooltip whenever the sidebar is collapsed (there's no
// visible label to read) or the label text itself overflows even while open
// — per the spec's "длинного элемента меню, который не помещается" mockup.
function useTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [truncated, setTruncated] = React.useState(false)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setTruncated(el.scrollWidth > el.clientWidth)
  })

  return { ref, truncated }
}

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
        "flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg text-sm font-medium text-[var(--nav-sidebar-fg)] outline-none transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)]",
        open ? (nested ? "pr-3 pl-11" : "px-3") : "justify-center px-0",
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
        <span ref={labelRef} className="min-w-0 truncate">
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
        "flex h-10 w-full shrink-0 items-center justify-center rounded-lg text-[var(--nav-sidebar-fg)] outline-none transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)]",
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
              "flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-[var(--nav-sidebar-fg)] outline-none transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)] [&[data-panel-open]_[data-slot=sidebar-group-chevron]]:rotate-180",
              className
            )}
          >
            {Icon && (
              <Icon
                aria-hidden="true"
                className={cn(ICON_SIZE, "shrink-0 text-[var(--nav-sidebar-icon-fg)]")}
              />
            )}
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <ChevronDown
              aria-hidden="true"
              data-slot="sidebar-group-chevron"
              className="size-4 shrink-0 text-[var(--nav-sidebar-icon-fg)] transition-transform duration-200"
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
          <div className="flex flex-col gap-0.5 pt-0.5">{children}</div>
        </AccordionPrimitive.Panel>
      )}
    </AccordionPrimitive.Item>
  )
}

export { SidebarItem, SidebarGroup }
export type { SidebarItemProps, SidebarGroupProps }
