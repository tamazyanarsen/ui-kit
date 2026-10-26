import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, ViewportMatrix, sizeArgType } from "@/stories/matrix"
import {
  CHART_PRESETS,
  formatRub,
  sumOf,
  type ChartPreset,
} from "@/stories/new-components-fixtures"
import { ViewportScope, type Viewport } from "@/lib/viewport"
import { Button } from "@/components/ui/button"

import { StackBar, type StackBarProps } from "./stack-bar"

/**
 * Stack Bar — горизонтальная полоса состава (Правки UI-Kit от 25.10, пункт
 * «Полоса (stack bar)»): строка «подпись — итог» над полосой, сегменты по
 * значениям, зазор 3, скругление 4, рост по очереди при появлении и смене
 * данных.
 */
type PlaygroundArgs = Omit<StackBarProps, "data"> & {
  viewport?: Viewport
  preset?: ChartPreset
}

const PRESET_LABELS: Record<ChartPreset, string> = {
  portfolio: "Портфель (5 частей)",
  balance: "Баланс (с нулевой частью)",
  palette: "Вся палитра (6)",
  narrow: "Узкие сегменты (минимум 4)",
  single: "Один ненулевой",
}

const meta = {
  title: "Компоненты/Stack Bar",
  // `component` не задан: аргументы Playground (`data` пресетом) не совпадают с пропсами.
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    preset: {
      name: "data",
      control: { type: "select", labels: PRESET_LABELS },
      options: Object.keys(PRESET_LABELS),
    },
    label: { control: "text" },
    total: { control: "text" },
    animated: { control: "boolean", description: "Рост сегментов при появлении и смене данных" },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    preset: "portfolio",
    label: "Портфель",
    total: formatRub(sumOf(CHART_PRESETS.portfolio)),
    animated: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, preset = "portfolio", ...args }) => (
    <ViewportScope viewport={viewport}>
      <div className={viewport === "mobile" ? "w-[311px]" : "w-[560px]"}>
        <StackBar {...args} data={CHART_PRESETS[preset]} />
      </div>
    </ViewportScope>
  ),
}

function ReplayDemo() {
  const [preset, setPreset] = React.useState<"portfolio" | "balance">("portfolio")
  const data = CHART_PRESETS[preset]
  return (
    <div className="flex w-[560px] flex-col gap-4">
      <Button
        size="sm"
        variant="secondary-black"
        className="w-fit"
        onClick={() => setPreset((p) => (p === "portfolio" ? "balance" : "portfolio"))}
      >
        Сменить данные
      </Button>
      <StackBar
        data={data}
        label={preset === "portfolio" ? "Портфель" : "Баланс"}
        total={formatRub(sumOf(data))}
      />
    </div>
  )
}

export const Examples: Story = {
  name: "Examples (Desktop / Mobile, смена данных)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Desktop / Mobile"
        description="Десктоп: подпись и итог в строку, оба Grey 1514. Мобильный: итог под подписью, подпись Grey 284"
      >
        <ViewportMatrix>
          {(viewport) => (
            <div className={viewport === "mobile" ? "w-[311px]" : "w-[560px]"}>
              <StackBar
                data={CHART_PRESETS.portfolio}
                label="Портфель"
                total={formatRub(sumOf(CHART_PRESETS.portfolio))}
              />
            </div>
          )}
        </ViewportMatrix>
      </StorySection>
      <StorySection title="Узкие и нулевые части" description="Нулевые не рисуются, узкие — не уже 4">
        <div className="flex w-[560px] flex-col gap-6">
          <StackBar data={CHART_PRESETS.narrow} label="Узкие" total="1 000" />
          <StackBar data={CHART_PRESETS.balance} label="Баланс" total={formatRub(sumOf(CHART_PRESETS.balance))} />
        </div>
      </StorySection>
      <StorySection title="Смена данных" description="Полоса разворачивается заново целиком: 1000 мс, cubicInOut">
        <ReplayDemo />
      </StorySection>
    </StoryShowcase>
  ),
}
