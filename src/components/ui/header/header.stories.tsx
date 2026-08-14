import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"
import {
  CREATE_ITEMS,
  MENU_BANNERS,
  MENU_FAVOURITES,
  MENU_GROUPS,
} from "@/stories/menu-fixtures"

import { Header } from "./header"
import type { HeaderNavItem, HeaderProps } from "./header"
import type { ProfileMenuOrganization } from "./profile-menu"
import type { NotificationMenuItem } from "./notification-menu"

// В макете (`Menu Header (ELK)`, нода 70303:48974) пункты навигации —
// плоские, без собственных выпадающих списков: раскрывается только кнопка
// «Меню». Поэтому здесь их ровно столько же и в том же порядке.
const NAV_ITEMS: HeaderNavItem[] = [
  { value: "payments", label: "Платежи", active: true },
  { value: "accounts", label: "Счета" },
  { value: "statements", label: "Операции и выписки" },
  { value: "business-cards", label: "Бизнес-карты" },
  { value: "deposits", label: "Депозиты" },
  { value: "certificates", label: "Справки" },
  { value: "letters", label: "Письма в банк" },
  { value: "help", label: "Помощь" },
  { value: "payroll", label: "Зарплатный проект" },
  { value: "sbp-qr", label: "QR-коды СБП" },
]

const ORGS: ProfileMenuOrganization[] = [
  {
    id: "1",
    name: "ИП Константинопольский Константин Константинович",
    inn: "7701234511",
    role: "Уполномоченный сотрудник",
  },
  { id: "2", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
  { id: "3", name: "ООО «Чекап»", inn: "7701234541", role: "Казначей" },
  { id: "4", name: "ООО «Внешние системы»", inn: "7701234515", role: "Наблюдатель" },
  { id: "5", name: "ООО «Северсталь»", inn: "7701234503", role: "Казначей" },
  { id: "6", name: "ООО «Чекало»", inn: "7701234556", role: "Оператор" },
  { id: "7", name: "ООО «Прогресс»", inn: "7701234578", role: "Бухгалтер" },
]

const NOTIFICATIONS: NotificationMenuItem[] = [
  {
    id: "1",
    title: "Платежное поручение №21",
    status: "Исполнена",
    org: "ООО «Прекрасная компания»",
    timestamp: "12.07.2022 в 15:35:21",
    description: "Изменился статус «В обработке» → «Исполнено»",
    viewed: false,
  },
  {
    id: "2",
    title: "Поступление",
    status: "+20 000,00 ₽",
    org: "ООО «Прекрасная компания»",
    timestamp: "12.07.2022 в 15:35:21",
    description: "Новое поступление от: Смирнова Михаил Юрьевич",
    viewed: true,
  },
]

const DOCUMENT_MENU_ITEMS = [
  { value: "statements", label: "Выписки" },
  { value: "acts", label: "Акты" },
  { value: "contracts", label: "Договоры" },
]

/* Дизайн-чек №17 («здесь и далее везде»): вместо четырёх JSON-редакторов
   (navItems / notificationItems / organizations / documentMenuItems) —
   счётчики и переключатели, которые режут те же демо-наборы. Заодно
   организация и «избранное» живут в состоянии обёртки, иначе переключатель
   организаций и звёзды в раскрытом меню были бы неинтерактивны. */
type PlaygroundArgs = Omit<
  HeaderProps,
  | "navItems"
  | "notificationItems"
  | "organizations"
  | "documentMenuItems"
  | "menuGroups"
  | "menuBanners"
  | "createItems"
  | "favourites"
  | "onFavouriteToggle"
  | "organizationId"
  | "onOrganizationChange"
  | "className"
> & {
  navItemCount: number
  notificationCount: number
  organizationCount: number
  documentMenuItemCount: number
  menuGroupCount: number
  menuBannerCount: number
  createItemCount: number
  withFavourites: boolean
}

function HeaderDemo({
  navItemCount = NAV_ITEMS.length,
  notificationCount = NOTIFICATIONS.length,
  organizationCount = 3,
  documentMenuItemCount = 1,
  menuGroupCount = MENU_GROUPS.length,
  menuBannerCount = MENU_BANNERS.length,
  createItemCount = CREATE_ITEMS.length,
  withFavourites = true,
  ...props
}: Partial<PlaygroundArgs>) {
  const orgs = ORGS.slice(0, Math.max(1, organizationCount))
  const [organizationId, setOrganizationId] = useState(orgs[0].id)
  const [favourites, setFavourites] = useState(MENU_FAVOURITES)

  return (
    <Header
      {...props}
      navItems={NAV_ITEMS.slice(0, navItemCount)}
      notificationItems={NOTIFICATIONS.slice(0, notificationCount)}
      documentMenuItems={DOCUMENT_MENU_ITEMS.slice(0, documentMenuItemCount)}
      menuGroups={MENU_GROUPS.slice(0, menuGroupCount)}
      menuBanners={MENU_BANNERS.slice(0, menuBannerCount)}
      createItems={CREATE_ITEMS.slice(0, createItemCount)}
      favourites={favourites}
      onFavouriteToggle={
        withFavourites
          ? (value) =>
              setFavourites((prev) =>
                prev.includes(value)
                  ? prev.filter((item) => item !== value)
                  : [...prev, value]
              )
          : undefined
      }
      onCustomiseFavourites={withFavourites ? () => {} : undefined}
      organizations={orgs}
      organizationId={orgs.some((org) => org.id === organizationId) ? organizationId : orgs[0].id}
      onOrganizationChange={setOrganizationId}
    />
  )
}

const meta = {
  title: "Компоненты/Header",
  component: HeaderDemo,
  parameters: { layout: "fullscreen" },
  argTypes: {
    type: { control: "inline-radio", options: ["client", "employee", "sign-out"] },
    clientHeaderType: {
      control: "inline-radio",
      options: ["client", "client-without-account", "client-is-blocked"],
    },
    messageCount: { control: { type: "number", min: 0, max: 99 } },
    contactPerson: { control: "text" },
    employeeName: { control: "text" },
    phoneNumber: { control: "text" },
    showMenu: { control: "boolean" },
    showOrgSettings: { control: "boolean" },
    sidebarOpen: { control: "boolean" },
    navItemCount: {
      control: { type: "range", min: 0, max: NAV_ITEMS.length, step: 1 },
      description: "Сколько пунктов навигации; лишние уезжают в «Ещё»",
    },
    notificationCount: {
      control: { type: "range", min: 0, max: NOTIFICATIONS.length, step: 1 },
      description: "Уведомлений в колокольчике",
    },
    organizationCount: {
      control: { type: "range", min: 1, max: ORGS.length, step: 1 },
      description: "1 — карточка без переключателя, 7+ — со поиском",
    },
    documentMenuItemCount: {
      control: { type: "range", min: 0, max: DOCUMENT_MENU_ITEMS.length, step: 1 },
      description: "0 — плитка «Документы» не показывается",
    },
    menuGroupCount: {
      control: { type: "range", min: 0, max: MENU_GROUPS.length, step: 1 },
      description: "Групп разделов в панели, которая раскрывается по «Меню»",
    },
    menuBannerCount: {
      control: { type: "range", min: 0, max: MENU_BANNERS.length, step: 1 },
      description: "Баннеров в раскрытом меню навигации",
    },
    createItemCount: {
      control: { type: "range", min: 0, max: CREATE_ITEMS.length, step: 1 },
      description: "Плиток в панели, которая раскрывается по «Создать»",
    },
    withFavourites: {
      control: "boolean",
      description: "Звёзды «в избранное» и кнопка «Настроить избранное»",
    },
  },
  args: {
    type: "client",
    clientHeaderType: "client",
    navItemCount: 8,
    notificationCount: NOTIFICATIONS.length,
    organizationCount: 3,
    documentMenuItemCount: 1,
    menuGroupCount: MENU_GROUPS.length,
    menuBannerCount: MENU_BANNERS.length,
    createItemCount: CREATE_ITEMS.length,
    withFavourites: true,
    messageCount: 3,
    contactPerson: "Константинопольский К. К.",
    showOrgSettings: true,
    sidebarOpen: false,
    employeeName: "Константинопольский К. К.",
    phoneNumber: "8 800 700-87-83",
    showMenu: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

/* Header is a full-width bar with portalled menus, so a matrix of cells
   would be unreadable — each type gets its own full-width canvas instead. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase className="p-0">
      <StorySection
        title="Клиент"
        description="Тип по умолчанию: две полосы по 64px, кнопки «Меню» и «Создать», плоские пункты навигации."
      >
        <div className="w-full">
          <HeaderDemo type="client" navItemCount={8} />
        </div>
      </StorySection>

      <StorySection
        title="Клиент без счёта"
        description="Урезанная навигация, одна организация, без кнопки «Создать»."
      >
        <div className="w-full">
          <HeaderDemo
            type="client"
            clientHeaderType="client-without-account"
            navItemCount={4}
            organizationCount={1}
            documentMenuItemCount={0}
          />
        </div>
      </StorySection>

      <StorySection title="Клиент заблокирован" description="Только логотип и переключатель организаций.">
        <div className="w-full">
          <HeaderDemo
            type="client"
            clientHeaderType="client-is-blocked"
            organizationCount={1}
          />
        </div>
      </StorySection>

      <StorySection title="Сотрудник банка">
        <div className="w-full">
          <HeaderDemo type="employee" showMenu employeeName="Константинопольский К. К." />
        </div>
      </StorySection>

      <StorySection title="Незалогиненный (Sign out)">
        <div className="w-full">
          <HeaderDemo type="sign-out" phoneNumber="8 800 700-87-83" />
        </div>
      </StorySection>

      <StorySection
        title="Пустое избранное"
        description="Пункты нижнего ряда — это избранные разделы. Пока их нет, вместо них стоит подсказка (вариант Size=None)."
      >
        <div className="w-full">
          <HeaderDemo type="client" navItemCount={0} />
        </div>
      </StorySection>

      <StorySection
        title="Узкий контейнер"
        description="Пункты навигации, которые не поместились, уезжают в меню «Ещё» — единственный пункт с шевроном."
      >
        <div className="w-full max-w-md">
          <HeaderDemo type="client" organizationCount={1} documentMenuItemCount={0} />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
