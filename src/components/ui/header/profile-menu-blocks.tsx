import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Divider } from "@/components/ui/divider"
import { Scrollbar } from "@/components/ui/scrollbar"
import { Admin, Check, LogOut } from "@/icons"
import { cn } from "@/lib/utils"

// Содержимое меню профиля: карточка единственной организации, список
// организаций и блок настроек. Вынесено из `profile-menu.tsx` — там остаётся
// сам компонент с поиском и выбором раскладки.

interface ProfileMenuOrganization {
  id: string
  name: string
  inn: string
  role: string
}

/**
 * Общая раскладка пункта меню — и у организации, и у действий внизу.
 *
 * Метрики из мастера `Profile Menu (ELK)`: панель без
 * собственных полей, поля несёт сама строка `Menu Point (ELK)` — `p-16`
 * у действий и `pl-32 pr-16 py-16` у организаций (см. ORG_ITEM ниже), gap 8,
 * `items-start`. Поэтому строка тянется во всю ширину панели и подсветка
 * идёт от края до края — скругления у неё нет.
 *
 * Подсветка — ДВУМЯ селекторами, как у Dropdown кита: `data-highlighted`
 * ставит Base UI (клавиатура и наведение), а `hover:` нужен, когда
 * наведение подсветку не ставит — при поиске организаций у меню
 * `highlightItemOnHover={false}`, иначе фокус уходил из поля (аудит 14).
 */
const MENU_ITEM =
  "flex w-full cursor-default items-start gap-2 p-4 outline-none select-none hover:bg-[var(--header-item-hover-bg)] data-highlighted:bg-[var(--header-item-hover-bg)]"

/**
 * Строка организации.
 *
 * Дизайн-чек Storybook (Аня Багрова) №3: «паддинг от левой границы до текста
 * должен быть 32 px, а не 16 px» — в мастере строки списка организаций
 * действительно сдвинуты внутрь: `pl-[32px] pr-[16px]`,
 * в отличие от «Профиля и настроек» и «Выйти», у которых `p-[16px]`.
 */
const ORG_ITEM = "pl-8 pr-4"

/** Единственная организация — статичная карточка без поиска и списка. */
function SingleOrganization({
  organization,
}: {
  organization?: ProfileMenuOrganization
}) {
  return (
    <div className="flex flex-col gap-0.5 p-4">
      <span className="text-p1-medium text-[var(--header-fg)]">
        {organization?.name}
      </span>
      {/* У ProfileMenuElk для строки «ИНН ... • Оператор» подтверждён
          Object Sans Medium. */}
      <span className="text-p3-medium text-[var(--header-meta-fg)]">
        ИНН {organization?.inn} · {organization?.role}
      </span>
    </div>
  )
}

function OrganizationList({
  organizations,
  value,
  onValueChange,
}: {
  organizations: ProfileMenuOrganization[]
  value: string
  onValueChange?: (id: string) => void
}) {
  return (
    // Макет кладёт внутрь этого списка `ELK / scrollbar` (дорожка 4px,
    // радиус 2px, отступ 8px), а это и есть то, что рисует Scrollbar
    // кита.
    //
    // Выбор организации — радиогруппа меню (`menuitemradio` +
    // `aria-checked`), а не простые пункты: галочка под `aria-hidden`
    // была единственным признаком выбранной, и скринридер не отличал её от
    // остальных. Группа рисуется самим Scrollbar, чтобы не вставлять лишнюю
    // обёртку в его flex-колонку.
    <MenuPrimitive.RadioGroup
      value={value}
      onValueChange={(next: string) => onValueChange?.(next)}
      aria-label="Мои организации"
      render={<Scrollbar inset="dropdown" className="flex max-h-100 flex-col" />}
    >
      {organizations.map((org) => (
        <MenuPrimitive.RadioItem
          key={org.id}
          value={org.id}
          // У радиопункта Base UI по умолчанию меню не закрывается — а выбор
          // организации, как и раньше, его закрывает.
          closeOnClick
          data-slot="profile-menu-org-item"
          className={cn(MENU_ITEM, ORG_ITEM, "justify-between")}
        >
          <span className="flex min-w-0 flex-col">
            {/* Дизайн-чек Storybook (Аня Багрова) №5: «наименование
                организации не должно обрезаться; если не помещается в две
                [строки], то применяется коллапс». В мастере название —
                многострочный абзац с переносом по словам, а не одна
                обрезаемая строка. */}
            <span className="min-w-0 line-clamp-2 text-p1-medium break-words text-[var(--header-fg)]">
              {org.name}
            </span>
            <span className="min-w-0 truncate text-p3-medium text-[var(--header-meta-fg)]">
              ИНН {org.inn} · {org.role}
            </span>
          </span>
          {org.id === value && (
            <Check
              aria-hidden="true"
              className="size-6 shrink-0 text-[var(--header-check-fg)]"
            />
          )}
        </MenuPrimitive.RadioItem>
      ))}
      {/* Отдельного кадра «ничего не найдено» для Profile Menu в макете
          нет; текст совпадает с пустым состоянием Select и Dropdown, а там
          это Object Sans Medium, а не Regular, несмотря на приглушённый
          цвет. */}
      {organizations.length === 0 && (
        <p className="px-4 py-4 text-center text-p2-medium text-[var(--header-meta-fg)]">
          Ничего не найдено
        </p>
      )}
    </MenuPrimitive.RadioGroup>
  )
}

/** «Профиль и настройки» + «Выйти» — по спецификации один опциональный блок. */
function SettingsBlock({
  showSettings = true,
  showLogout = true,
  onSettingsClick,
  onLogoutClick,
}: {
  showSettings?: boolean
  showLogout?: boolean
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}) {
  return (
    <>
      {/* Макет отделяет блок настроек настоящим инстансом
          `ELK / divider`, а не рамкой на самом блоке. */}
      <Divider />
      <div className="flex flex-col">
        {showSettings && (
        <MenuPrimitive.Item
          data-slot="profile-menu-settings-item"
          onClick={onSettingsClick}
          className={cn(MENU_ITEM, "text-p1-medium text-[var(--header-fg)]")}
        >
          {/* Дизайн-чек Storybook (Аня Багрова) №4: «должна быть icon /admin
              из Library Image» — в мастере у этой строки
              действительно `icon / admin`, а не шестерёнка настроек. */}
          <Admin size={24} aria-hidden="true" className="size-6 shrink-0" />
          Профиль и настройки
        </MenuPrimitive.Item>
        )}
        {showLogout && (
        <MenuPrimitive.Item
          data-slot="profile-menu-logout-item"
          onClick={onLogoutClick}
          className={cn(
            MENU_ITEM,
            "text-p1-medium text-[var(--header-logout-fg)]"
          )}
        >
          <LogOut size={24} aria-hidden="true" className="size-6 shrink-0" />
          Выйти
        </MenuPrimitive.Item>
        )}
      </div>
    </>
  )
}

export { MENU_ITEM, OrganizationList, SettingsBlock, SingleOrganization }
export type { ProfileMenuOrganization }

