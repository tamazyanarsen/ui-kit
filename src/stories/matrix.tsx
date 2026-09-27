import * as React from "react"

import { cn } from "@/lib/utils"

import { ViewportMatrix } from "./playground"

/* Помощники только для Storybook. Этот каталог намеренно лежит вне
   `src/components/ui`, поэтому его не подхватывает ни `src/index.ts`
   (публикуемая точка входа), ни список `include` у vite-plugin-dts. Ничто
   отсюда не попадает в npm-пакет.

   `StatesMatrix` рисует ту же форму, которой пользуются листы макета для
   каждого компонента: необязательная полоса *групп* колонок сверху, под ней
   ряд заголовков колонок, слева колонка подписей, и по одному
   отрисованному инстансу в каждой ячейке. Чтение канваса стори рядом со
   страницей макета должно быть сравнением ячейка в ячейку. */

/** Одна колонка матрицы — её собственные пропсы накладываются поверх пропсов строки. */
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
  /* Псевдоклассы CSS нельзя выразить пропсами. storybook-addon-pseudo-states
     переписывает каждое правило с `:hover`, `:active` и `:focus-visible` в
     таблицах стилей страницы в равнозначное правило по классу
     `.pseudo-*-all`, поэтому пометка ячейки таким классом принудительно
     включает это состояние для неё и всего, что внутри. Так и
     воспроизводятся ряды Hover и Pressed из таблицы состояний в макете, без
     настоящего указателя. */
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
  /** Колонки — плоским списком или сгруппированные под общим заголовком. */
  columns?: MatrixColumn<P>[]
  columnGroups?: MatrixColumnGroup<P>[]
  rows: MatrixRow<P>[]
  /** Пропсы, применяемые к каждой ячейке до пропсов строки и колонки. */
  baseProps?: Partial<P>
  render: (props: P) => React.ReactNode
  /** Заголовок над колонкой подписей строк (в макете там написано «State»). */
  rowHeader?: React.ReactNode
  /** Растягивать ячейки на всю ширину колонки вместо подгонки по содержимому. */
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
                      // Левый край полосы несёт первая колонка группы,
                      // поэтому группы остаются визуально разделёнными без
                      // линии между каждой отдельной колонкой.
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
                  className="border-t border-[#DEDEDE] py-4 pr-6 text-left align-middle text-p3-medium whitespace-pre-line text-[#6D6D6D]"
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
        <p className="pt-4 text-p4-medium text-[#999999]">{rowHeader}</p>
      )}
    </div>
  )
}

/* Обвязка историй лежит рядом и реэкспортируется отсюда, чтобы истории
   импортировали всё из одного места (`@/stories/matrix`). */
export { StoryContentArea, StorySection, StoryShowcase } from "./showcase"
export {
  PLAYGROUND_STATES,
  PseudoBox,
  VIEWPORT_COLUMNS,
  ViewportMatrix,
  iconArgType,
  stateArgType,
  viewportArgType,
} from "./playground"
export type { PlaygroundState } from "./playground"
export {
  optionsArgType,
  sizeArgType,
  sizeArgTypeOf,
  stateArgTypeOf,
  toggleArgType,
} from "./figma-props"