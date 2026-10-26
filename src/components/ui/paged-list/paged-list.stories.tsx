import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase, ViewportMatrix, sizeArgType } from "@/stories/matrix"
import { TASKS } from "@/stories/new-components-fixtures"
import { ViewportScope, type Viewport } from "@/lib/viewport"
import { Item } from "@/components/ui/item"

import { PagedList, type PagedListProps } from "./paged-list"

/**
 * Paged List — мобильный постраничный список (Правки UI-Kit от 25.10, пункт
 * «Постраничный список и точки карусели»): строки по N на страницу,
 * горизонтальная нативная прокрутка со scroll-snap, страницы одной высоты,
 * под списком точки (12 от списка, 16 до низа). На десктопе — обычный список.
 */
type PlaygroundArgs = Omit<PagedListProps, "paged"> & {
  viewport?: Viewport
  rows?: number
  paged?: "auto" | "on" | "off"
}

const meta = {
  title: "Компоненты/Paged List",
  // `component` не задан: аргументы Playground (`data` пресетом) не совпадают с пропсами.
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    pageSize: { control: { type: "range", min: 1, max: 8 } },
    rows: { control: { type: "range", min: 1, max: TASKS.length } },
    paged: {
      control: { type: "inline-radio", labels: { auto: "по виду", on: "всегда", off: "никогда" } },
      options: ["auto", "on", "off"],
      description: "Листать страницами: по умолчанию — только в мобильном виде",
    },
    getPageLabel: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    viewport: "mobile" as Viewport,
    pageSize: 4,
    rows: 7,
    paged: "auto",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function Tasks({ count = TASKS.length, ...props }: Omit<PagedListProps, "children"> & { count?: number }) {
  return (
    <div className="w-full max-w-[400px] overflow-hidden rounded-[16px] bg-[var(--card-box-bg)]">
      <PagedList {...props}>
        {TASKS.slice(0, count).map(([value, text]) => (
          <Item key={value} value={value} text={text} rightElement="navigation" onClick={() => {}} />
        ))}
      </PagedList>
    </div>
  )
}

export const Playground: Story = {
  render: ({ viewport, rows, paged, ...args }) => (
    <div className="bg-[var(--page-bg)] p-4">
      <ViewportScope viewport={viewport}>
        <Tasks
          {...args}
          count={rows}
          paged={paged === "auto" ? undefined : paged === "on"}
        />
      </ViewportScope>
    </div>
  ),
}

export const Examples: Story = {
  name: "Examples (Дела, Счета, десктоп)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="«Дела» — по 4 строки"
        description="7 строк: 2 страницы (4 + 3), высота блока одна на обеих"
      >
        <ViewportMatrix>{() => <Tasks pageSize={4} />}</ViewportMatrix>
      </StorySection>
      <StorySection title="«Счета» — по 3 строки" description="5 строк: 2 страницы">
        <ViewportScope viewport="mobile">
          <Tasks pageSize={3} count={5} />
        </ViewportScope>
      </StorySection>
      <StorySection title="Одна страница" description="Строк не больше N — ни ленты, ни точек">
        <ViewportScope viewport="mobile">
          <Tasks pageSize={4} count={3} />
        </ViewportScope>
      </StorySection>
    </StoryShowcase>
  ),
}
