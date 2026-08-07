import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix, StorySection, StoryShowcase } from "@/stories/matrix"

import { Shimmer } from "./shimmer"

type ShimmerProps = ComponentProps<typeof Shimmer>

const meta = {
  title: "Pattern/Shimmer",
  component: Shimmer,
  parameters: { layout: "padded" },
  argTypes: {
    shape: { control: "inline-radio", options: ["square", "circle"] },
    className: { control: "text" },
  },
  args: { shape: "square", className: "h-6 w-64" },
} satisfies Meta<ShimmerProps>

export default meta
type Story = StoryObj<ShimmerProps>

export const Playground: Story = {}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* The spec's own "Текст"/"Фигура" split is usage guidance for which
          `shape` + sizing to reach for, not two separate components. */}
      <StatesMatrix<ShimmerProps>
        columns={[
          { label: "square", props: { shape: "square" } },
          { label: "circle", props: { shape: "circle" } },
        ]}
        rows={[
          { label: "Строка текста", props: { className: "h-4 w-48" } },
          { label: "Заголовок", props: { className: "h-6 w-64" } },
          { label: "Мелкая подпись", props: { className: "h-3 w-24" } },
          { label: "Фигура 48×48", props: { className: "size-12" } },
          { label: "Кнопка", props: { className: "h-10 w-28" } },
        ]}
        render={(props) => <Shimmer {...props} />}
      />

      <StoryShowcase className="bg-transparent p-0">
        <StorySection
          title="Скелет карточки"
          description="Из тех же примитивов собирается заглушка любого блока."
        >
          <div className="flex max-w-sm flex-col gap-3 rounded-2xl border p-4">
            <div className="flex items-center justify-between gap-4">
              <Shimmer className="h-4 w-40" />
              <Shimmer className="h-5 w-16" />
            </div>
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-3/4" />
            <div className="flex items-center gap-3">
              <Shimmer shape="circle" className="size-8" />
              <Shimmer className="h-3 w-24" />
            </div>
          </div>
        </StorySection>
      </StoryShowcase>
    </div>
  ),
}
