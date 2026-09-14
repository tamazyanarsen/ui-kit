import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

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
 * ⚠️ Проверять правило прокрутки надо не здесь, а на песочном экране в
 * полном окне: внутри Storybook история живёт в узком `iframe`, и полоса
 * прокрутки, которая появляется у `GridRoot`, — как раз то самое ожидаемое
 * поведение, а не дефект витрины.
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

/** Полоска-«колонка» — чтобы было видно и пролёты, и желобы. */
function Cell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-16 items-center justify-center rounded-[8px] bg-[var(--header-menu-tile-bg)] text-p2-medium text-[var(--header-fg)]">
      {children}
    </div>
  )
}

export const Playground: Story = {
  render: (args) => (
    <GridRoot className="min-h-[420px] bg-[var(--grey-109)] py-10">
      <Grid {...args} className="gap-[var(--grid-gutter)]">
        {args.columns ? (
          Array.from({ length: GRID_COLUMNS }, (_, index) => (
            <Cell key={index}>{index + 1}</Cell>
          ))
        ) : (
          <Cell>Контентная полоса — {`min(100% − 2×${GRID_MARGIN}, ${GRID_CONTENT_MAX})`}</Cell>
        )}
      </Grid>
    </GridRoot>
  ),
}

/**
 * Живые числа раскладки — что именно происходит при смене ширины окна.
 *
 * Меряет НАСТОЯЩИЕ узлы (`GridGuides`), а не считает по формуле: формула и
 * так написана в правилах выше, а витрина должна показывать, что раскладка
 * ей следует. Расхождение видно сразу.
 */
function ColumnsProbe() {
  const [state, setState] = React.useState<{
    viewport: number
    content: number
    column: number
  }>()

  React.useEffect(() => {
    const read = () => {
      const guide = document.querySelector<HTMLElement>('[data-slot="grid-guide"]')
      const strip = guide?.closest<HTMLElement>('[data-slot="grid"]')
      if (!guide || !strip) return
      setState({
        viewport: Math.round(window.innerWidth),
        content: Math.round(strip.getBoundingClientRect().width),
        column: Math.round(guide.getBoundingClientRect().width),
      })
    }
    read()
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  if (!state) return null

  const beyond =
    state.viewport < GRID_VIEWPORT_MIN
      ? "продукт прокручивается"
      : state.viewport >= GRID_VIEWPORT_MAX
        ? "растут поля"
        : "растут колонки"

  return (
    <p className="text-p2-medium text-[var(--accordion-card-subtitle-fg)]">
      Вьюпорт {state.viewport}px · полоса {state.content}px · колонка{" "}
      {state.column}px · {beyond}
      {state.viewport >= GRID_VIEWPORT_WIDE && " · порог 1536 пройден"}
    </p>
  )
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Правила"
        description={`Контент ${GRID_CONTENT_MIN}…${GRID_CONTENT_MAX} при полях ${GRID_MARGIN}. Ниже ${GRID_VIEWPORT_MIN} продукт не сжимается — появляется общая горизонтальная прокрутка; выше ${GRID_VIEWPORT_MAX} контент стоит на ${GRID_CONTENT_MAX}, а растут поля.`}
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-p2-medium text-[var(--header-fg)]">
          <dt className="text-p2-medium">Колонок</dt>
          <dd>{GRID_COLUMNS}</dd>
          <dt className="text-p2-medium">Желоб</dt>
          <dd>{GRID_GUTTER}px</dd>
          <dt className="text-p2-medium">Поле</dt>
          <dd>{GRID_MARGIN}px</dd>
          <dt className="text-p2-medium">Контент</dt>
          <dd>
            {GRID_CONTENT_MIN}…{GRID_CONTENT_MAX}px
          </dd>
          <dt className="text-p2-medium">Пороги вьюпорта</dt>
          <dd>
            {GRID_VIEWPORT_MIN} / {GRID_VIEWPORT_WIDE} / {GRID_VIEWPORT_MAX}px
          </dd>
        </dl>
      </StorySection>

      <StorySection
        title="Колонки вживую"
        description={`Двенадцать настоящих колонок той же раскладкой, что и у GridRow. Потяните окно: между ${GRID_VIEWPORT_MIN} и ${GRID_VIEWPORT_MAX} растут колонки, выше ${GRID_VIEWPORT_MAX} — поля, ниже ${GRID_VIEWPORT_MIN} появляется общая прокрутка продукта. На ${GRID_VIEWPORT_WIDE} разделу разрешено перестроить содержимое — полосы это не касается.`}
      >
        <GridRoot className="w-full overflow-hidden rounded-[16px] bg-[var(--modal-bg)] py-6">
          <Grid>
            <GridGuides className="min-h-40" />
          </Grid>
        </GridRoot>
        <ColumnsProbe />
      </StorySection>

      <StorySection
        title="Ряд колонок"
        description="GridRow раскладывает детей по 12 колонкам, GridCol задаёт пролёт. Ниже десктопной ширины ряд складывается в столбец: 12 колонок по 128 там уже не живут."
      >
        <div className="flex w-full flex-col gap-4">
          {[
            [12],
            [6, 6],
            [7, 5],
            [4, 8],
            [4, 4, 4],
          ].map((widths) => (
            <GridRow key={widths.join("-")}>
              {widths.map((width, index) => (
                <GridCol key={index} span={width}>
                  <Cell>{width}</Cell>
                </GridCol>
              ))}
            </GridRow>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Шапка во всю ширину"
        description="Подложка тянется на весь GridRoot, а её содержимое стоит по той же полосе, что и контент страницы, — «грид работает не на белую подложку хедера, а на контент внутри»."
      >
        <GridRoot className="w-full overflow-hidden rounded-[16px] bg-[var(--grey-109)]">
          <div className="w-full border-b border-[var(--header-border)] bg-[var(--header-bg)]">
            <Grid className="flex h-16 items-center text-p1-medium text-[var(--header-fg)]">
              Шапка
            </Grid>
          </div>
          <Grid className="py-6">
            <Cell>Контент страницы — по тем же полям</Cell>
          </Grid>
        </GridRoot>
      </StorySection>
    </StoryShowcase>
  ),
}
