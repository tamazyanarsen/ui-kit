import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StorySection,
  StoryShowcase,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import { FilterSearchField, OperationFilters } from "@/stories/filter-fixtures"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { FilterBar, type FilterBarProps } from "./filter-bar"

/**
 * FilterBar — ряд фильтров над списком (Правки UI-Kit от 25.10, «Ряд
 * фильтров — нет мобильного режима „кнопка Фильтры + штора“»).
 *
 *   Size  Desktop — поиск и фильтры в ряд;
 *         Mobile  — поиск во всю ширину, под ним кнопка «Фильтры» со
 *                   счётчиком активных; по нажатию штора «Фильтры», где
 *                   каждый фильтр — полем (таблетки, поля суммы, дата, флаг),
 *                   выбор — черновик до «Применить».
 *
 * Фильтры ряда — обычные `FilterSelect`, `FilterRange`, `FilterDate`,
 * `FilterSingleSelect`, `FilterBoolean`: на мобиле они сами отдают ряду свою
 * форму для шторы. Без `FilterBar` каждый работает как раньше.
 */
type PlaygroundArgs = FilterBarProps & {
  viewport?: Viewport
  showSearch?: boolean
}

const meta = {
  title: "Компоненты/Filter Bar",
  component: FilterBar,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    showSearch: toggleArgType("Show Search", "Поле поиска перед фильтрами (на мобиле — над кнопкой)"),
    sheetTitle: {
      control: "text",
      name: "Подпись кнопки",
      description: "Подпись кнопки и заголовок шторы в мобильном виде",
      table: { category: "Контент" },
    },
    search: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    viewport: "mobile" as Viewport,
    showSearch: true,
    sheetTitle: "Фильтры",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, showSearch, ...args }) => (
    <ViewportScope viewport={viewport}>
      <FilterBar {...args} search={showSearch ? <FilterSearchField /> : undefined}>
        <OperationFilters />
      </FilterBar>
    </ViewportScope>
  ),
}

export const Examples: Story = {
  name: "Examples (Desktop / Mobile)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Desktop — ряд"
        description="Поиск (Input variant=filter-search) и фильтры в ряд через 8"
      >
        <ViewportScope viewport="desktop">
          <FilterBar search={<FilterSearchField />}>
            <OperationFilters />
          </FilterBar>
        </ViewportScope>
      </StorySection>
      <StorySection
        title="Mobile — кнопка «Фильтры» и штора"
        description="Счётчик на кнопке — число применённых фильтров; нажатие открывает штору со всеми фильтрами полями"
      >
        <div className="w-[375px] bg-[var(--modal-bg)] p-4">
          <ViewportScope viewport="mobile">
            <FilterBar search={<FilterSearchField />}>
              <OperationFilters />
            </FilterBar>
          </ViewportScope>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
