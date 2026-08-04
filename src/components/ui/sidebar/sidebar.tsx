import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"

// Sidebar — "Боковая панель для сотрудников": one nav rail, two width
// states (per spec: "Панель может находиться в свёрнутом или развёрнутом
// состоянии"). Everything else in the spec's own property table (Show
// Scroll, Dropdown groups, Show Text: Icon/Text/Select, item State) is
// configuration of this single component, not separate variants.
//
// Expanding a group (see SidebarGroup in item.tsx) is lifted up into this
// Root rather than left to each Accordion.Item's own uncontrolled state,
// because collapsed-rail clicks need to both open the *sidebar* and expand
// the clicked *group* together — per the spec's own callout: "При клике на
// категорию в свёрнутом сайдбаре: для элементов без вложенности происходит
// переход на страницу, а для категорий с подразделами — раскрывается
// сайдбар для выбора нужной подкатегории."
interface SidebarContextValue {
  open: boolean
  requestOpenGroup: (value: string) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("Sidebar.Item/Group must be rendered inside <Sidebar>")
  }
  return context
}

interface SidebarProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showScroll?: boolean
  expandedGroups?: string[]
  defaultExpandedGroups?: string[]
  onExpandedGroupsChange?: (values: string[]) => void
  children?: React.ReactNode
  className?: string
}

function Sidebar({
  open,
  defaultOpen = true,
  onOpenChange,
  showScroll = true,
  expandedGroups,
  defaultExpandedGroups = [],
  onExpandedGroupsChange,
  children,
  className,
}: SidebarProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = open !== undefined ? open : internalOpen

  const [internalExpanded, setInternalExpanded] =
    React.useState<string[]>(defaultExpandedGroups)
  const activeExpanded = expandedGroups ?? internalExpanded

  function setOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  function setExpanded(next: string[]) {
    if (expandedGroups === undefined) setInternalExpanded(next)
    onExpandedGroupsChange?.(next)
  }

  function requestOpenGroup(value: string) {
    setOpen(true)
    if (!activeExpanded.includes(value)) setExpanded([...activeExpanded, value])
  }

  return (
    <SidebarContext.Provider value={{ open: isOpen, requestOpenGroup }}>
      <nav
        data-slot="sidebar"
        data-open={isOpen || undefined}
        className={cn(
          "flex h-full flex-col overflow-hidden border-r border-[var(--nav-sidebar-border)] bg-[var(--nav-sidebar-bg)] transition-[width] duration-200",
          isOpen ? "w-[312px]" : "w-14",
          className
        )}
      >
        <AccordionPrimitive.Root
          multiple
          value={activeExpanded}
          onValueChange={(value) => setExpanded(value as string[])}
          className={cn(
            "flex flex-1 flex-col gap-4 py-6",
            isOpen ? "px-2" : "items-center",
            showScroll ? "overflow-y-auto" : "overflow-hidden"
          )}
        >
          {children}
        </AccordionPrimitive.Root>
      </nav>
    </SidebarContext.Provider>
  )
}

export { Sidebar, useSidebarContext }
export type { SidebarProps }
