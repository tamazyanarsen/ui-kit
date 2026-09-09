import {
  Briefcase,
  CalendarDays,
  Coins,
  FileIcon,
  FileText,
  Mail,
  Sbp,
  Settings,
  Wallet,
} from "@/icons"

import type { CreateMenuItem, HeaderMenuGroup, MenuBannerProps } from "@/components/ui/header-menu"

// Демо-наполнение раскрытого меню шапки. Живёт отдельным модулем, а не
// внутри истории, потому что нужно сразу двум: и «Раскрытому меню
// навигации»/«создания», и Header, который эти панели раскрывает. Набор
// разделов, баннеров и плиток взят из MENU DOCS (нода 70303:52281).

export const MENU_GROUPS: HeaderMenuGroup[] = [
  {
    value: "payments",
    title: "Платежи и операции",
    icon: <Coins />,
    links: [
      { value: "payments", label: "Платежи" },
      { value: "statements", label: "Операции и выписки" },
      { value: "registries", label: "Реестры платежей" },
      { value: "card-index", label: "Картотеки" },
      { value: "cash", label: "Операции с наличными" },
      { value: "templates", label: "Шаблоны платежей" },
      { value: "counterparties", label: "Контрагенты" },
    ],
  },
  {
    value: "settlement",
    title: "Расчётные продукты",
    icon: <FileText />,
    links: [
      { value: "accounts", label: "Счета" },
      { value: "business-cards", label: "Бизнес-карты" },
      { value: "letters-of-credit", label: "Аккредитивы" },
      { value: "escrow", label: "Эскроу" },
      { value: "digital-rouble", label: "Счёт цифрового рубля" },
    ],
  },
  {
    value: "savings",
    title: "Сбережения и накопления",
    icon: <CalendarDays />,
    links: [
      { value: "deposits", label: "Депозиты" },
      { value: "min-balance", label: "Неснижаемые остатки" },
      { value: "placement", label: "Заявки на размещение средств" },
    ],
  },
  {
    value: "payroll",
    title: "Зарплатный проект",
    icon: <Wallet />,
    links: [
      { value: "payroll-sheets", label: "Зарплатные ведомости" },
      { value: "payroll-cards", label: "Заявки на выпуск зарплатных карт" },
    ],
  },
  {
    value: "credits",
    title: "Кредиты МСБ",
    icon: <Briefcase />,
    links: [
      { value: "credit-agreements", label: "Кредитные договоры" },
      { value: "credit-tranches", label: "Заявки на транши ИЖС-Подряд" },
    ],
  },
  {
    value: "project-finance",
    title: "Проектное финансирование",
    icon: <Briefcase />,
    links: [
      { value: "drawdowns", label: "Заявки на выборку" },
      { value: "works", label: "Договоры выполнения работ" },
      { value: "estimates", label: "Сводно-сметные расчёты" },
      { value: "petitions", label: "Ходатайства" },
      { value: "deal-monitoring", label: "Мониторинг сделок" },
    ],
  },
  {
    value: "sbp",
    title: "СБП",
    icon: <Sbp />,
    links: [
      { value: "sbp-payments", label: "Платежи СБП" },
      { value: "sbp-qr", label: "QR-коды СБП" },
      { value: "sbp-requests", label: "Заявки на подключение к СБП" },
      { value: "sbp-reports", label: "Отчёты по операциям СБП" },
    ],
  },
  {
    value: "bank-support",
    title: "Банковское сопровождение",
    icon: <Settings />,
    links: [{ value: "cost-sheets", label: "Ведомости распределения расходов" }],
  },
  {
    value: "documentary",
    title: "Документарные операции",
    icon: <FileText />,
    links: [{ value: "guarantees", label: "Банковские гарантии" }],
  },
  {
    value: "business-service",
    title: "Обслуживание бизнеса",
    icon: <Mail />,
    links: [
      { value: "certificates", label: "Справки" },
      { value: "letters", label: "Письма в банк" },
      { value: "ausn", label: "Работа с АУСН" },
      { value: "help", label: "Помощь" },
    ],
  },
]

export const MENU_BANNERS: MenuBannerProps[] = [
  {
    title: "Переходите на подпись PayControl",
    subtitle: "Подписывайте любое количество документов на любые суммы",
    buttonLabel: "Перейти к подключению",
    color: "blue",
  },
  {
    title: "Разместите средства и получайте доход",
    subtitle: "Широкий выбор продуктов и условий размещения",
    buttonLabel: "Создать заявку",
    color: "lilac",
  },
  {
    title: "Спецсчёт закупок по 44-ФЗ и 223-ФЗ",
    subtitle: "Откройте за 1 день, обслуживание бесплатно, до 2 % на остаток",
    buttonLabel: "Перейти к открытию",
    color: "green",
  },
]

/**
 * Стартовое избранное — набор «Основная группа клиентов» из комментария
 * «Начально закреплённые наборы» (MENU DOCS, нода 70303:58468), в том же
 * порядке. Он же заполняет нижний ряд шапки на всех макетах.
 */
export const MENU_FAVOURITES = [
  "payments",
  "accounts",
  "statements",
  "business-cards",
  "deposits",
  "certificates",
  "letters",
  "help",
]

export const CREATE_ITEMS: CreateMenuItem[] = [
  { value: "payment", label: "Платёж по реквизитам", icon: <Coins /> },
  { value: "payment-1c", label: "Платёж из 1С", icon: <FileIcon /> },
  { value: "drawdown", label: "Заявка на выборку", icon: <FileText /> },
  { value: "autopay", label: "Автоплатёж", icon: <CalendarDays /> },
  { value: "registry", label: "Реестр платежей", icon: <FileText /> },
  { value: "sbp-company", label: "Платёж по СБП юрлицу", icon: <Sbp /> },
  { value: "sbp-person", label: "Платёж по СБП физлицу", icon: <Sbp /> },
  { value: "qr", label: "QR-код на оплату", icon: <Sbp /> },
]

// Демо-наполнение меню сотрудника — разделы, заголовки и порядок сняты с
// кадров «Главная» раздела «Меню сотрудника на главном экране» (нода
// 70396:22292) буква в букву.

export const EMPLOYEE_MENU_GROUPS: HeaderMenuGroup[] = [
  {
    value: "main",
    title: "Основное",
    links: [
      { value: "letters", label: "Письма" },
      { value: "tasks", label: "Задачник" },
      { value: "certificates", label: "Справки" },
      { value: "payments", label: "Платежи" },
    ],
  },
  {
    value: "sbp",
    title: "СБП",
    links: [
      { value: "sbp-payments", label: "Платежи СБП" },
      { value: "sbp-qr", label: "QR-коды СБП" },
    ],
  },
  {
    value: "orders",
    title: "Распоряжения",
    links: [
      { value: "orders", label: "Распоряжения" },
      { value: "contracts", label: "Договоры" },
    ],
  },
  {
    value: "registries",
    title: "Реестры данных",
    links: [
      { value: "persons", label: "Физлица" },
      { value: "companies", label: "Юрлица" },
      { value: "employees", label: "Сотрудники" },
    ],
  },
  {
    value: "savings",
    title: "Сберегательные продукты",
    links: [
      { value: "deposits", label: "Депозиты" },
      { value: "nso", label: "НСО" },
      { value: "standard-rates", label: "Стандартные ставки" },
      { value: "product-catalog", label: "Продуктовый каталог" },
    ],
  },
  {
    value: "administration",
    title: "Администрирование",
    links: [
      { value: "elk-banners", label: "Баннеры меню ЕЛК" },
      { value: "elk-help", label: "Страница «Помощь» ЕЛК" },
    ],
  },
  {
    value: "project-finance",
    title: "Проектное финансирование",
    links: [
      { value: "pf-requests", label: "Заявки на ПФ" },
      { value: "drawdown-requests", label: "Заявки на выборку" },
      { value: "petitions", label: "Ходатайства" },
    ],
  },
  {
    value: "extra",
    title: "Дополнительно",
    links: [
      { value: "salary-project", label: "Зарплатный проект" },
      { value: "escrow-requests", label: "Заявки на эскроу" },
      { value: "fraud", label: "FRAUD-мониторинг" },
      { value: "suspensive", label: "Отлагательные" },
      { value: "da-checklist", label: "Чеклист для ДА" },
    ],
  },
  {
    value: "credit-analytics",
    title: "Кредитная аналитика",
    links: [
      { value: "ka-desktop", label: "Рабочий стол КА" },
      { value: "ka-tasks", label: "Задачи КА" },
      { value: "ka-deals", label: "Сделки КА" },
      { value: "ka-calculations", label: "Расчёты КА" },
      { value: "ka-hotline", label: "Горячая линия КА" },
      { value: "ka-resources", label: "Полезные ресурсы КА" },
      { value: "ka-knowledge", label: "База знаний КА 2.0" },
      { value: "ka-reports", label: "Отчётность и аналитика" },
      { value: "ka-dossier", label: "Электронное досье" },
    ],
  },
]

/**
 * «Стартовый набор избранного у сотрудника» — комментарий макета (нода
 * 70396:22582) перечисляет его по пунктам и по порядку: Письма, Справки,
 * Платежи, Платежи СБП, Продуктовый каталог.
 */
export const EMPLOYEE_MENU_FAVOURITES = [
  "letters",
  "certificates",
  "payments",
  "sbp-payments",
  "product-catalog",
]

/** Избранное кадра «Много избранного»: в полосу помещается не всё. */
export const EMPLOYEE_MENU_FAVOURITES_MANY = [
  ...EMPLOYEE_MENU_FAVOURITES,
  "elk-help",
  "fraud",
  "suspensive",
  "da-checklist",
  "ka-desktop",
  "ka-reports",
]
