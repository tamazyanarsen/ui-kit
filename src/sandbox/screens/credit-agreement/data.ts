import type { TableField } from "@/components/ui/table"

// Данные экрана D5 — с эталона 70371:24574.

/** Кредитная линия: лимит и его доли. Сумма долей равна лимиту. */
const LINE = {
  limit: 250_000_000,
  available: 200_000_000,
  frozen: 25_000_000,
  issued: 25_000_000,
}

interface ContractorAgreementRow {
  id: string
  number: string
  contractor: string
  amount: number
  signed: string
  status: string
}

const CONTRACTOR_AGREEMENTS: ContractorAgreementRow[] = [
  {
    id: "1",
    number: "000001–0001/МБ25",
    contractor: "ООО «Северострой»",
    amount: 48_000_000,
    signed: "2026-03-05",
    status: "active",
  },
  {
    id: "2",
    number: "000001–0002/МБ26",
    contractor: "ООО «Металлургический завод»",
    amount: 32_500_000,
    signed: "2026-04-18",
    status: "active",
  },
  {
    id: "3",
    number: "000001–0003/МБ26",
    contractor: "ИП «Иванов Иван Иванович»",
    amount: 12_100_000,
    signed: "2026-05-30",
    status: "closed",
  },
]

const AGREEMENT_FIELDS: TableField<ContractorAgreementRow>[] = [
  { key: "number", title: "Номер договора", width: 240, sortable: true },
  { key: "contractor", title: "Подрядчик", width: 360 },
  { key: "amount", title: "Стоимость работ", type: "money", sortable: true },
  { key: "signed", title: "Дата заключения", type: "date", sortable: true },
  {
    key: "status",
    title: "Статус",
    type: "tag",
    tagLabels: { active: "Действующий", closed: "Закрыт" },
    tagColors: { active: "green", closed: "grey" },
  },
]

interface PaymentRow {
  id: string
  date: string
  principal: number
  interest: number
  amount: number
  status: string
}

const PAYMENTS: PaymentRow[] = [
  { id: "1", date: "2027-07-17", principal: 5_000_000, interest: 412_000, amount: 5_412_000, status: "planned" },
  { id: "2", date: "2027-08-17", principal: 5_000_000, interest: 386_000, amount: 5_386_000, status: "planned" },
  { id: "3", date: "2027-09-17", principal: 5_000_000, interest: 360_000, amount: 5_360_000, status: "planned" },
  { id: "4", date: "2027-10-17", principal: 5_000_000, interest: 334_000, amount: 5_334_000, status: "planned" },
  { id: "5", date: "2027-11-17", principal: 5_000_000, interest: 308_000, amount: 5_308_000, status: "planned" },
]

const PAYMENT_FIELDS: TableField<PaymentRow>[] = [
  { key: "date", title: "Дата платежа", type: "date", width: 200, sortable: true },
  { key: "principal", title: "Основной долг", type: "money" },
  { key: "interest", title: "Проценты", type: "money" },
  { key: "amount", title: "Сумма платежа", type: "money" },
  {
    key: "status",
    title: "Статус",
    type: "tag",
    tagLabels: { planned: "Запланирован", paid: "Оплачен" },
    tagColors: { planned: "blue", paid: "green" },
  },
]

export {
  AGREEMENT_FIELDS,
  CONTRACTOR_AGREEMENTS,
  LINE,
  PAYMENTS,
  PAYMENT_FIELDS,
}
export type { ContractorAgreementRow, PaymentRow }
