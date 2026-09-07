// Данные экрана D1 — с эталона 70371:24524.

const CONTRACTS = [
  { value: "01-001", label: "01–001/ИЖС", signed: "12.09.2022" },
  { value: "01-002", label: "01–002/ИЖС", signed: "04.03.2023" },
  { value: "01-014", label: "01–014/ИЖС", signed: "21.11.2024" },
]

const AGREEMENTS = [
  { value: "mb25", label: "000001–0001/МБ25" },
  { value: "mb26", label: "000001–0002/МБ26" },
]

/** Дата выдачи с эталона. Фиксированная: песочница не должна «стареть». */
const ISSUE_DATE = new Date(2026, 8, 12)

const MAX_FIRST = 30_000_000
const MAX_LAST = 10_000_000

export { AGREEMENTS, CONTRACTS, ISSUE_DATE, MAX_FIRST, MAX_LAST }
