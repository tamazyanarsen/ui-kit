import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

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

export const Client: Story = {}

export const ClientWithoutAnAccount: Story = {
  args: {
    clientHeaderType: "client-without-account",
    navItems: NAV_ITEMS.slice(2, 6),
    organizations: [ORGS[1]],
  },
}

export const ClientIsBlocked: Story = {
  args: {
    clientHeaderType: "client-is-blocked",
    organizations: [ORGS[1]],
  },
}

export const Employee: Story = {
  args: {
    type: "employee",
    showMenu: true,
    employeeName: "Константинопольский К. К.",
  },
}

export const SignOut: Story = {
  args: {
    type: "sign-out",
    phoneNumber: "8 800 700-87-83",
  },
}

export const NarrowOverflow: Story = {
  name: "Narrow container — items collapse into «Ещё»",
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
}
