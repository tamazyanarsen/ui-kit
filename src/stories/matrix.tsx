import * as React from "react"

import { cn } from "@/lib/utils"

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
  className?: string
  cellClassName?: string
}

function pseudoClass(pseudo: MatrixRow<unknown>["pseudo"]) {
  if (!pseudo) return undefined
  const list = Array.isArray(pseudo) ? pseudo : [pseudo]
  return list.map((state) => `pseudo-${state}-all`).join(" ")
}

export function StatesMatrix<P>({
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
                        pseudoClass(row.pseudo)
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

/* Note appended under a matrix whose Desktop/Mobile split is a `md:` media
   query rather than a prop — those can only be seen by switching the
   Storybook viewport, never side by side in one canvas. */
export const RESPONSIVE_NOTE =
  "Desktop / Mobile различаются медиазапросом md: (768px), а не пропом — переключите viewport в тулбаре, чтобы увидеть мобильную форму."

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
  className,
  children,
}: {
  state?: PlaygroundState
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("w-fit", PLAYGROUND_STATE_CLASS[state], className)}>
      {children}
    </div>
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
