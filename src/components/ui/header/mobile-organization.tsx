import * as React from "react"

import { Briefcase, Check, LogOut } from "@/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownItem } from "@/components/ui/dropdown"
import { Item } from "@/components/ui/item"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { Thumbnail } from "@/components/ui/thumbnail"

import type { ProfileMenuOrganization } from "./profile-menu-blocks"

// Организация в мобильном меню шапки (Правки UI-Kit от 25.10).
//
// Вместо серой карточки с выпадающим списком (так было, повторяя десктоп) —
// стандартная мобильная строка `Item` во всю ширину панели: значок
// организации в сером квадрате 40, название, контактное лицо комментарием и
// шеврон вниз. Шеврон не поворачивается: строка не раскрывает список, а
// открывает штору «Мои организации (N)» поверх раскрытого меню. В шторе —
// организации строками списка кита и две кнопки L в подвале: «Профиль и
// настройки» и под ней через 16 «Выйти». Меню под шторой остаётся открытым.

interface MobileOrganizationProps {
  organizations: ProfileMenuOrganization[]
  value?: string
  onValueChange?: (id: string) => void
  contactPerson?: React.ReactNode
  showSettings?: boolean
  showLogout?: boolean
  onSettingsClick?: () => void
  /** Прежнее подтверждение выхода — его открывает шапка. */
  onLogoutClick?: () => void
}

function MobileOrganization({
  organizations,
  value,
  onValueChange,
  contactPerson,
  showSettings = true,
  showLogout = true,
  onSettingsClick,
  onLogoutClick,
}: MobileOrganizationProps) {
  const [open, setOpen] = React.useState(false)
  const active =
    organizations.find((org) => org.id === value) ?? organizations[0]

  return (
    <>
      <div data-slot="header-mobile-org" className="w-full">
        <Item
          // Квадрат 40 Grey 106 со значком 24 — `Thumbnail` Grey Icon.
          thumbnail={
            <Thumbnail
              type="icon"
              icon={<Briefcase size={24} aria-hidden="true" className="size-6" />}
            />
          }
          value={active?.name}
          comment={contactPerson}
          // Шеврон вниз без поворота: `open` строке не передаётся.
          rightElement="select"
          divider={false}
          onClick={() => setOpen(true)}
        />
      </div>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent size="m" data-slot="header-org-sheet">
          <ModalHeader>
            <ModalTitle>Мои организации ({organizations.length})</ModalTitle>
          </ModalHeader>
          <ModalBody className="px-0">
            <OrganizationRows
              organizations={organizations}
              value={active?.id}
              onSelect={(id) => {
                onValueChange?.(id)
                setOpen(false)
              }}
            />
          </ModalBody>
          {(showSettings || showLogout) && (
            // Порядок детей подвала — [вторичная, основная]: на телефоне он
            // ставит основную сверху (см. ModalFooter), между ними 16.
            <ModalFooter>
              {showLogout && (
                <Button
                  variant="secondary-grey"
                  size="lg"
                  icon={LogOut}
                  onClick={() => {
                    setOpen(false)
                    onLogoutClick?.()
                  }}
                >
                  Выйти
                </Button>
              )}
              {showSettings && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setOpen(false)
                    onSettingsClick?.()
                  }}
                >
                  Профиль и настройки
                </Button>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

/**
 * Организации строками списка кита (`DropdownItem`): название P1 Mobile
 * 14/20, под ним через 8 (а не через 4) «ИНН … • роль» P3 Grey 284; поля 16,
 * строка 76; у текущей — галка 16 справа по верху строки (в 18 от верха:
 * поле 16 плюс 2 до середины первой строки).
 *
 * Обе строки текста и галка лежат внутри `text` одной обёрткой: так раскладка
 * не зависит от того, как `DropdownItem` раскладывает свои `text` и
 * `description`, и сжимается при нажатии одним целым.
 */
function OrganizationRows({
  organizations,
  value,
  onSelect,
}: {
  organizations: ProfileMenuOrganization[]
  value?: string
  onSelect: (id: string) => void
}) {
  return (
    <div role="radiogroup" aria-label="Мои организации" className="flex flex-col">
      {organizations.map((org) => {
        const checked = org.id === value
        return (
          <DropdownItem
            key={org.id}
            role="radio"
            aria-checked={checked}
            tabIndex={0}
            data-slot="header-org-sheet-item"
            onClick={() => onSelect(org.id)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return
              event.preventDefault()
              onSelect(org.id)
            }}
            className="focus-visible:focus-ring-inset"
            text={
              <span className="flex w-full items-start gap-2">
                <span className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-p1-medium-mobile [overflow-wrap:anywhere] text-[var(--header-fg)]">
                    {org.name}
                  </span>
                  <span className="text-p3-medium-mobile [overflow-wrap:anywhere] text-[var(--header-meta-fg)]">
                    ИНН {org.inn} • {org.role}
                  </span>
                </span>
                <Check
                  aria-hidden="true"
                  data-slot="header-org-sheet-check"
                  className={cn(
                    "mt-0.5 size-4 shrink-0 text-[var(--header-check-fg)]",
                    !checked && "invisible"
                  )}
                />
              </span>
            }
          />
        )
      })}
    </div>
  )
}

export { MobileOrganization }
export type { MobileOrganizationProps }
