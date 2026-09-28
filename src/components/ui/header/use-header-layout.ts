import * as React from "react"

import { useViewportInsetTop } from "@/lib/use-viewport-inset-top"
import { resolveFavouriteLinks } from "@/components/ui/header-menu"

import type { HeaderNavItem } from "./nav-row"
import type { HeaderProps } from "./header-props"

// Раскладка шапки: из двух осей свойств (`type` и `clientHeaderType`)
// выводится, что именно рисуется, а из меню и избранного — список пунктов
// нижнего ряда.
//
// Вынесено из `Header` отдельным хуком: сама шапка — это разметка трёх полос
// и трёх всплывающих панелей, а здесь ни одного узла нет, только правила
// «кому что положено». Пока и то и другое лежало в одной функции, она была
// на 266 строк.

function useHeaderLayout({
  type = "client",
  clientHeaderType = "client",
  navItems = [],
  menuGroups = [],
  favourites = [],
  onFavouritesChange,
  pinned = false,
}: HeaderProps) {
  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const [favouritesSettingsOpen, setFavouritesSettingsOpen] =
    React.useState(false)
  // Раскрыта всегда не больше одной панели: в макете кнопка второй панели
  // в этот момент стоит в обычном состоянии, а не в состоянии «закрыть».
  const [openPanel, setOpenPanel] = React.useState<"menu" | "create" | null>(
    null
  )

  const isBlocked = type === "client" && clientHeaderType === "client-is-blocked"
  const showNavRow = type === "client" && !isBlocked
  const showCreate = type === "client" && clientHeaderType === "client"
  const favouritesEnabled = Boolean(onFavouritesChange)

  // Закреплённые разделы одним списком. У клиента они уезжают в НИЖНИЙ ряд,
  // у сотрудника — в верхнюю полосу (новое меню сотрудника, см.
  // `ui/employee-menu`); список и его порядок при этом один и тот же.
  const favouriteLinks = React.useMemo(
    () => resolveFavouriteLinks(menuGroups, favourites),
    [menuGroups, favourites]
  )

  // Нижний ряд — это избранное, когда есть из чего его считать. Раньше
  // `navItems` и `favourites` были двумя независимыми списками, поэтому
  // звезда в раскрытом меню ничего не меняла в шапке.
  const resolvedNavItems: HeaderNavItem[] = React.useMemo(() => {
    if (menuGroups.length === 0) return navItems
    return favouriteLinks.map((link) => ({
      value: link.value,
      label: link.label,
      onClick: link.onClick,
    }))
  }, [menuGroups, favouriteLinks, navItems])

  // Шапка сотрудника нового меню: закреплённые разделы стоят прямо в
  // верхней полосе, а гамбургера и парного `Sidebar` у неё нет. Признак —
  // переданное меню или включённое избранное: старые вызовы, где у
  // сотрудника ни того ни другого, работают ровно как раньше.
  const employeeFavourites =
    type === "employee" && (menuGroups.length > 0 || favouritesEnabled)

  React.useEffect(() => {
    if (!showNavRow) setOpenPanel(null)
  }, [showNavRow])

  // Кнопка «Создать» пропала (выбрали организацию без счетов — шапка
  // «client-without-account»), а её панель осталась бы открытой: с
  // плитками, затемнением и запертой прокруткой, но без кнопки, которой её
  // закрывают. Раньше сбрасывалось только исчезновение всего нижнего ряда.
  React.useEffect(() => {
    if (!showCreate) setOpenPanel((open) => (open === "create" ? null : open))
  }, [showCreate])

  // Что именно закрепляется — см. `pinned`. Если нижний ряд есть, липнет
  // только он; если его нет, липнет вся шапка.
  const pinnedRow = pinned && showNavRow
  const pinnedRoot = pinned && !showNavRow

  // Занятый верх вьюпорта публикуется отсюда. Величина МЕРЯЕТСЯ у того
  // узла, который реально закреплён, — оба вызова живут рядом, неактивный
  // просто ничего не публикует.
  const rootRef = React.useRef<HTMLDivElement>(null)
  const navRowRef = React.useRef<HTMLDivElement>(null)
  useViewportInsetTop(rootRef, pinnedRoot)
  useViewportInsetTop(navRowRef, pinnedRow)

  return {
    isBlocked,
    showNavRow,
    showCreate,
    favouritesEnabled,
    favouriteLinks,
    resolvedNavItems,
    employeeFavourites,
    pinnedRow,
    pinnedRoot,
    rootRef,
    navRowRef,
    openPanel,
    setOpenPanel,
    logoutOpen,
    setLogoutOpen,
    favouritesSettingsOpen,
    setFavouritesSettingsOpen,
  }
}

export { useHeaderLayout }
