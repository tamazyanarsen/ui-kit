import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Grid,
  GridCol,
  GridGuides,
  GridRoot,
  GridRow,
  GRID_COLUMNS,
  GRID_CONTENT_MAX,
  GRID_CONTENT_MIN,
  GRID_GUTTER,
  GRID_MARGIN,
  GRID_VIEWPORT_MAX,
  GRID_VIEWPORT_MIN,
  GRID_VIEWPORT_WIDE,
} from "./grid"

/**
 * Grid — сетка продукта (замечание 35 дизайн-чека от 07.09: «внести общие
 * правила грида в продукт… как центральное правило проектирования десктопных
 * экранов»).
 *
 * Три части: `GridRoot` — корень продукта с порогом прокрутки, `Grid` —
 * контентная полоса, `GridRow` + `GridCol` — ряд из 12 колонок.
 *
 * Дизайн-чек от 08.10, замечание 23: 12 колонок — это правило размещения
 * БЕЛЫХ БЛОКОВ на сером вьюпорте, а не контента внутри одного блока. Прежняя
 * витрина рисовала колонки внутри белой плашки и подписывала ширину плашки
 * как «вьюпорт». Теперь страница документации сама подчиняется сетке: серый
 * фон — это и есть вьюпорт (окно превью), разделы — белые блоки, разложенные
 * по колонкам, а полоса перестаёт расти на 1800 и сжиматься на 1200 (ниже
 * 1280 появляется общая прокрутка, как в продукте).
 */
const meta = {
  // Дизайн-чек от 13.09, замечание 12: «Перенести компонент Grid в рут
  // PREVIEW» (он же, по замечанию 13, «Атомы»). Сетка — не компонент в ряду
  // с кнопкой и полем, а правило, по которому они раскладываются, и стоять
  // ей рядом с цветами, типографикой и иконками.
  title: "Атомы/.Grid",
  component: Grid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "boolean",
      description:
        "Разложить детей по 12 колонкам прямо в полосе (обычно колонки заводит GridRow внутри неё)",
    },
  },
  args: { columns: false },
} satisfies Meta<React.ComponentProps<typeof Grid>>

export default meta
type Story = StoryObj<React.ComponentProps<typeof Grid>>

/** Белый блок на сером вьюпорте — то, что сетка и раскладывает. */
function Block({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={
        "flex h-16 items-center justify-center rounded-[16px] bg-[var(--modal-bg)] text-p2-medium text-[var(--title-fg)] " +
        (className ?? "")
      }
    >
      {children}
    </div>
  )
}

export const Playground: Story = {
  render: (args) => (
    <GridRoot className="min-h-[420px] bg-[var(--page-bg)] py-10">
      <Grid {...args} className="gap-[var(--grid-gutter)]">
        {args.columns ? (
          Array.from({ length: GRID_COLUMNS }, (_, index) => (
            <Block key={index}>{index + 1}</Block>
          ))
        ) : (
          <Block>Контентная полоса — {`min(100% − 2×${GRID_MARGIN}, ${GRID_CONTENT_MAX})`}</Block>
        )}
      </Grid>
    </GridRoot>
  ),
}

/**
 * Живые числа раскладки. Меряет НАСТОЯЩИЕ узлы — окно превью и полосу этой
 * же страницы, — а не считает по формуле: витрина должна показывать, что
 * раскладка формуле следует. Вьюпорт — это ширина окна, а не какого-то блока.
 */
function ColumnsProbe() {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const [state, setState] = React.useState<{
    viewport: number
    content: number
    column: number
  }>()

  React.useEffect(() => {
    const read = () => {
      const strip = ref.current?.closest<HTMLElement>('[data-slot="grid"]')
      const guide = strip?.querySelector<HTMLElement>('[data-slot="grid-guide"]')
      if (!guide || !strip) return
      setState({
        viewport: document.documentElement.clientWidth,
        content: Math.round(strip.getBoundingClientRect().width),
        column: Math.round(guide.getBoundingClientRect().width),
      })
    }
    read()
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  const beyond = !state
    ? ""
    : state.viewport < GRID_VIEWPORT_MIN
      ? "полоса на минимуме 1200, продукт прокручивается"
      : state.viewport >= GRID_VIEWPORT_MAX
        ? "полоса на максимуме 1800, растут поля"
        : "растут колонки"

  return (
    <p ref={ref} className="text-p2-medium text-[var(--title-fg)]">
      {state && (
        <>
          Вьюпорт {state.viewport}px · полоса {state.content}px · колонка{" "}
          {state.column}px · {beyond}
          {state.viewport >= GRID_VIEWPORT_WIDE && ` · порог ${GRID_VIEWPORT_WIDE} пройден`}
        </>
      )}
    </p>
  )
}

/** Заголовок раздела — лежит прямо на сером вьюпорте, над блоками. */
function SectionTitle({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1 pt-6">
      <h2 className="text-h4 text-[var(--title-fg)]">{title}</h2>
      <p className="text-p2-medium text-[var(--accordion-card-subtitle-fg)]">{description}</p>
    </div>
  )
}

const RULES: Array<[string, string]> = [
  ["Колонок", String(GRID_COLUMNS)],
  ["Желоб", `${GRID_GUTTER}px`],
  ["Поле", `${GRID_MARGIN}px`],
  ["Полоса", `${GRID_CONTENT_MIN}…${GRID_CONTENT_MAX}px`],
  ["Пороги вьюпорта", `${GRID_VIEWPORT_MIN} / ${GRID_VIEWPORT_WIDE} / ${GRID_VIEWPORT_MAX}px`],
]

/** Раскладки живого примера: блоки по колонкам, не обязательно на все 12. */
const LIVE_ROWS = [
  Array.from({ length: GRID_COLUMNS }, () => 1),
  [3, 3, 3, 3],
  [4, 4, 4],
  [6, 6],
  [8, 4],
  [5],
]

const ROW_EXAMPLES = [[12], [6, 6], [7, 5], [4, 8], [4, 4, 4]]

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { controls: { disable: true } },
  render: () => (
    <GridRoot className="min-h-screen bg-[var(--page-bg)] pb-10">
      {/* «Хедер тянется на всю ширину»: подложка — на весь GridRoot, а
          содержимое стоит по той же полосе, что и блоки ниже. */}
      <div className="w-full border-b border-[var(--header-border)] bg-[var(--header-bg)]">
        <Grid className="flex h-16 items-center text-p1-medium text-[var(--header-fg)]">
          Шапка — подложка во всю ширину, содержимое по полосе сетки
        </Grid>
      </div>

      <Grid className="flex flex-col gap-[var(--grid-gutter)] pt-4">
        <SectionTitle
          title="Правила"
          description={`Серый фон — вьюпорт, его ширина не ограничена. Двенадцать колонок раскладывают по нему белые блоки: в ряду их может быть один, два, три и больше. Внутри блока колоночных правил нет. Полоса ${GRID_CONTENT_MIN}…${GRID_CONTENT_MAX} при полях ${GRID_MARGIN}: ниже ${GRID_VIEWPORT_MIN} продукт не сжимается — появляется общая горизонтальная прокрутка; выше ${GRID_VIEWPORT_MAX} полоса стоит на ${GRID_CONTENT_MAX}, а растут поля.`}
        />
        <GridRow>
          {RULES.map(([term, value]) => (
            <GridCol key={term} span={term === "Пороги вьюпорта" ? 4 : 2}>
              <div className="flex h-full flex-col gap-1 rounded-[16px] bg-[var(--modal-bg)] p-6">
                <span className="text-p3-medium text-[var(--accordion-card-subtitle-fg)]">{term}</span>
                <span className="text-p1-medium text-[var(--title-fg)]">{value}</span>
              </div>
            </GridCol>
          ))}
        </GridRow>

        <SectionTitle
          title="Колонки вживую"
          description={`Серым по серому — сами колонки, белым — блоки, разложенные по ним. Потяните окно превью: между ${GRID_VIEWPORT_MIN} и ${GRID_VIEWPORT_MAX} растут колонки, выше ${GRID_VIEWPORT_MAX} — поля, ниже ${GRID_VIEWPORT_MIN} появляется общая прокрутка. На ${GRID_VIEWPORT_WIDE} разделу разрешено перестроить содержимое — полосы это не касается.`}
        />
        <ColumnsProbe />
        <div className="relative">
          <GridGuides className="absolute inset-0 h-full" />
          <div className="relative flex flex-col gap-[var(--grid-gutter)] py-[var(--grid-gutter)]">
            {LIVE_ROWS.map((spans, row) => (
              <GridRow key={row}>
                {spans.map((span, index) => (
                  <GridCol key={index} span={span}>
                    <Block className="h-20">{span}</Block>
                  </GridCol>
                ))}
              </GridRow>
            ))}
          </div>
        </div>

        <SectionTitle
          title="Ряд колонок"
          description={`GridRow раскладывает блоки по 12 колонкам, GridCol задаёт пролёт. Ряды стоят в полосе страницы, поэтому перестают расти на ${GRID_CONTENT_MAX} и перестают сжиматься на ${GRID_CONTENT_MIN}. Ниже десктопной ширины ряд складывается в столбец: 12 колонок по 128 там уже не живут.`}
        />
        {ROW_EXAMPLES.map((spans) => (
          <GridRow key={spans.join("-")}>
            {spans.map((span, index) => (
              <GridCol key={index} span={span}>
                <Block>{span}</Block>
              </GridCol>
            ))}
          </GridRow>
        ))}
      </Grid>
    </GridRoot>
  ),
}
