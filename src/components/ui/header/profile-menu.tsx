import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { Briefcase, ChevronDown, Search } from "@/icons"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import { HeaderMenuPopup } from "./menu-popup"
import {
  OrganizationList,
  SettingsBlock,
  SingleOrganization,
  type ProfileMenuOrganization,
} from "./profile-menu-blocks"

// Profile Menu — переключатель организаций в шапке (у него в макете своя
// таблица свойств, отдельная от таблицы Header). Раскладку определяет одна
// только длина `organizations`: 1 — статичная карточка «One» без поиска и
// без заголовка списка (по собственному примечанию макета интерфейс
// переключения появляется только тогда, когда есть между чем
// переключаться); 2–6 — обычный список («Two — Six»); 7 и больше — список с
// полем поиска, фильтрующим на лету («Seven and More» и «Search»: макет
// рисует их двумя состояниями, но «Search» — это тот же «Seven and More» с
// набранным запросом, а не отдельный режим). «Профиль и настройки» и
// «Выйти» включаются одним флагом `showSetting`: по подписи в макете,
// повторённой у каждого варианта, это «единый опциональный элемент».
interface ProfileMenuProps {
  organizations: ProfileMenuOrganization[]
  value: string
  onValueChange?: (id: string) => void
  contactPerson?: React.ReactNode
  showSetting?: boolean
  /**
   * Показывать «Выйти». По умолчанию следует за `showSetting` — в макете это
   * один опциональный блок. Шапка включает его всегда: у клиента это
   * единственный путь выхода, и `showOrgSettings={false}` прятал его вместе
   * с «Профилем и настройками».
   */
  showLogout?: boolean
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  className?: string
}

/** С этого числа организаций в списке появляется поиск. */
const SEARCH_THRESHOLD = 7

/** Клавиши, которые поле поиска пропускает к меню: закрытие и переход в список. */
const MENU_KEYS = new Set(["Escape", "ArrowDown", "ArrowUp"])

/** Плитка-триггер: организация, контактное лицо и шеврон. */
function ProfileMenuTrigger({
  organization,
  contactPerson,
  className,
}: {
  organization?: ProfileMenuOrganization
  contactPerson?: React.ReactNode
  className?: string
}) {
  return (
    <MenuPrimitive.Trigger
      render={
        <button
          type="button"
          data-slot="profile-menu-trigger"
          className={cn(
            // h-16 вместо py-1: в Figma `Profile Client (ELK)` — плитка
            // 304×64, такая же по высоте, как остальные в `Panel`.
            //
            // Дизайн-чек №3 №12: «нет макс ширины… элемент должен иметь
            // макс ширину, она уже есть в ките, унаследовать». Ширина
            // раньше шла по контенту, и длинное название организации
            // распирало плитку до края шапки. В мастере она ограничена
            // теми же 304px, а название обрезается многоточием — что
            // `truncate` на подписях уже умеет, ему не хватало только
            // предела у самой плитки.
            //
            // Заливки на наведении нет: у `Profile Client Header (ELK)` в
            // Hover фон прозрачен, меняется только цвет
            // названия и знаков — его дают `group-hover` ниже.
            "group flex h-16 max-w-[304px] min-w-0 cursor-pointer items-center gap-4 px-4 text-left outline-none focus-visible:focus-ring transition-colors",
            className
          )}
        />
      }
    >
      <span className="flex min-w-0 items-center gap-3">
        {/* Дизайн-чек №3 №12: «Некорректная иконка». В шапке кейс идёт
            24px-начертанием (`icon / company` — контурный кейс с двумя
            полосами); без `size={24}` сюда подставлялся 16px-рисунок с
            центральной защёлкой, растянутый до 24. */}
        <Briefcase
          size={24}
          aria-hidden="true"
          className="size-6 shrink-0 text-[var(--header-icon-fg)] group-hover:text-[var(--header-hover-fg)]"
        />
        <span className="flex min-w-0 flex-col">
          <span className="min-w-0 truncate text-p1-medium text-[var(--header-fg)] group-hover:text-[var(--header-hover-fg)]">
            {organization?.name}
          </span>
          {contactPerson && (
            // У подзаголовка «ИНН ... • Оператор» в ProfileMenuElk
            // подтверждено Object Sans Medium (P3 Medium), а не Regular,
            // для этой второстепенной строки.
            <span className="min-w-0 truncate text-p3-medium text-[var(--header-meta-fg)]">
              {contactPerson}
            </span>
          )}
        </span>
      </span>
      {/* Дизайн-чек Storybook (Аня Багрова) №1: «при hover иконка чемодана и
          наименование организации окрашиваются в Blue 254… шеврон остаётся
          Grey 1514». Проверено по ассетам состояний `Profile Client Header
          (ELK)`: SVG шеврона в Default и Hover
          один и тот же, брендовыми становятся только кейс и название. */}
      <ChevronDown
        aria-hidden="true"
        className="size-4 shrink-0 text-[var(--header-icon-fg)] transition-transform group-data-popup-open:rotate-180"
      />
    </MenuPrimitive.Trigger>
  )
}

function ProfileMenu({
  organizations,
  value,
  onValueChange,
  contactPerson,
  showSetting = true,
  showLogout = showSetting,
  onSettingsClick,
  onLogoutClick,
  className,
}: ProfileMenuProps) {
  const [query, setQuery] = React.useState("")
  const activeOrg =
    organizations.find((org) => org.id === value) ?? organizations[0]
  const isSingle = organizations.length <= 1
  const showSearch = organizations.length >= SEARCH_THRESHOLD
  const isSearching = showSearch && query.trim().length > 0
  const filtered = isSearching
    ? organizations.filter((org) =>
        org.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : organizations

  return (
    <MenuPrimitive.Root
      modal={false}
      onOpenChange={(open) => {
        if (!open) setQuery("")
      }}
    >
      <ProfileMenuTrigger
        organization={activeOrg}
        contactPerson={contactPerson}
        className={className}
      />

      {/* Ширина 400 — из мастера `Profile Menu (ELK)`: панель
          `w-[400px]`, скругление 16, universal shadow. Прежние 320 не давали
          длинному названию организации уложиться в две строки. */}
      <HeaderMenuPopup slot="profile-menu-content" className="w-100">
        {isSingle ? (
          <SingleOrganization organization={activeOrg} />
        ) : (
          <>
            {showSearch && (
              <div className="px-4 pt-4 pb-2">
                <Input
                  size="sm"
                  placeholder="Поиск"
                  aria-label="Поиск организации"
                  iconLeft={<Search />}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onClear={() => setQuery("")}
                  // Menu из Base UI слушает keydown на всплывающем окне
                  // ради навигации стрелками и поиска по первым буквам.
                  // Без этого он проглатывает каждое нажатие,
                  // предназначенное полю поиска, вместо того чтобы дать ему
                  // дойти до значения поля.
                  //
                  // ⚠️ Гасятся НЕ все клавиши. Escape и стрелки вверх/вниз
                  // нужны самому меню: раньше поле глотало и их, и при
                  // поиске (7+ организаций) меню нельзя было ни закрыть по
                  // Escape, ни перейти в список стрелкой — выбрать
                  // организацию с клавиатуры было невозможно. Tab остаётся
                  // у поля: иначе меню закрывалось бы, не пустив к крестику
                  // очистки поиска.
                  onKeyDown={(event) => {
                    if (!MENU_KEYS.has(event.key)) event.stopPropagation()
                  }}
                />
              </div>
            )}
            <p className="px-4 pt-4 pb-2 text-p1-medium text-[var(--header-fg)]">
              {isSearching
                ? "Мои организации — результаты поиска"
                : `Мои организации (${organizations.length})`}
            </p>
            <OrganizationList
              organizations={filtered}
              value={value}
              onValueChange={onValueChange}
            />
          </>
        )}

        {(showSetting || showLogout) && (
          <SettingsBlock
            showSettings={showSetting}
            showLogout={showLogout}
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
          />
        )}
      </HeaderMenuPopup>
    </MenuPrimitive.Root>
  )
}

export { ProfileMenu }
export type { ProfileMenuOrganization, ProfileMenuProps }
