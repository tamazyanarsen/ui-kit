import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  toggleArgType,
} from "@/stories/matrix"
import type { Viewport } from "@/lib/viewport"
import {
  ItemInformationField,
  ItemInformationFieldGroup,
} from "@/components/ui/item-information-field"

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
    // Дизайн-чек от 07.09, замечание 5: у полей Label Left зазор нулевой —
    // отступы и линию несёт само поле. Здесь был `gap-6`, и между строками
    // зияла пустая полоса. Правило теперь держит `ItemInformationFieldGroup`.
    <ItemInformationFieldGroup>
      {Array.from({ length: count }, (_, index) => {
        const [label, value] = ROWS[index % ROWS.length]
        return (
          <ItemInformationField key={index} label={label} value={value} />
        )
      })}
    </ItemInformationFieldGroup>
  )
}

function SampleTable() {
  return (
    <table className="w-full border-collapse text-p2-medium">
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
  /* Панель повторяет «Свойства компонента» `ELK / card-box` (компонент-сет
     70333:11271, таблица 70333:11363): Size / Type — плюс булевы слоты
     мастера. */
  argTypes: {
    viewport: sizeArgType,
    type: optionsArgType(
      "Type",
      { large: "Large", small: "Small", table: "Table" },
      "inline-radio"
    ),
    showTitle: toggleArgType("Show Title"),
    showScrollbar: {
      name: "Show Scrollbar",
      control: "inline-radio",
      options: [undefined, true, false],
      description:
        "Разделители «контент не поместился» у типа small. По умолчанию (пусто) считаются сами по положению скролла",
    },
    title: { control: "text", table: { category: "Контент" } },
    maxHeight: {
      control: { type: "number" },
      description: "Ограничение высоты для small, по умолчанию 792px",
      table: { category: "Контент" },
    },
    children: { control: false },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook. */
  args: {
    viewport: "desktop" as Viewport,
    type: "large",
    showTitle: true,
    title: "Title",
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
            // showScrollbar здесь НЕ форсится: строка прокручивается
            // по-настоящему, а сторону разделителя решает положение
            // прокрутки (дизайн-чек от 07.09, замечание 6).
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
