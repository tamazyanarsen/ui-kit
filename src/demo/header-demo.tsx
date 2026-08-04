import { useState } from "react"

import { Header } from "@/components/ui/header"
import type { HeaderNavItem, HeaderDocumentMenuItem } from "@/components/ui/header"
import type { NotificationMenuItem } from "@/components/ui/header"
import type { ProfileMenuOrganization } from "@/components/ui/header"
import { TopFixedMessage } from "@/components/ui/top-fixed-message"
import { useToast } from "@/components/ui/toast-message"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function subItems(prefix: string) {
  return [
    { value: `${prefix}-1`, label: "Пример пункта 1" },
    { value: `${prefix}-2`, label: "Пример пункта 2" },
  ]
}

const FULL_NAV: HeaderNavItem[] = [
  { value: "cash", label: "Рублёвые операции", items: subItems("cash") },
  { value: "accounts", label: "Счета и карты", items: subItems("accounts") },
  { value: "deposits", label: "Депозиты и НСО", items: subItems("deposits") },
  { value: "sbp", label: "СБП", items: subItems("sbp") },
  { value: "project", label: "Проектное финансирование", items: subItems("project") },
  { value: "credits", label: "Кредиты", items: subItems("credits") },
  { value: "payroll", label: "Зарплатный проект", items: subItems("payroll") },
  { value: "letters", label: "Аккредитивы" },
  { value: "certificates", label: "Справки" },
  { value: "escrow", label: "Эскроу" },
]

const NO_ACCOUNT_NAV: HeaderNavItem[] = [
  { value: "deposits", label: "Депозиты и НСО", items: subItems("deposits") },
  { value: "sbp", label: "СБП", items: subItems("sbp") },
  { value: "project", label: "Проектное финансирование", items: subItems("project") },
  { value: "payroll", label: "Зарплатный проект" },
  { value: "certificates", label: "Справки" },
]

const DOCUMENT_ITEMS: HeaderDocumentMenuItem[] = [
  { value: "statements", label: "Выписки" },
  { value: "certificates", label: "Справки и документы" },
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

const ORGS_ONE: ProfileMenuOrganization[] = [
  { id: "1", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
]

const ORGS_FEW: ProfileMenuOrganization[] = [
  {
    id: "1",
    name: "ИП Константинопольский Константин Константинович",
    inn: "7701234511",
    role: "Уполномоченный сотрудник",
  },
  { id: "2", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
  { id: "3", name: "ООО «Чекап»", inn: "7701234541", role: "Казначей" },
]

const ORGS_MANY: ProfileMenuOrganization[] = [
  ...ORGS_FEW,
  {
    id: "4",
    name: "ООО «ВНЕШНИЕ ИНФОРМАЦИОННЫЕ СИСТЕМЫ»",
    inn: "7701234515",
    role: "Наблюдатель",
  },
  { id: "5", name: "ООО «Северсталь»", inn: "7701234503", role: "Казначей" },
  { id: "6", name: "ООО «Чекало»", inn: "7701234556", role: "Оператор" },
  { id: "7", name: "ООО «Прогресс»", inn: "7701234578", role: "Бухгалтер" },
  { id: "8", name: "ООО «Стройинвест»", inn: "7701234591", role: "Оператор" },
  { id: "9", name: "ООО «Восток-Сервис»", inn: "7701234602", role: "Казначей" },
  { id: "10", name: "ООО «Гарант»", inn: "7701234614", role: "Наблюдатель" },
]

function ClientHeaderExample({
  organizations,
  rowLabel,
}: {
  organizations: ProfileMenuOrganization[]
  rowLabel: string
}) {
  const [orgId, setOrgId] = useState(organizations[0].id)
  const { add } = useToast()

  return (
    <div className="flex flex-col gap-2">
      <RowLabel>{rowLabel}</RowLabel>
      <div className="overflow-hidden rounded-2xl border border-[var(--header-border)]">
        <Header
          type="client"
          navItems={FULL_NAV}
          documentMenuItems={DOCUMENT_ITEMS}
          messageCount={3}
          notificationItems={NOTIFICATIONS}
          organizations={organizations}
          organizationId={orgId}
          contactPerson="Константинопольский К. К."
          onOrganizationChange={(id) => {
            setOrgId(id)
            const org = organizations.find((o) => o.id === id)
            if (org) {
              add({
                type: "checked",
                title: `Вы переключились на организацию ${org.name}`,
              })
            }
          }}
          onLogout={() => add({ type: "information", title: "Вы вышли из личного кабинета" })}
        />
      </div>
    </div>
  )
}

function HeaderDemo() {
  const [narrowOrgId, setNarrowOrgId] = useState(ORGS_FEW[1].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AccordionItem value="header">
      <AccordionTrigger>Header — шапка</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <RowLabel>Client</RowLabel>
            <div className="overflow-hidden rounded-2xl border border-[var(--header-border)]">
              <Header
                type="client"
                navItems={FULL_NAV}
                documentMenuItems={DOCUMENT_ITEMS}
                messageCount={3}
                notificationItems={NOTIFICATIONS}
                organizations={ORGS_FEW}
                organizationId={narrowOrgId}
                contactPerson="Константинопольский К. К."
                onOrganizationChange={setNarrowOrgId}
              />
            </div>
            <TopFixedMessage
              type="red"
              text="Внимание! У вас есть 2 важных уведомления"
              showButton
              buttonLabel="Подробнее"
            />
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Client Without An Account — нет кнопки «Платёж»</RowLabel>
            <div className="overflow-hidden rounded-2xl border border-[var(--header-border)]">
              <Header
                type="client"
                clientHeaderType="client-without-account"
                navItems={NO_ACCOUNT_NAV}
                documentMenuItems={DOCUMENT_ITEMS}
                messageCount={3}
                notificationItems={NOTIFICATIONS}
                organizations={ORGS_ONE}
                contactPerson="Константинопольский К. К."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Client is Blocked — только логотип и организация</RowLabel>
            <div className="overflow-hidden rounded-2xl border border-[var(--header-border)]">
              <Header
                type="client"
                clientHeaderType="client-is-blocked"
                organizations={ORGS_ONE}
                contactPerson="Константинопольский К. К."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Employee — гамбургер + профиль + отдельная кнопка выхода</RowLabel>
            <div className="overflow-hidden rounded-2xl border border-[var(--header-border)]">
              <Header
                type="employee"
                showMenu
                sidebarOpen={sidebarOpen}
                onSidebarOpenChange={setSidebarOpen}
                employeeName="Константинопольский К. К."
                notificationItems={NOTIFICATIONS}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Sign Out — только логотип и телефон поддержки</RowLabel>
            <div className="overflow-hidden rounded-2xl border border-[var(--header-border)]">
              <Header type="sign-out" phoneNumber="8 800 700-87-83" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>
              «Ещё» — пункты уходят в дропдаун по одному, по мере сужения
              контейнера (без привязки к брейкпоинтам)
            </RowLabel>
            <div className="max-w-md overflow-hidden rounded-2xl border border-[var(--header-border)]">
              <Header
                type="client"
                navItems={FULL_NAV}
                documentMenuItems={DOCUMENT_ITEMS}
                messageCount={3}
                notificationItems={NOTIFICATIONS}
                organizations={ORGS_ONE}
                contactPerson="Константинопольский К. К."
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <RowLabel>Profile Menu — One / Two-Six / Seven and More (поиск)</RowLabel>
            <ClientHeaderExample organizations={ORGS_ONE} rowLabel="One" />
            <ClientHeaderExample organizations={ORGS_FEW} rowLabel="Two — Six" />
            <ClientHeaderExample organizations={ORGS_MANY} rowLabel="Seven and More — с поиском" />
          </div>
        </div>

        <p className="mt-6 text-p3 text-muted-foreground">
          Header собирает: логотип, навигацию с overflow-в-«Ещё» (тот же
          механизм, что у Tabs/Switcher), центр уведомлений, счётчик
          сообщений, меню документов, и Profile Menu — переключатель
          организаций с живым поиском при 7+ организациях. «Выйти» (из
          Profile Menu или отдельная иконка у Employee) открывает
          подтверждение через общий компонент Modal; переключение
          организации показывает тост через общий ToastProvider.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { HeaderDemo }
