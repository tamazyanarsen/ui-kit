import * as React from "react"

import { cn } from "@/lib/utils"
import { Grid, GridCol, GridRoot, GridRow } from "@/components/ui/grid"
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
// Контентная сетка теперь не своя, а общая — `GridRoot`/`Grid`/`GridRow` из
// кита (см. components/ui/grid). Раньше ширина полосы жила здесь литералом
// `clamp(1200, 100vw − 80, 1800)`, и про порог 1280 («ниже — общая
// прокрутка», замечание 35) шелл не знал вовсе: полоса упиралась в 1200 и
// молча уезжала под левый край, потому что переполнение центрированного
// флекс-контейнера не прокручивается. `GridRoot` чинит именно это.
//
// Почему шелл, а не компонент кита: `ELK / title-page` в ките ЕСТЬ (это
// `TitleCard` / `TitleRegistry`), а вот сам конструктор, `Additional Page
// Element` и `Bottom Bar Element` — элементы страницы, а не кита, и в карту
// компонентов не входят намеренно. Держим их здесь, рядом с экранами, и
// наружу не экспортируем.

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
    <GridRoot
      data-slot="sandbox-page"
      className={cn("min-h-screen bg-[var(--grey-109)]", className)}
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
      <div data-slot="sandbox-canvas" className="flex w-full flex-1">
        <Grid data-slot="sandbox-grid" className="flex flex-col gap-8 py-10">
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
        </Grid>
      </div>
    </GridRoot>
  )
}

/**
 * Ряд колонок сетки. `widths` — доли в колонках.
 *
 * Тонкая обёртка над `GridRow`/`GridCol`: экранам удобнее один проп
 * `widths={[7, 5]}`, чем два вложенных компонента на каждый ряд.
 */
function SandboxColumns({
  widths,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { widths: number[] }) {
  const items = React.Children.toArray(children)

  return (
    <GridRow data-slot="sandbox-columns" className={className} {...props}>
      {items.map((child, index) => (
        <GridCol key={index} span={widths[index] ?? 12}>
          {child}
        </GridCol>
      ))}
    </GridRow>
  )
}

export { SandboxPage, SandboxColumns }
export type { SandboxPageProps }
