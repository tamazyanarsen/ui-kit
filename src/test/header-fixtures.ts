import type { CreateMenuItem, HeaderMenuGroup } from "@/components/ui/header-menu"
import type { HeaderNavItem } from "@/components/ui/header"
import type { ProfileMenuOrganization } from "@/components/ui/header"

// Данные для тестов шапки. Лежат в `src/test`, а не рядом с компонентом:
// каталог не попадает в сборку пакета.

const NAV_ITEMS: HeaderNavItem[] = [
  { value: "cash", label: "Рублёвые операции" },
  { value: "accounts", label: "Счета и карты" },
]

const ORG_ONE: ProfileMenuOrganization[] = [
  { id: "1", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
]

const ORG_MANY: ProfileMenuOrganization[] = [
  { id: "1", name: "ИП Константинопольский", inn: "7701234511", role: "Сотрудник" },
  { id: "2", name: "ООО «Северострой»", inn: "7701234522", role: "Оператор" },
  { id: "3", name: "ООО «Чекап»", inn: "7701234541", role: "Казначей" },
  { id: "4", name: "ООО «Внешние системы»", inn: "7701234515", role: "Наблюдатель" },
  { id: "5", name: "ООО «Северсталь»", inn: "7701234503", role: "Казначей" },
  { id: "6", name: "ООО «Чекало»", inn: "7701234556", role: "Оператор" },
  { id: "7", name: "ООО «Прогресс»", inn: "7701234578", role: "Бухгалтер" },
]

const MENU_GROUPS: HeaderMenuGroup[] = [
  {
    value: "payments",
    title: "Платежи и операции",
    links: [
      { value: "payments", label: "Платежи" },
      { value: "statements", label: "Операции и выписки" },
    ],
  },
  {
    value: "settlement",
    title: "Расчётные продукты",
    links: [{ value: "accounts", label: "Счета" }],
  },
]

const CREATE_ITEMS: CreateMenuItem[] = [
  { value: "payment", label: "Платёж по реквизитам" },
]

export { CREATE_ITEMS, MENU_GROUPS, NAV_ITEMS, ORG_MANY, ORG_ONE }
