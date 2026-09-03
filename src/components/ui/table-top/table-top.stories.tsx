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
  /* Дизайн-чек 3/3 №25: контролы разложены по тем же четырём таблицам
     свойств, что и в макете (1246:196999), и названы так же — иначе список
     не сверить. Категории Storybook повторяют названия таблиц. */
  argTypes: {
    title: { control: "text", table: { category: "Table Top" } },
    showTitle: {
      control: "boolean",
      name: "Show Title",
      table: { category: "Table Top" },
    },
    showTab: {
      control: "boolean",
      name: "Show Tab",
      table: { category: "Table Top" },
    },
    showFilter: {
      control: "boolean",
      name: "Show Filter",
      description: "Строка фильтров целиком — вместе с «Ещё фильтры»",
      table: { category: "Table Top" },
    },

    showButton: {
      control: "boolean",
      name: "Show Button",
      table: { category: "Title Options" },
    },

    chipsCount: {
      name: "Number of Chips",
      control: { type: "range", min: 1, max: CHIP_LABELS.length, step: 1 },
      description: "Сколько фильтров-чипов в панели; лишние скрыты под «Ещё фильтры»",
      table: { category: "Chips Table" },
    },
    showSearch: {
      control: "boolean",
      name: "Show Search",
      table: { category: "Chips Table" },
    },
    showLastChips: {
      control: "boolean",
      name: "Show Last Chips",
      description: "Кнопка «Ещё фильтры» / «Скрыть фильтры»",
      table: { category: "Chips Table" },
    },
    showCleanFilter: {
      control: "boolean",
      name: "Show Clean Filter",
      description: "Кнопка «Сбросить фильтры» (видна, когда фильтры выбраны)",
      table: { category: "Chips Table" },
    },

    resultType: {
      control: "inline-radio",
      options: ["Setting", "Select"],
      name: "Type",
      description: "Справа в строке итогов: кнопки управления или сортировка",
      table: { category: "Filter Options" },
    },
    showFilters: {
      control: "boolean",
      name: "Show Filters",
      description: "Индикаторы «Выбрано фильтров» и «Результатов»",
      table: { category: "Filter Options" },
    },
    showSelect: {
      control: "boolean",
      name: "Show Select",
      description: "Поле сортировки — только при Type=Select",
      table: { category: "Filter Options" },
    },
    showSetting: {
      control: "boolean",
      name: "Show Setting",
      description: "Кнопка «Настроить столбцы» — только при Type=Setting",
      table: { category: "Filter Options" },
    },
    showDownload: {
      control: "boolean",
      name: "Show Download",
      description: "Кнопка «Скачать» — только при Type=Setting",
      table: { category: "Filter Options" },
    },

    // Четвёртое булево свойство `ELK / table-top` (сет 51104:13311,
    // Version 1.0.2, Release 67.31) — имя контрола как в панели «Свойства
    // компонента», а не как слот в коде.
    showDetails: {
      control: "boolean",
      name: "Show Summary",
      description:
        "Постоянная нижняя строка шапки: подпись «Сводка» и лента пар «параметр: значение». Умолчание — выключено: дока кита называет её дополнительной функцией, наличие которой определяется при разработке продукта",
      table: { category: "Table Top" },
    },
  },
  args: {
    title: "Заголовок таблицы",
    showTitle: true,
    showTab: true,
    showFilter: true,
    showButton: true,
    chipsCount: 2,
    showSearch: true,
    showLastChips: true,
    showCleanFilter: true,
    resultType: "Setting",
    showFilters: true,
    showSelect: false,
    showSetting: true,
    showDownload: true,
    showDetails: false,
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
