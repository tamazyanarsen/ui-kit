import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { PseudoBox, StorySection, StoryShowcase, sizeArgType } from "@/stories/matrix"
import {
  CHART_PRESETS,
  formatRub,
  sumOf,
  type ChartPreset,
} from "@/stories/new-components-fixtures"
import type { Viewport } from "@/lib/viewport"

import { Donut, type DonutProps } from "./donut"

/**
 * Donut — кольцевая диаграмма (Правки UI-Kit от 25.10, пункт «Кольцевая
 * диаграмма (бублик)»): строится из данных, зазор с параллельными краями,
 * скруглённые углы, прозрачная середина, подсветка выбранного, подпись и
 * значение в центре.
 */
type PlaygroundArgs = Omit<DonutProps, "data"> & {
  viewport?: Viewport
  preset?: ChartPreset
  highlight?: number
}

const PRESET_LABELS: Record<ChartPreset, string> = {
  portfolio: "Портфель (5 частей)",
  balance: "Баланс (с нулевой частью)",
  palette: "Вся палитра (6)",
  narrow: "Узкие сегменты",
  single: "Один ненулевой",
}

const meta = {
  title: "Компоненты/Donut",
  // `component` не задан: аргументы Playground (`data` пресетом) не совпадают с пропсами.
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    preset: {
      name: "data",
      control: { type: "select", labels: PRESET_LABELS },
      options: Object.keys(PRESET_LABELS),
    },
    size: { control: { type: "range", min: 120, max: 360, step: 4 } },
    label: { control: "text" },
    value: { control: "text" },
    highlight: {
      name: "activeIndex",
      control: { type: "number", min: -1, max: 5 },
      description: "Подсвеченная часть; −1 — без подсветки",
    },
    surface: { control: "color" },
    activeIndex: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    preset: "portfolio",
    size: 224,
    label: "Портфель",
    value: formatRub(sumOf(CHART_PRESETS.portfolio)),
    highlight: -1,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, preset = "portfolio", highlight = -1, ...args }) => (
    <PseudoBox viewport={viewport}>
      <Donut {...args} data={CHART_PRESETS[preset]} activeIndex={highlight < 0 ? null : highlight} />
    </PseudoBox>
  ),
}

function HighlightDemo() {
  const [active, setActive] = React.useState<number | null>(null)
  const data = CHART_PRESETS.portfolio
  return (
    <div className="flex items-center gap-8">
      <Donut data={data} label="Портфель" value={formatRub(sumOf(data))} activeIndex={active} />
      <ul className="flex flex-col gap-2 text-p2-medium">
        {data.map((datum, i) => (
          <li key={datum.name}>
            <button
              type="button"
              className="cursor-pointer underline-offset-4 hover:underline"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              {datum.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const Examples: Story = {
  name: "Examples (размеры, крайние случаи, подсветка)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection title="Размеры" description="200 и 224 — P2 + P1; 300 — P1 + H2">
        <div className="flex flex-wrap items-center gap-8">
          <Donut data={CHART_PRESETS.balance} size={200} label="Баланс" value={formatRub(sumOf(CHART_PRESETS.balance))} />
          <Donut data={CHART_PRESETS.portfolio} size={224} label="Портфель" value={formatRub(sumOf(CHART_PRESETS.portfolio))} />
          <Donut data={CHART_PRESETS.palette} size={300} label="Всего" value="6" />
        </div>
      </StorySection>
      <StorySection
        title="Крайние случаи"
        description="Нулевая часть не рисуется; узкий сегмент — край в точку; один ненулевой — сплошное кольцо"
      >
        <div className="flex flex-wrap items-center gap-8">
          <Donut data={CHART_PRESETS.balance} label="С нулём" />
          <Donut data={CHART_PRESETS.narrow} label="Узкие" />
          <Donut data={CHART_PRESETS.single} label="Один" />
        </div>
      </StorySection>
      <StorySection title="Прозрачная середина" description="На белом блоке и на серой карточке">
        <div className="flex flex-wrap gap-6">
          <div className="rounded-[16px] bg-[var(--card-box-bg)] p-6">
            <Donut data={CHART_PRESETS.portfolio} size={200} label="Портфель" />
          </div>
          <div className="rounded-[12px] bg-[var(--card-bg)] p-6">
            <Donut
              data={CHART_PRESETS.portfolio}
              size={200}
              label="Портфель"
              surface="var(--card-bg)"
              activeIndex={0}
            />
          </div>
        </div>
      </StorySection>
      <StorySection title="Подсветка выбранного" description="Наведите на пункт легенды: остальные — 35 % цвета, 280 мс">
        <HighlightDemo />
      </StorySection>
    </StoryShowcase>
  ),
}
