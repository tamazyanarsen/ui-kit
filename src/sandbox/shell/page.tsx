import * as React from "react"

import { cn } from "@/lib/utils"
import { Header } from "@/components/ui/header"
import {
  CREATE_ITEMS,
  MENU_BANNERS,
  MENU_FAVOURITES,
  MENU_GROUPS,
} from "@/stories/menu-fixtures"

import {
  SANDBOX_DOCUMENT_MENU,
  SANDBOX_NOTIFICATIONS,
  SANDBOX_ORGANIZATIONS,
} from "./fixtures"

// Каркас песочного экрана — инстанс `ELK / сonstructor` (секция «Песочные
// экраны», нода 70371:24466). Порядок сверху вниз задан самим конструктором:
//
//   шапка 128 → область тостов (схлопнута) → холст → сетка → заголовок
//   страницы → дополнительный элемент 36 (зазор 24) → блоки (зазор 24) →
//   нижняя полоса действий → хвост страницы 40.
//
// Контентная сетка — 12 колонок в области `clamp(1200, окно − 2×40, 1800)`:
// при 1920 она упирается в 1800 и центрируется, поэтому поле выходит 60; в
// диапазоне 1280…1879 поле 40. Считает это `SandboxGrid`, а не каждый экран:
// без общего слоя первый же экран прописал бы 1800 литералом и на 1440
// разъехался.
//
// Почему шелл, а не компонент кита: `ELK / title-page` в ките ЕСТЬ (это
// `TitleCard` / `TitleRegistry`), а вот сам конструктор, `Additional Page
// Element` и `Bottom Bar Element` — элементы страницы, а не кита, и в карту
// компонентов не входят намеренно. Держим их здесь, рядом с экранами, и
// наружу не экспортируем.

const GRID_WIDTH = "clamp(1200px, calc(100vw - 80px), 1800px)"

/** Ширина области контента — тем, кто считает колонки сам (см. `span`). */
export { GRID_WIDTH }

/**
 * Ширина в колонках 12-колоночной сетки: колонка 128, желоб 24 —
 * `n × 128 + (n − 1) × 24`. При 1800 это ровно пролёты макета
 * (4 → 584, 5 → 736, 7 → 1040, 8 → 1192), но выражением, а не числом,
 * поэтому на 1440 доли те же.
 */
function span(n: number) {
  return `calc((100% - 11 * 24px) / 12 * ${n} + ${n - 1} * 24px)`
}

interface SandboxPageProps {
  /** Значение раздела в меню шапки — подсвечивается в нижнем ряду. */
  activeSection?: string
  /** `ELK / title-page`: `TitleCard` или `TitleRegistry`. */
  title?: React.ReactNode
  /**
   * `Additional Page Element` — 36px под заголовком с зазором 24. На
   * пошаговых экранах это `ProgressBar` варианта `step`, на реестрах —
   * `Tabs`.
   */
  additional?: React.ReactNode
  /** Область тостов и верхних сообщений между шапкой и холстом. */
  notifications?: React.ReactNode
  /** `Bottom Bar Element` — полоса действий под блоками. */
  bottomBar?: React.ReactNode
  /** Зазор между блоками: 24 по умолчанию, на части экранов 32. */
  blockGap?: 24 | 32
  children?: React.ReactNode
  className?: string
}

function SandboxPage({
  activeSection,
  title,
  additional,
  notifications,
  bottomBar,
  blockGap = 24,
  children,
  className,
}: SandboxPageProps) {
  const [favourites, setFavourites] = React.useState<string[]>(MENU_FAVOURITES)
  const [organizationId, setOrganizationId] = React.useState(
    SANDBOX_ORGANIZATIONS[0]!.id
  )

  return (
    <div
      data-slot="sandbox-page"
      className={cn(
        "flex min-h-screen w-full flex-col bg-[var(--grey-109)]",
        className
      )}
    >
      <Header
        pinned
        activeSection={activeSection}
        menuGroups={MENU_GROUPS}
        menuBanners={MENU_BANNERS}
        createItems={CREATE_ITEMS}
        favourites={favourites}
        onFavouritesChange={setFavourites}
        organizations={SANDBOX_ORGANIZATIONS}
        organizationId={organizationId}
        onOrganizationChange={setOrganizationId}
        contactPerson="Константинопольский К. К."
        documentMenuItems={SANDBOX_DOCUMENT_MENU}
        notificationItems={SANDBOX_NOTIFICATIONS}
        messageCount={3}
      />

      {/* Notifications Box (ELK). Схлопнута, пока сообщений нет — в макете у
          неё высота 0, а не пустой отступ. */}
      {notifications && (
        <div data-slot="sandbox-notifications" className="w-full">
          {notifications}
        </div>
      )}

      {/* Canvas → Grid. Хвост страницы 40 снизу, поле сетки — сверху 40. */}
      <div data-slot="sandbox-canvas" className="flex w-full flex-1 justify-center">
        <div
          data-slot="sandbox-grid"
          className="flex flex-col gap-8 py-10"
          style={{ width: GRID_WIDTH }}
        >
          <div className="flex flex-col gap-6">
            {title}
            {additional}
            {children != null && (
              <div
                data-slot="sandbox-blocks"
                className="flex flex-col"
                style={{ gap: blockGap }}
              >
                {children}
              </div>
            )}
          </div>

          {bottomBar}
        </div>
      </div>
    </div>
  )
}

/**
 * Ряд колонок сетки. `widths` — доли в колонках; на узком окне ряд
 * складывается в столбец, потому что 12 колонок ниже 1200 уже не живут.
 */
function SandboxColumns({
  widths,
  gap = 24,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { widths: number[]; gap?: number }) {
  const items = React.Children.toArray(children)

  return (
    <div
      data-slot="sandbox-columns"
      className={cn("flex w-full items-start", className)}
      style={{ gap }}
      {...props}
    >
      {items.map((child, index) => (
        <div
          key={index}
          className="min-w-0 shrink-0"
          style={{ width: span(widths[index] ?? 12) }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export { SandboxPage, SandboxColumns, span }
export type { SandboxPageProps }
