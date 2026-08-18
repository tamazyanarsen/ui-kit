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
import type { HeaderProps } from "./header"
import type { ProfileMenuOrganization } from "./profile-menu"
import type { NotificationMenuItem } from "./notification-menu"

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

/* Дизайн-чек №17 («здесь и далее везде»): вместо JSON-редакторов
   (navItems / notificationItems / organizations / documentMenuItems) —
   счётчики и переключатели, которые режут те же демо-наборы.

   Избранное и организация живут в состоянии обёртки: без этого звёзды в
   раскрытом меню, «Настройка избранного» и переключатель организаций были
   бы неинтерактивны. Пункты нижнего ряда сюда не передаются вовсе — они
   считаются из избранного самим Header. */
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
  | "onFavouritesChange"
  | "organizationId"
  | "onOrganizationChange"
  | "className"
> & {
  notificationCount: number
  organizationCount: number
  documentMenuItemCount: number
  menuGroupCount: number
  menuBannerCount: number
  createItemCount: number
  favouriteCount: number
  withFavourites: boolean
}

function HeaderDemo({
  notificationCount = NOTIFICATIONS.length,
  organizationCount = 3,
  documentMenuItemCount = 1,
  menuGroupCount = MENU_GROUPS.length,
  menuBannerCount = MENU_BANNERS.length,
  createItemCount = CREATE_ITEMS.length,
  favouriteCount = MENU_FAVOURITES.length,
  withFavourites = true,
  ...props
}: Partial<PlaygroundArgs>) {
  const orgs = ORGS.slice(0, Math.max(1, organizationCount))
  const [organizationId, setOrganizationId] = useState(orgs[0].id)
  const [favourites, setFavourites] = useState(MENU_FAVOURITES.slice(0, favouriteCount))

  return (
    <Header
      {...props}
      menuGroups={MENU_GROUPS.slice(0, menuGroupCount)}
      menuBanners={MENU_BANNERS.slice(0, menuBannerCount)}
      createItems={CREATE_ITEMS.slice(0, createItemCount)}
      favourites={favourites}
      onFavouritesChange={withFavourites ? setFavourites : undefined}
      notificationItems={NOTIFICATIONS.slice(0, notificationCount)}
      documentMenuItems={DOCUMENT_MENU_ITEMS.slice(0, documentMenuItemCount)}
      organizations={orgs}
      organizationId={orgs.some((org) => org.id === organizationId) ? organizationId : orgs[0].id}
      onOrganizationChange={setOrganizationId}
    />
  )
}

const meta = {
  // Дизайн-чек №3 №11: «соединить компоненты в папку меню». Туда входят
  // Настройка избранного, Раскрытое меню навигации, Раскрытое меню
  // создания и Header — все четыре части одного навигационного узла.
  title: "Компоненты/Меню/Header",
  component: HeaderDemo,
  parameters: { layout: "fullscreen" },
  argTypes: {
    type: { control: "inline-radio", options: ["client", "employee", "sign-out"] },
    clientHeaderType: {
      control: "inline-radio",
      options: ["client", "client-without-account", "client-is-blocked"],
    },
    activeSection: {
      control: "select",
      options: [undefined, ...MENU_FAVOURITES],
      description: "Текущий раздел — подсвечивается в ряду и в раскрытом меню",
    },
    messageCount: { control: { type: "number", min: 0, max: 99 } },
    contactPerson: { control: "text" },
    employeeName: { control: "text" },
    phoneNumber: { control: "text" },
    showMenu: { control: "boolean" },
    showOrgSettings: { control: "boolean" },
    sidebarOpen: { control: "boolean" },
    favouriteCount: {
      control: { type: "range", min: 0, max: MENU_FAVOURITES.length, step: 1 },
      description:
        "Сколько разделов в избранном. Именно избранное и есть пункты нижнего ряда; 0 — подсказка вместо них",
    },
    withFavourites: {
      control: "boolean",
      description: "Звёзды в меню и кнопка «Настроить избранное»",
    },
    notificationCount: {
      control: { type: "range", min: 0, max: NOTIFICATIONS.length, step: 1 },
      description: "Уведомлений в колокольчике",
    },
    organizationCount: {
      control: { type: "range", min: 1, max: ORGS.length, step: 1 },
      description: "1 — карточка без переключателя, 7+ — с поиском",
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
  },
  args: {
    type: "client",
    clientHeaderType: "client",
    activeSection: "payments",
    favouriteCount: MENU_FAVOURITES.length,
    withFavourites: true,
    notificationCount: NOTIFICATIONS.length,
    organizationCount: 3,
    documentMenuItemCount: 1,
    menuGroupCount: MENU_GROUPS.length,
    menuBannerCount: MENU_BANNERS.length,
    createItemCount: CREATE_ITEMS.length,
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
        description="Тип по умолчанию: две полосы по 64px, кнопки «Меню» и «Создать», в нижнем ряду — избранные разделы."
      >
        <div className="w-full">
          <HeaderDemo type="client" activeSection="payments" />
        </div>
      </StorySection>

      <StorySection
        title="Избранное меняется звездой в меню"
        description="Раскройте «Меню» и щёлкните звезду у любого раздела — пункт появится или исчезнет в нижнем ряду сразу же. Кнопка «Настроить избранное» открывает модалку с порядком."
      >
        <div className="w-full">
          <HeaderDemo type="client" favouriteCount={3} activeSection="payments" />
        </div>
      </StorySection>

      <StorySection
        title="Пустое избранное"
        description="Вместо пунктов — подсказка со звездой (вариант Size=None)."
      >
        <div className="w-full">
          <HeaderDemo type="client" favouriteCount={0} />
        </div>
      </StorySection>

      <StorySection
        title="Клиент без счёта"
        description="Урезанное избранное, одна организация, без кнопки «Создать»."
      >
        <div className="w-full">
          <HeaderDemo
            type="client"
            clientHeaderType="client-without-account"
            favouriteCount={4}
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
        title="Узкий контейнер"
        description="Избранное, которое не поместилось, уезжает в меню «Ещё» — единственный пункт с шевроном, брендовый в раскрытом состоянии."
      >
        <div className="w-full max-w-md">
          <HeaderDemo type="client" organizationCount={1} documentMenuItemCount={0} />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
