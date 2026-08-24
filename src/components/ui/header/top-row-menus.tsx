import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { ChevronDown, CircleUser, Settings, Wallet } from "@/icons"
import { cn } from "@/lib/utils"
import { ButtonMenuOverflowItem } from "@/components/ui/button-menu"

import { HEADER_ICON_TILE_ACCENT, HeaderMenuPopup } from "./menu-popup"

// Меню верхней полосы шапки, у которых нет своего файла: «Документы»
// (клиент) и меню сотрудника. Уведомления и профиль организации крупнее и
// живут отдельно — `notification-menu.tsx` и `profile-menu.tsx`.

interface HeaderDocumentMenuItem {
  value: string
  label: React.ReactNode
  onClick?: () => void
}

function DocumentMenu({ items }: { items: HeaderDocumentMenuItem[] }) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            aria-label="Документы"
            // `Wallet (ELK)` — плитка 88×64 (шире соседних 56, потому что
            // несёт иконку + шеврон), поэтому ширина своя, а не из
            // HEADER_ICON_TILE_ACCENT; реакция на курсор — общая для панели.
            className={cn(HEADER_ICON_TILE_ACCENT, "w-22 gap-0.5")}
          />
        }
      >
        <Wallet size={24} aria-hidden="true" className="size-6" />
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
        />
      </MenuPrimitive.Trigger>
      <HeaderMenuPopup slot="header-document-menu-content">
        {items.map((item) => (
          <ButtonMenuOverflowItem
            key={item.value}
            text={item.label}
            onClick={item.onClick}
          />
        ))}
      </HeaderMenuPopup>
    </MenuPrimitive.Root>
  )
}

function EmployeeUserMenu({
  name,
  onSettingsClick,
}: {
  name: React.ReactNode
  onSettingsClick?: () => void
}) {
  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger
        render={
          <button
            type="button"
            // Заливки на наведении нет — у `Profile Employee (ELK)` в Hover
            // (нода 70303:48879) фон прозрачен, брендовыми становятся только
            // подпись и знаки.
            className="group flex h-16 shrink-0 cursor-pointer items-center gap-4 px-4 text-[var(--header-fg)] outline-none transition-colors hover:text-[var(--header-hover-fg)]"
          />
        }
      >
        <span className="flex items-center gap-3">
          {/* `Profile Employee (ELK)` (нода 70303:48874) рисует человека в
              круге, а не кейс: кейс (`icon / company`) стоит в клиентской
              шапке, где подпись — организация, а здесь подпись — ФИО
              сотрудника банка. */}
          <CircleUser size={24} aria-hidden="true" className="size-6" />
          <span className="text-p1-medium">{name}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform group-data-popup-open:rotate-180"
        />
      </MenuPrimitive.Trigger>
      <HeaderMenuPopup slot="header-employee-menu-content">
        <MenuPrimitive.Item
          onClick={onSettingsClick}
          className="flex cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-p1-medium text-[var(--header-fg)] outline-none select-none data-highlighted:bg-[var(--header-item-hover-bg)]"
        >
          <Settings size={24} aria-hidden="true" className="size-6 shrink-0" />
          Профиль и настройки
        </MenuPrimitive.Item>
      </HeaderMenuPopup>
    </MenuPrimitive.Root>
  )
}

export { DocumentMenu, EmployeeUserMenu }
export type { HeaderDocumentMenuItem }
