import type { HeaderDocumentMenuItem } from "@/components/ui/header"
import type { NotificationMenuItem } from "@/components/ui/header"
import type { ProfileMenuOrganization } from "@/components/ui/header"

// Наполнение шапки, общее для всех песочных экранов. Отдельным модулем,
// потому что на всех тринадцати эталонах шапка одна и та же: организация
// «ООО "Длинное название организации"», контакт «Константинопольский К. К.»,
// три непрочитанных письма и два уведомления. Разъехавшаяся между экранами
// шапка сразу читалась бы как разные продукты.

const SANDBOX_ORGANIZATIONS: ProfileMenuOrganization[] = [
  {
    id: "main",
    name: 'ООО "Длинное название организации"',
    inn: "1655396531",
    role: "Уполномоченный сотрудник",
  },
  {
    id: "stroy",
    name: "ООО «Северострой»",
    inn: "7701234522",
    role: "Оператор",
  },
  {
    id: "progress",
    name: "ООО «Прогресс»",
    inn: "7701234578",
    role: "Бухгалтер",
  },
]

const SANDBOX_NOTIFICATIONS: NotificationMenuItem[] = [
  {
    id: "1",
    title: "Заявка на выдачу транша №2781",
    status: "На рассмотрении",
    org: 'ООО "Длинное название организации"',
    timestamp: "26.05.2026 в 11:20:04",
    description: "Изменился статус «Черновик» → «На рассмотрении»",
    viewed: false,
  },
  {
    id: "2",
    title: "Поступление",
    status: "+280 000,00 ₽",
    org: 'ООО "Длинное название организации"',
    timestamp: "25.05.2026 в 09:12:47",
    description: "Начисление процентов по депозиту",
    viewed: true,
  },
]

const SANDBOX_DOCUMENT_MENU: HeaderDocumentMenuItem[] = [
  { value: "statements", label: "Выписки" },
  { value: "acts", label: "Акты" },
  { value: "contracts", label: "Договоры" },
]

export { SANDBOX_DOCUMENT_MENU, SANDBOX_NOTIFICATIONS, SANDBOX_ORGANIZATIONS }
