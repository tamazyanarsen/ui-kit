import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { PseudoBox, StatesMatrix, viewportArgType } from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"
import { ItemInformationField } from "@/components/ui/item-information-field"

import { CardBox } from "./card-box"

type CardBoxProps = ComponentProps<typeof CardBox>

/* Ось `Size` (Desktop | Mobile) в макете есть, но пропом не выставляется —
   её даёт общий контрол `viewport`. */
type PlaygroundArgs = CardBoxProps & { viewport?: Viewport }

const ROWS = [
  ["Номер договора", "БК-2024-000148"],
  ["Дата заключения", "12.03.2024"],
  ["Срок действия", "до 12.03.2027"],
  ["Ответственный", "Иванова Мария Сергеевна"],
  ["Статус", "Действует"],
  ["Подразделение", "Управление корпоративного обслуживания"],
]

function SampleFields({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: count }, (_, index) => {
        const [label, value] = ROWS[index % ROWS.length]
        return (
          <ItemInformationField key={index} label={label} value={value} />
        )
      })}
    </div>
  )
}

function SampleTable() {
  return (
    <table className="w-full border-collapse text-p2-regular">
      <tbody>
        {ROWS.slice(0, 4).map(([label, value]) => (
          <tr key={label} className="border-t border-[#DEDEDE]">
            <td className="px-4 py-3 text-[#6D6D6D]">{label}</td>
            <td className="px-4 py-3 text-right">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const meta = {
  title: "Компоненты/Card Box",
  component: CardBox,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: viewportArgType,
    type: {
      control: "inline-radio",
      options: ["large", "small", "table"],
      description:
        "Тип блока: large — заголовок и контент в одной колонке; small — шапка отдельно, контент скроллится под ней; table — слот во всю ширину",
    },
    title: { control: "text" },
    showTitle: { control: "boolean" },
    showScrollbar: {
      control: "inline-radio",
      options: [undefined, true, false],
      description:
        "Разделители «контент не поместился» у типа small. По умолчанию (пусто) считаются сами по положению скролла",
    },
    maxHeight: {
      control: { type: "number" },
      description: "Ограничение высоты для small, по умолчанию 792px",
    },
    children: { control: false },
  },
  args: {
    viewport: "auto" as Viewport,
    type: "large",
    title: "Title",
    showTitle: true,
    maxHeight: 280,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, type, ...args }) => (
    <PseudoBox viewport={viewport} className="w-full bg-[#F8F8F8] p-6">
      <CardBox type={type} {...args}>
        {type === "table" ? <SampleTable /> : <SampleFields count={8} />}
      </CardBox>
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<CardBoxProps>
      responsive
      stretch
      cellClassName="min-w-[360px] bg-[#F8F8F8]"
      baseProps={{ title: "Title" }}
      columns={[
        { label: "С заголовком", props: {} },
        { label: "Без заголовка", props: { showTitle: false } },
      ]}
      rows={[
        {
          label: "Large",
          props: { type: "large", children: <SampleFields count={2} /> },
        },
        {
          label: "Small\n(контент помещается)",
          props: {
            type: "small",
            maxHeight: 260,
            children: <SampleFields count={2} />,
          },
        },
        {
          label: "Small\n(скролл)",
          props: {
            type: "small",
            maxHeight: 260,
            showScrollbar: true,
            children: <SampleFields count={8} />,
          },
        },
        {
          label: "Table",
          props: { type: "table", children: <SampleTable /> },
        },
      ]}
      render={(props) => <CardBox {...props} />}
    />
  ),
}
