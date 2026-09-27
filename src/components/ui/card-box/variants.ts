/** Тип блока — свойство `Type` мастера `ELK / card-box`. */
export type CardBoxType = "large" | "small" | "table"

/**
 * «Блок имеет ограничение по высоте в 792 px» — вариант `Small`
 * . Ограничение десктопное: у `Size=Mobile, Type=Small`
 * скролл-обвязки в макете нет.
 */
export const CARD_BOX_MAX_HEIGHT = 792
