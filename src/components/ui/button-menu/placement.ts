import * as React from "react"

import { gridSpanWidth } from "@/components/ui/grid"

/**
 * Размещение нижней полосы действий на сетке — общее для `ButtonMenu` и
 * `ButtonMenuBlack`.
 *
 * Дизайн-чек от 13.09, замечание 19: «Button Menu и Button Menu Black должны
 * уметь занимать не все 12 колонок грида. Им нужны свойства размещения:
 * слева (регулируется количество занимаемых колонок), справа (регулируется
 * количество занимаемых колонок), полная ширина (12 колонок)».
 *
 * Ширина берётся `gridSpanWidth` — тем же выражением, которым меряет себя
 * колонка грида, — а не своим числом: иначе панель на 6 колонок и блок на 6
 * колонок рядом с ней разъехались бы на желоб. `100%` в этом выражении
 * считается от родителя, поэтому панель обязана стоять в контентной полосе
 * (`Grid`), а не на всю страницу.
 *
 * Прижим — обычными полями, а не `justify-*`: полоса стоит в потоке блоком,
 * своего flex-контейнера у неё нет и требовать его от вызывающего нельзя.
 */
type ButtonMenuPlacement = "full" | "left" | "right"

const BAR_PLACEMENT_CLASS: Record<ButtonMenuPlacement, string> = {
  full: "w-full",
  left: "mr-auto",
  right: "ml-auto",
}

/**
 * Инлайновая ширина полосы.
 *
 * `undefined` у полной ширины — там работает класс `w-full`, и подставлять
 * туда `100%` вторым способом значило бы завести два источника одной
 * величины.
 */
function barPlacementStyle(
  placement: ButtonMenuPlacement,
  span: number
): React.CSSProperties | undefined {
  if (placement === "full") return undefined
  return { width: gridSpanWidth(span) }
}

export { BAR_PLACEMENT_CLASS, barPlacementStyle }
export type { ButtonMenuPlacement }
