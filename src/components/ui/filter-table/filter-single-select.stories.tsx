import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, sizeArgType } from "@/stories/matrix"
import { TERM_OPTIONS } from "@/stories/filter-fixtures"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import {
  FilterSingleSelect,
  type FilterSingleSelectProps,
} from "./filter-single-select"

/**
 * FilterSingleSelect — фильтр с одиночным выбором (Правки UI-Kit от 25.10).
 *
 * Строки — обычные пункты списка (наведение Grey 114, нажатие Grey 124), без
 * галок и чекбоксов; выбор сразу применяет и закрывает список, чип становится
 * тёмным с названием варианта и крестиком сброса. Клавиатура: стрелки,
 * Home/End, Enter/пробел, Esc.
 *
 * Mobile — штора со строками во всю ширину; у выбранной галка справа.
 */
type PlaygroundArgs = FilterSingleSelectProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/Filter Single Select",
  component: FilterSingleSelect,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    disabled: { control: "boolean", name: "Disabled" },
    label: { control: "text", table: { category: "Контент" } },
    defaultValue: {
      name: "Выбрано по умолчанию",
      control: { type: "select", labels: { "": "— ничего —" } },
      options: ["", ...TERM_OPTIONS.map((option) => option.value)],
      table: { category: "Контент" },
    },
    options: { table: { category: "Контент" } },
    value: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    disabled: false,
    label: "Истекает",
    defaultValue: "",
    options: TERM_OPTIONS,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, defaultValue, ...args }) => (
    <ViewportScope viewport={viewport}>
      {/* `key` — неуправляемое значение по умолчанию читается один раз,
          смена контрола пересоздаёт фильтр. */}
      <div className="h-80">
        <FilterSingleSelect
          key={String(defaultValue)}
          {...args}
          defaultValue={defaultValue || null}
        />
      </div>
    </ViewportScope>
  ),
}

export const Examples: Story = {
  name: "Examples (состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      {(["desktop", "mobile"] as const).map((viewport) => (
        <StorySection
          key={viewport}
          title={viewport === "desktop" ? "Desktop" : "Mobile"}
          description="Ничего не выбрано / выбран вариант / длинный вариант / выключен"
        >
          <ViewportScope viewport={viewport}>
            <FilterSingleSelect label="Истекает" options={TERM_OPTIONS} />
            <FilterSingleSelect label="Истекает" options={TERM_OPTIONS} defaultValue="7" />
            <FilterSingleSelect label="Истекает" options={TERM_OPTIONS} defaultValue="custom" />
            <FilterSingleSelect label="Истекает" options={TERM_OPTIONS} disabled />
          </ViewportScope>
        </StorySection>
      ))}
    </StoryShowcase>
  ),
}
