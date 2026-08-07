import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Header } from "./header"
import type { HeaderNavItem } from "./header"
import type { ProfileMenuOrganization } from "./profile-menu"
import type { NotificationMenuItem } from "./notification-menu"

const NAV_ITEMS: HeaderNavItem[] = [
  {
    value: "cash",
    label: "Рублёвые операции",
    items: [
      { value: "cash-1", label: "Платежи" },
      { value: "cash-2", label: "Переводы" },
    ],
  },
  { value: "accounts", label: "Счета и карты" },
  { value: "deposits", label: "Депозиты и НСО" },
  { value: "sbp", label: "СБП" },
  { value: "project", label: "Проектное финансирование" },
  { value: "credits", label: "Кредиты" },
  { value: "payroll", label: "Зарплатный проект" },
  { value: "letters", label: "Аккредитивы" },
  { value: "certificates", label: "Справки" },
  { value: "escrow", label: "Эскроу" },
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

function ControlledHeader(
  props: React.ComponentProps<typeof Header> & { organizations?: ProfileMenuOrganization[] }
) {
  const orgs = props.organizations ?? ORGS
  const [organizationId, setOrganizationId] = useState(orgs[1]?.id ?? orgs[0].id)
  return (
    <Header
      {...props}
      organizations={orgs}
      organizationId={organizationId}
      onOrganizationChange={setOrganizationId}
    />
  )
}

const meta = {
  title: "Navigation/Header",
  component: ControlledHeader,
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
    navItems: { control: "object" },
    notificationItems: { control: "object" },
    organizations: { control: "object" },
  },
  args: {
    type: "client",
    navItems: NAV_ITEMS,
    documentMenuItems: [{ value: "statements", label: "Выписки" }],
    messageCount: 3,
    notificationItems: NOTIFICATIONS,
    contactPerson: "Константинопольский К. К.",
  },
} satisfies Meta<typeof ControlledHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/* Header is a full-width bar with portalled menus, so a matrix of cells
   would be unreadable — each type gets its own full-width canvas instead. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase className="p-0">
      <StorySection title="Клиент" description="Тип по умолчанию.">
        <div className="w-full">
          <ControlledHeader
            type="client"
            navItems={NAV_ITEMS}
            documentMenuItems={[{ value: "statements", label: "Выписки" }]}
            messageCount={3}
            notificationItems={NOTIFICATIONS}
            contactPerson="Константинопольский К. К."
          />
        </div>
      </StorySection>

      <StorySection
        title="Клиент без счёта"
        description="Урезанная навигация, одна организация."
      >
        <div className="w-full">
          <ControlledHeader
            type="client"
            clientHeaderType="client-without-account"
            navItems={NAV_ITEMS.slice(2, 6)}
            organizations={[ORGS[1]]}
            contactPerson="Константинопольский К. К."
          />
        </div>
      </StorySection>

      <StorySection title="Клиент заблокирован">
        <div className="w-full">
          <ControlledHeader
            type="client"
            clientHeaderType="client-is-blocked"
            organizations={[ORGS[1]]}
            contactPerson="Константинопольский К. К."
          />
        </div>
      </StorySection>

      <StorySection title="Сотрудник банка">
        <div className="w-full">
          <ControlledHeader
            type="employee"
            showMenu
            employeeName="Константинопольский К. К."
          />
        </div>
      </StorySection>

      <StorySection title="Незалогиненный (Sign out)">
        <div className="w-full">
          <ControlledHeader type="sign-out" phoneNumber="8 800 700-87-83" />
        </div>
      </StorySection>

      <StorySection
        title="Узкий контейнер"
        description="Пункты навигации, которые не поместились, уезжают в меню «Ещё»."
      >
        <div className="w-full max-w-md">
          <ControlledHeader
            type="client"
            navItems={NAV_ITEMS}
            messageCount={3}
            notificationItems={NOTIFICATIONS}
            contactPerson="Константинопольский К. К."
          />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
