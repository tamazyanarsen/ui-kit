import * as React from "react"

import { cn } from "@/lib/utils"
import { ViewportScope, type Viewport } from "@/lib/viewport"
import { Icon, ICON_NAMES } from "@/components/ui/icon"

/* Storybook-only helpers — this directory is deliberately outside
   `src/components/ui`, so it is picked up by neither `src/index.ts` (the
   published entry surface) nor vite-plugin-dts's `include` list. Nothing
   here ships in the npm package.

   `StatesMatrix` renders the same shape the Figma spec sheets use for every
   component: an optional band of column *groups* across the top, a row of
   column headers under it, and a label column down the left, with one
   rendered instance per cell. Reading a story canvas next to its Figma page
   should be a cell-for-cell comparison. */

/** One column of the matrix — its own props are merged over the row's. */
export interface MatrixColumn<P> {
  label?: React.ReactNode
  props?: Partial<P>
  /** Как и у строки — псевдосостояние клетки. В Figma ось State ложится то
   *  в строки, то в колонки; обе стороны должны уметь её выразить. */
  pseudo?: PseudoState | PseudoState[]
}

/** A band spanning several columns, e.g. Figma's "Large (Desktop)". */
export interface MatrixColumnGroup<P> {
  label?: React.ReactNode
  columns: MatrixColumn<P>[]
}

export interface MatrixRow<P> {
  label?: React.ReactNode
  props?: Partial<P>
  /* CSS pseudo-classes can't be expressed as props. storybook-addon-pseudo-
     states rewrites every `:hover`/`:active`/`:focus-visible` rule in the
     page's stylesheets into an equivalent `.pseudo-*-all` class rule, so
     tagging a cell with one forces that state for the cell and everything
     inside it — which is how the Hover/Pressed rows of a Figma state table
     get reproduced without a real pointer. */
  pseudo?: PseudoState | PseudoState[]
}

export type PseudoState =
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "focus-within"
  | "visited"

export interface StatesMatrixProps<P> {
  /** Columns, either flat or grouped under a spanning header. */
  columns?: MatrixColumn<P>[]
  columnGroups?: MatrixColumnGroup<P>[]
  rows: MatrixRow<P>[]
  /** Props applied to every cell, before row and column props. */
  baseProps?: Partial<P>
  render: (props: P) => React.ReactNode
  /** Header above the row-label column (Figma writes "State" there). */
  rowHeader?: React.ReactNode
  /** Stretch cells to the full column width instead of hugging content. */
  stretch?: boolean
  /**
   * У компонента разные формы на десктопе и на мобайле.
   *
   * Дизайн-чек №3, замечания 8/18: «Нужно выводить в матрице рядом десктоп
   * и мобайл (касается всех компонентов)… не создавать истории mobile
   * отдельными матрицами, это не наглядно». Матрица рисуется дважды — по
   * разу в каждой форме, — а форму задаёт `<ViewportScope>`, а не ширина
   * окна, поэтому обе видны одновременно.
   */
  responsive?: boolean
  className?: string
  cellClassName?: string
}

function pseudoClass(...pseudos: (MatrixRow<unknown>["pseudo"] | undefined)[]) {
  const list = pseudos.flatMap((pseudo) =>
    !pseudo ? [] : Array.isArray(pseudo) ? pseudo : [pseudo]
  )
  if (list.length === 0) return undefined
  return list.map((state) => `pseudo-${state}-all`).join(" ")
}

export function StatesMatrix<P>(props: StatesMatrixProps<P>) {
  if (!props.responsive) return <SingleMatrix {...props} />

  return (
    <ViewportMatrix>
      {() => <SingleMatrix {...props} responsive={false} />}
    </ViewportMatrix>
  )
}

function SingleMatrix<P>({
  columns,
  columnGroups,
  rows,
  baseProps,
  render,
  rowHeader,
  stretch = false,
  className,
  cellClassName,
}: StatesMatrixProps<P>) {
  const groups: MatrixColumnGroup<P>[] =
    columnGroups ?? [{ columns: columns ?? [{}] }]
  const flatColumns = groups.flatMap((group) => group.columns)
  const hasGroupBand = groups.some((group) => group.label != null)
  const hasColumnLabels = flatColumns.some((column) => column.label != null)
  const hasRowLabels = rows.some((row) => row.label != null)

  return (
    <div
      className={cn(
        "inline-block max-w-full overflow-x-auto bg-[#F8F8F8] p-8 text-[#252628]",
        className
      )}
    >
      <table className="border-separate border-spacing-0">
        <thead>
          {hasGroupBand && (
            <tr>
              {hasRowLabels && <th className="w-40" />}
              {groups.map((group, groupIndex) => (
                <th
                  key={groupIndex}
                  colSpan={group.columns.length}
                  className="px-4 pb-3 text-center text-p3-medium text-[#6D6D6D]"
                >
                  {group.label}
                </th>
              ))}
            </tr>
          )}
          {hasColumnLabels && (
            <tr>
              {hasRowLabels && <th className="w-40" />}
              {groups.map((group, groupIndex) =>
                group.columns.map((column, columnIndex) => (
                  <th
                    key={`${groupIndex}-${columnIndex}`}
                    className={cn(
                      "px-4 pb-3 text-center text-p3-medium whitespace-nowrap",
                      // A group's first column carries the band's left edge,
                      // so groups stay visually separated without a rule
                      // between every single column.
                      columnIndex === 0 && groupIndex > 0 && "border-l border-[#DEDEDE] pl-8"
                    )}
                  >
                    {column.label}
                  </th>
                ))
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {hasRowLabels && (
                <th
                  scope="row"
                  className="border-t border-[#DEDEDE] py-4 pr-6 text-left align-middle text-p3-medium font-normal whitespace-pre-line text-[#6D6D6D]"
                >
                  {row.label}
                </th>
              )}
              {groups.map((group, groupIndex) =>
                group.columns.map((column, columnIndex) => (
                  <td
                    key={`${groupIndex}-${columnIndex}`}
                    className={cn(
                      "border-t border-[#DEDEDE] px-4 py-4 align-middle",
                      columnIndex === 0 && groupIndex > 0 && "border-l pl-8",
                      cellClassName
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        stretch ? "w-full" : "w-fit",
                        pseudoClass(row.pseudo, column.pseudo)
                      )}
                    >
                      {render({
                        ...(baseProps as P),
                        ...(row.props as P),
                        ...(column.props as P),
                      })}
                    </div>
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {rowHeader != null && (
        <p className="pt-4 text-p4-regular text-[#999999]">{rowHeader}</p>
      )}
    </div>
  )
}

/* A looser layout for components that are too wide or too composite for a
   real grid (Modal, Header, Table, …): a stack of captioned sections. */
export function StoryShowcase({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-10 bg-[#F8F8F8] p-8", className)}>
      {children}
    </div>
  )
}

export function StorySection({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-p2-medium text-[#252628]">{title}</h3>
        {description && (
          <p className="text-p3-regular text-[#6D6D6D]">{description}</p>
        )}
      </div>
      <div className={cn("flex flex-wrap items-start gap-4", className)}>
        {children}
      </div>
    </section>
  )
}

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
export type PlaygroundState = "default" | "hover" | "pressed" | "focus"

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
  focus: "pseudo-focus-visible-all",
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
export function iconArgType(description = "Иконка из набора кита") {
  const NONE = "без иконки"
  return {
    description,
    control: { type: "select" as const },
    options: [NONE, ...ICON_NAMES],
    mapping: Object.fromEntries([
      [NONE, undefined],
      ...ICON_NAMES.map((name) => [name, <Icon key={name} name={name} />]),
    ]),
  }
}
