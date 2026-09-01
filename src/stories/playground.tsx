import * as React from "react"

import { cn } from "@/lib/utils"
import { ViewportScope, type Viewport } from "@/lib/viewport"
import { Icon, ICON_NAMES } from "@/components/ui/icon"

/* Обвязка истории Playground: контролы формы Desktop/Mobile, псевдосостояний
   и иконок. Storybook-only — как и весь `src/stories`, в пакет не уходит. */

/* Дизайн-чек №3, замечания 8/18/19. Раньше здесь лежала подпись
   RESPONSIVE_NOTE («переключите viewport в тулбаре»): Desktop/Mobile
   различались медиазапросом, поэтому в матрицу помещалась только одна из
   двух форм. Теперь форму задаёт `<ViewportScope>` (src/lib/viewport.tsx),
   так что обе колонки рисуются рядом, а в Playground режим выбирается
   контролом в панели истории. */

/** Колонки Desktop / Mobile для матрицы — раскладываются в один ряд. */
export const VIEWPORT_COLUMNS: { label: string; viewport: Viewport }[] = [
  { label: "Desktop", viewport: "desktop" },
  { label: "Mobile", viewport: "mobile" },
]

/**
 * Оборачивает `render` матрицы в колонки Desktop/Mobile.
 *
 * `columnGroups` матрицы задаёт варианты компонента, а виджет ниже
 * дублирует всю матрицу для каждой формы — так десктоп и мобайл стоят
 * рядом и сравниваются глазами, а не переключением вьюпорта.
 */
export function ViewportMatrix({
  children,
  className,
}: {
  children: (viewport: Viewport) => React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-start gap-8", className)}>
      {VIEWPORT_COLUMNS.map(({ label, viewport }) => (
        <section key={viewport} className="flex max-w-full flex-col gap-3">
          <h3 className="text-p2-medium text-[#252628]">{label}</h3>
          <ViewportScope viewport={viewport}>{children(viewport)}</ViewportScope>
        </section>
      ))}
    </div>
  )
}

/** argTypes-запись для контрола Desktop/Mobile в панели истории. */
export const viewportArgType = {
  name: "viewport",
  description:
    "Форма компонента: Desktop / Mobile. «auto» — по ширине окна (медиазапрос 768px), остальные значения форсируют форму независимо от вьюпорта",
  control: { type: "inline-radio" as const },
  options: ["auto", "desktop", "mobile"] satisfies Viewport[],
  table: { category: "Storybook" },
}

/* Figma's property panels expose State (Default / Hover / Pressed / Focus) as
   a variant dropdown. In code those are CSS pseudo-classes, so a Playground
   can't pass them as props — it wraps the component in this instead, which
   storybook-addon-pseudo-states turns into the real thing. `disabled` stays a
   genuine prop and is handled per component. */
export type PlaygroundState =
  | "default"
  | "hover"
  /** То же, что `active` — историческое имя, Figma называет это состояние Active. */
  | "pressed"
  | "active"
  | "focus"
  /* Disabled и Loading — настоящие пропы, а не псевдоклассы: в оси State
     они есть у части компонентов, поэтому значения объявлены здесь, а
     раскладывает их в пропы сама история. */
  | "disabled"
  | "loading"

export const PLAYGROUND_STATES: PlaygroundState[] = [
  "default",
  "hover",
  "pressed",
  "focus",
]

const PLAYGROUND_STATE_CLASS: Record<PlaygroundState, string | undefined> = {
  default: undefined,
  hover: "pseudo-hover-all",
  pressed: "pseudo-active-all pseudo-hover-all",
  active: "pseudo-active-all pseudo-hover-all",
  focus: "pseudo-focus-visible-all",
  disabled: undefined,
  loading: undefined,
}

export function PseudoBox({
  state = "default",
  viewport,
  className,
  children,
}: {
  state?: PlaygroundState
  /** Форма Desktop/Mobile — контрол `viewport` из панели истории. */
  viewport?: Viewport
  className?: string
  children: React.ReactNode
}) {
  return (
    <ViewportScope viewport={viewport}>
      <div className={cn("w-fit", PLAYGROUND_STATE_CLASS[state], className)}>
        {children}
      </div>
    </ViewportScope>
  )
}

/** argTypes entry for the shared `state` Playground control. */
export const stateArgType = {
  name: "state",
  description:
    "Псевдосостояние (Hover / Pressed / Focus) — эмулируется аддоном pseudo-states, реальным пропом не является",
  control: { type: "inline-radio" as const },
  options: PLAYGROUND_STATES,
  table: { category: "Storybook" },
}

/**
 * argTypes для пропа, который принимает готовую иконку (JSX-узел).
 *
 * В Figma такой проп — instance swap, то есть обычный выбор из набора. В
 * коде это React-узел, который контролом не набрать, поэтому раньше в
 * историях висели заглушки на два пункта («None» / «Search»): весь
 * остальной набор был недоступен. С появлением компонента `Icon` список
 * можно собрать целиком — `mapping` превращает имя в узел.
 */
export function iconArgType(
  description = "Иконка из набора кита",
  /**
   * Какое начертание подставлять. У части набора Figma рисует 16 и 24
   * отдельно, поэтому там, где компонент отводит иконке коробку 24px,
   * контрол обязан отдавать именно 24-й рисунок — иначе в неё попадает
   * растянутый 16-й и выглядит тоньше и мельче макета (дизайн-чек Storybook
   * (Аня Багрова) №28 про «слишком маленькую иконку»).
   */
  size: 16 | 24 = 16
) {
  const NONE = "без иконки"
  return {
    description,
    control: { type: "select" as const },
    options: [NONE, ...ICON_NAMES],
    mapping: Object.fromEntries([
      [NONE, undefined],
      ...ICON_NAMES.map((name) => [
        name,
        <Icon key={name} name={name} size={size} />,
      ]),
    ]),
  }
}
