import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Divider, type DividerProps } from "./divider"

/**
 * Divider — «ELK / divider» (нода 58890:9260), самостоятельный
 * версионированный компонент Figma. Истории у него не было, хотя он стоит
 * в шапке, в футерах Calendar и Dropdown, в Profile Menu и в таблицах.
 *
 * Свойство у него одно — ориентация: горизонтальная линия между строками
 * и вертикальная между парой кнопок. Отдельного варианта под «рамку
 * соседа» нет намеренно: разделитель, нарисованный border'ом на соседнем
 * элементе (правила прокрутки у Modal, `divide-y` у Notification),
 * компонентом не оформляется — это отдельная линия, а не рамка.
 */
const meta = {
  title: "Компоненты/Divider",
  component: Divider,
  parameters: { layout: "padded" },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Горизонтальная линия во всю ширину или вертикальная во всю высоту",
    },
  },
  args: { orientation: "horizontal" },
} satisfies Meta<DividerProps>

export default meta
type Story = StoryObj<DividerProps>

export const Playground: Story = {
  render: (args) => (
    <div className="flex h-24 w-full items-center">
      <Divider {...args} />
    </div>
  ),
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Горизонтальный"
        description="Занимает всю ширину контейнера — разделяет строки списка или секции карточки."
      >
        <div className="flex w-full max-w-md flex-col gap-4">
          <span className="text-p1-medium text-[var(--btn-primary-fg)]">Раздел выше</span>
          <Divider />
          <span className="text-p1-medium text-[var(--btn-primary-fg)]">Раздел ниже</span>
        </div>
      </StorySection>

      <StorySection
        title="Вертикальный"
        description="Растягивается на всю высоту строки — так он стоит между кнопками футера Dropdown и в нижнем ряду шапки."
      >
        <div className="flex h-10 items-center gap-4">
          <span className="text-p1-medium text-[var(--btn-primary-fg)]">Слева</span>
          <Divider orientation="vertical" />
          <span className="text-p1-medium text-[var(--btn-primary-fg)]">Справа</span>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
