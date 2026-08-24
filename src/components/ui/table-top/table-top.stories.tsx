import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  TableTop,
  TableTopDetails,
  TableTopTitle,
} from "@/components/ui/table-top"
import { StorySection, StoryShowcase } from "@/stories/matrix"
import {
  CHIP_LABELS,
  FullExample,
  SortSummaryExample,
  type FullExampleProps,
} from "@/stories/table-top-example"

/* Table Top is a slot container (title / toolbar / summary), not a
   prop-driven component — it has no props of its own beyond `children`.
   The Playground's controls therefore switch the *slots* on and off, which
   is the only variant axis the component actually has. */
const meta = {
  title: "Компоненты/Table Top",
  component: FullExample,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    showTitleAction: { control: "boolean" },
    showTabs: { control: "boolean" },
    showSearch: { control: "boolean" },
    showFilters: { control: "boolean" },
    chipsCount: {
      name: "Number of Chips",
      control: { type: "range", min: 1, max: CHIP_LABELS.length, step: 1 },
      description: "Сколько фильтров-чипов в панели; лишние скрыты под «Ещё фильтры»",
    },
    showActions: { control: "boolean" },
    showDetails: { control: "boolean" },
  },
  args: {
    title: "Заголовок таблицы",
    showTitleAction: true,
    showTabs: true,
    showSearch: true,
    showFilters: true,
    chipsCount: 2,
    showActions: true,
    showDetails: true,
  },
} satisfies Meta<FullExampleProps>

export default meta
type Story = StoryObj<FullExampleProps>

export const Playground: Story = {}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Полная сборка"
        description="Заголовок, вкладки, поиск, фильтры и кнопки действий."
      >
        <div className="w-full">
          <FullExample />
        </div>
      </StorySection>

      <StorySection
        title="Строка итогов с сортировкой"
        description="Label и Value отличаются только цветом — оба P2 Medium."
      >
        <div className="w-full">
          <SortSummaryExample />
        </div>
      </StorySection>

      <StorySection
        title="Сводка (Details)"
        description="Лента «label: value» с разделителями Grey 166; при переполнении прокручивается по горизонтали независимо от таблицы."
      >
        <div className="w-full">
          <TableTop>
            <TableTopDetails
              items={[
                { label: "Кешбэк", value: "17 шт" },
                { label: "Поступления", value: "15 шт" },
                { label: "Сумма операций", value: "40 500 000,00 ₽" },
                { label: "Сумма параметра №1", value: "1 500 000,00 ₽" },
                { label: "Сумма параметра №2", value: "500 000,00 ₽" },
              ]}
            />
          </TableTop>
        </div>
      </StorySection>

      <StorySection
        title="Только заголовок"
        description="Table Top — прозрачный блок с одной нижней линией, не карточка."
      >
        <div className="w-full">
          <TableTop>
            <TableTopTitle title="Сотрудники" />
          </TableTop>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
