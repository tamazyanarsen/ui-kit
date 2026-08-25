// Демонстрационные данные для стенда «таблица по конфигу полей». Один набор
// на Storybook и страницу разработчика; в пакет не попадает — `src/stories`
// вне списка `include` у dts.

interface ContractRow {
  id: string
  code: string
  subject: string
  account: string
  status: "done" | "signing" | "draft" | "rejected"
  payers: string[]
  date: string
  updatedAt: string
  rate: number
  amount: number
  /** Знак валюты живёт при значении: в колонке встречаются и «₽», и «$». */
  unit: string
  amountNote: string
  approved: boolean
  attachments: number
  children?: ContractRow[]
}

const CONTRACTS: ContractRow[] = [
  {
    id: "1",
    code: "Д-1042",
    subject: "Подготовка территории строительства",
    account: "40702 810 7 00590062573",
    status: "done",
    payers: ["ИП Филлимонов Павел Алексеевич"],
    date: "2026-03-12",
    updatedAt: "2026-08-19T14:05:00",
    rate: 12.5,
    amount: -10000000,
    unit: "₽",
    amountNote: "Списание",
    approved: true,
    attachments: 3,
    children: [
      {
        id: "1.1",
        code: "Д-1042/1",
        subject: "Договор о развитии застроенной территории",
        account: "40702 810 7 00590062573",
        status: "signing",
        payers: ["ООО «ВИЛКА-СТРОЙ»", "ООО «РИС И КУРИЦА»"],
        date: "2026-04-01",
        updatedAt: "2026-08-20T09:40:00",
        rate: 9,
        amount: -2000000,
        unit: "₽",
        amountNote: "Списание",
        approved: false,
        attachments: 1,
        children: [
          {
            id: "1.1.1",
            code: "Д-1042/1-А",
            subject: "Работы и услуги сторонних организаций",
            account: "40702 810 7 00590062573",
            status: "draft",
            payers: [],
            date: "2026-05-18",
            updatedAt: "2026-08-21T18:12:00",
            rate: 0,
            amount: 31922980.05,
            unit: "₽",
            amountNote: "Поступление",
            approved: false,
            attachments: 0,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    code: "Д-1058",
    subject: "Основные объекты строительства",
    account: "40702 810 7 00590062573",
    status: "signing",
    payers: ["ООО «ИВАНОВО-СТРОЙ»", "ООО «ВИЛКА-СТРОЙ»", "АО «ДОМ.РФ»"],
    date: "2026-01-29",
    updatedAt: "2026-08-11T11:00:00",
    rate: 14.25,
    amount: -6000000,
    unit: "₽",
    amountNote: "Списание",
    approved: true,
    attachments: 2,
  },
  {
    id: "3",
    code: "Д-1077",
    subject: "Объекты подсобного и обслуживающего назначения",
    account: "40702 810 7 00590062573",
    status: "rejected",
    payers: ["ИП Воропаев Сергей Владимирович"],
    date: "2026-06-04",
    updatedAt: "2026-08-24T07:30:00",
    rate: 7.9,
    amount: -500000,
    unit: "$",
    amountNote: "Списание",
    approved: false,
    attachments: 0,
  },
]

export { CONTRACTS }
export type { ContractRow }
