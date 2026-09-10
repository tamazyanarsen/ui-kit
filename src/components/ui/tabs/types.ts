import type * as React from "react"

// Дизайн-чек 3/3 №11: «Таба с иконкой быть не может, только с бейджем или
// статусом, отдельно одной иконкой без текста есть только таб more». Поэтому
// у вкладки нет слота `icon` — оформление задаётся только `badge`/`status`, а
// единственная иконка в компоненте — многоточие у таба «Ещё».
interface TabItem {
  value: string
  label: React.ReactNode
  badge?: number
  status?: boolean
  disabled?: boolean
}

/**
 * `Size` компонент-сета.
 *
 * `auto` — размер следует за вьюпортом (Desktop/Mobile), как в `ELK / tabs`
 * v1.2.0. `medium` закрепляет «мобильные» числа на любом экране: лента 40,
 * зазор 24, подпись P2 Medium, многоточие 16. Дизайн-чек «Storybook 3»,
 * замечание 4 — ровно так лента разделов устроена внутри `Table Top`.
 */
type TabsSize = "auto" | "medium"

export type { TabItem, TabsSize }
