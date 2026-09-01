import type { Viewport } from "@/lib/viewport"

import type { PlaygroundState } from "./playground"

/**
 * Контролы истории по панели «Свойства компонента» из Figma.
 *
 * Дизайн-чек Storybook (Аня Багрова), замечания 6/8/9/10/14/17/18/20/22/23/
 * 25/29/31: «Панель настройки Properties не соответствует настройкам в
 * Figma» — к каждому замечанию приложен точный список свойств и их значений.
 * Требование сквозное, поэтому имена и подписи собраны здесь, а не
 * переписываются в каждой истории.
 *
 * Правило: **имя контрола и подписи значений — как в Figma, значение под
 * капотом — как в коде**. Storybook умеет это сам через `control.labels`,
 * поэтому проп остаётся типизированным (`viewport: "desktop"`), а дизайнер
 * видит `Size: Desktop`.
 */

/** `Size (Desktop / Mobile)` — в коде это `viewport` + `<ViewportScope>`. */
export const sizeArgType = {
  name: "Size",
  description:
    "Свойство Size компонента в Figma. Форму задаёт ViewportScope, а не ширина окна",
  control: {
    type: "inline-radio" as const,
    labels: { desktop: "Desktop", mobile: "Mobile" },
  },
  options: ["desktop", "mobile"] satisfies Viewport[],
}

const FIGMA_STATE_LABELS: Record<PlaygroundState, string> = {
  default: "Default",
  hover: "Hover",
  pressed: "Active",
  active: "Active",
  focus: "Focus",
  disabled: "Disabled",
  loading: "Loading",
}

/**
 * `State (…)` — ось состояний из Figma одним списком.
 *
 * В коде она разъезжается на три механизма: Hover/Active/Focus — это
 * CSS-псевдоклассы (их включает аддон pseudo-states через {@link PseudoBox}),
 * а Disabled/Loading — настоящие пропы. Для дизайнера всё это одно свойство,
 * поэтому история отдаёт один контрол, а раскладывает его `render`.
 *
 * @param states значения оси ровно в том порядке, в каком они в Figma
 */
export function stateArgTypeOf(states: PlaygroundState[]) {
  return {
    name: "State",
    description:
      "Свойство State компонента в Figma. Hover/Active/Focus эмулируются аддоном pseudo-states, Disabled/Loading — настоящие пропы",
    control: {
      type: "inline-radio" as const,
      labels: Object.fromEntries(
        states.map((state) => [state, FIGMA_STATE_LABELS[state]])
      ),
    },
    options: states,
  }
}

/** Свойство-переключатель `Show … (On / Off)`. */
export function toggleArgType(name: string, description?: string) {
  return { name, description, control: { type: "boolean" as const } }
}

/** Список значений (`Type`, `Style`, `Color` …) с подписями из Figma. */
export function optionsArgType<T extends string | number>(
  name: string,
  labels: Record<T, string>,
  control: "inline-radio" | "radio" | "select" = "select"
) {
  return {
    name,
    control: { type: control, labels },
    // Ключи объекта всегда строки, а значение пропа может быть числом
    // (`Volume` у Cell Switcher, `Button` у чёрной панели). Без обратного
    // приведения контрол не находит текущее значение в списке и показывает
    // «Choose option…».
    options: Object.keys(labels).map((key) =>
      /^-?\d+$/.test(key) ? Number(key) : key
    ) as T[],
  }
}
