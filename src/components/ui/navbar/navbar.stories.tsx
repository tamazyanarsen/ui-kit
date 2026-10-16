import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"
import { TitleCard } from "@/components/ui/title"

import { Navbar, type NavbarProps } from "./navbar"

/* Navbar — `ELK / navbar`, канвас «Header, Menu» (сет 70482:6600, дока
   70482:6613). Таблица «Свойства» макета: Type (Top, Scroll), Show Date,
   Show Help. Значение `· Auto` — кита: полоса сама становится Scroll, когда
   экран проскроллен до неё, — так и описано взаимодействие в доке. */

type PlaygroundArgs = {
  type: NonNullable<NavbarProps["type"]>
  showDate: boolean
  showHelp: boolean
}

const BLOCKS = ["Кредитная линия", "Ближайший платёж", "Параметры договора", "Документы"]

function NavbarDemo({ type, showDate, showHelp }: PlaygroundArgs) {
  return (
    // Экран 360×640 со своей прокруткой — на нём видно, как полоса
    // прилипает и меняет форму.
    <div className="h-[640px] w-[360px] overflow-y-auto bg-[var(--page-bg)]">
      <div className="flex h-14 items-center bg-[var(--white-101)] px-4 text-p3-medium">
        Шапка
      </div>
      <Navbar type={type} showHelp={showHelp} date={showDate ? "21 сентября" : undefined} />
      <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
        <TitleCard title="Кредитный договор 01-0015/ИЖС" tag="Действующий" />
        {BLOCKS.concat(BLOCKS).map((title, index) => (
          <div key={index} className="h-48 rounded-[16px] bg-[var(--white-101)] p-4 text-h4-mobile">
            {title}
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: "Компоненты/Navbar",
  component: NavbarDemo,
  parameters: { layout: "padded" },
  argTypes: {
    type: {
      name: "Type",
      description: "Top — до прокрутки, Scroll — после. · Auto выбирает тип по прокрутке",
      control: { type: "inline-radio", labels: { top: "Top", scroll: "Scroll", auto: "· Auto" } },
      options: ["top", "scroll", "auto"],
    },
    showDate: {
      name: "Show Date",
      control: "boolean",
      description: "Плашка даты по центру — только у типа Scroll",
    },
    showHelp: { name: "Show Help", control: "boolean" },
  },
  args: { type: "auto", showDate: true, showHelp: true },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

/* Варианты сета: строки — Type, колонки — опциональные элементы. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { controls: { disable: true } },
  render: () => (
    <StatesMatrix<NavbarProps>
      rowHeader="Type"
      columns={[
        { label: "Все элементы", props: { showHelp: true, date: "21 сентября" } },
        { label: "Без справки", props: { showHelp: false, date: "21 сентября" } },
        { label: "Без даты", props: { showHelp: true } },
      ]}
      rows={[
        { label: "Top", props: { type: "top" } },
        { label: "Scroll", props: { type: "scroll" } },
      ]}
      render={(props) => (
        <div className="w-[360px]">
          <Navbar sticky={false} {...props} />
        </div>
      )}
    />
  ),
}
