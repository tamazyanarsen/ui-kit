import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { PageScrollbar } from "./page-scrollbar"
import { Scrollbar } from "./scrollbar"
import { Checkbox } from "@/components/ui/checkbox"

type ScrollbarProps = ComponentProps<typeof Scrollbar>

const meta = {
  title: "Компоненты/Scrollbar",
  component: Scrollbar,
  parameters: { layout: "padded" },
  argTypes: {
    orientation: {
      name: "Orientation",
      control: {
        type: "inline-radio",
        labels: { vertical: "Vertical", horizontal: "Horizontal" },
      },
      options: ["vertical", "horizontal"],
    },
    // Дизайн-чек от 07.09, замечание 26: «Для выпадающих списков Scrollbar
    // не может вылезать за контур. Всегда у Scrollbar есть отступы… для
    // скруглённых выпадающих списков отступ ещё больше».
    inset: {
      name: "Inset",
      control: "inline-radio",
      options: ["none", "dropdown", "rounded", "panel"],
      description: "Отступ полосы от края поверхности: нет / 8px / 16px / панель меню (8, сверху 8, снизу 48)",
    },
    // Правки UI-Kit от 25.10: видимость наложенной полосы и передача колеса.
    visibility: {
      name: "Visibility",
      control: "inline-radio",
      options: ["always", "hover", "scroll"],
      description:
        "always — всегда при переполнении; hover — при наведении и прокрутке (блоки); scroll — только во время прокрутки. В мобильном виде и на тач-устройствах — всегда как scroll",
    },
    wheelHandoff: {
      name: "Wheel handoff",
      control: "boolean",
      description:
        "Передача колеса странице у края (блок держит колесо 500 мс) и перехват колеса у страницы. По умолчанию включено вместе с visibility=hover",
    },
  },
  args: { orientation: "vertical", inset: "dropdown", visibility: "always", wheelHandoff: false },
} satisfies Meta<ScrollbarProps>

export default meta
type Story = StoryObj<ScrollbarProps>

function CheckboxList({ count = 8 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <Checkbox label={`Label ${i + 1}`} />
        </li>
      ))}
    </ul>
  )
}

function Tiles() {
  return (
    <div className="flex w-[900px] gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-16 w-32 shrink-0 rounded-lg bg-[var(--filter-grey-bg)]" />
      ))}
    </div>
  )
}

export const Playground: Story = {
  render: (args) =>
    args.orientation === "horizontal" ? (
      <Scrollbar {...args} className="w-80 rounded-2xl bg-white p-4">
        <Tiles />
      </Scrollbar>
    ) : (
      <Scrollbar {...args} className="h-52 w-56 rounded-2xl bg-white py-2 pl-4">
        <CheckboxList />
      </Scrollbar>
    ),
}

/* Бегунок существует только пока содержимое не помещается, и чтобы его
   увидеть, надо прокрутить, — поэтому все варианты показаны живыми
   прокручиваемыми панелями, а не статичными ячейками матрицы. Витрина
   монтирует `PageScrollbar`: справа у окна — полоса страницы кита (только
   бегунок, 4 от края), а голые области `.themed-scrollbar` получают
   наложенную полосу автоматически. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <>
      <PageScrollbar />
      <StoryShowcase>
        <StorySection
          title="Вертикальный"
          description="Полоса появляется при переполнении по высоте и места у содержимого не занимает."
        >
          <Scrollbar orientation="vertical" className="h-52 w-56 rounded-2xl bg-white py-2 pl-4">
            <CheckboxList />
          </Scrollbar>
        </StorySection>

        <StorySection title="Горизонтальный" description="То же самое по ширине, толщина 8.">
          <Scrollbar orientation="horizontal" className="w-80 rounded-2xl bg-white p-4">
            <Tiles />
          </Scrollbar>
        </StorySection>

        <StorySection
          title="Блок (visibility=hover)"
          description="Полоса видна при наведении и во время прокрутки; дорожка 8 от верха и 32 от низа. У края блок держит колесо 500 мс, потом отдаёт странице."
        >
          <div className="relative w-80 rounded-[32px] bg-white pr-2">
            <Scrollbar
              visibility="hover"
              className="h-72 py-8 pr-6 pl-8 [--ovs-end:32px] [--ovs-start:8px]"
            >
              <CheckboxList count={14} />
            </Scrollbar>
          </div>
        </StorySection>

        <StorySection
          title="Только во время прокрутки (visibility=scroll)"
          description="Так ведут себя все полосы в мобильном виде и на тач-устройствах: появление 150 мс, угасание 400 мс через 800 мс после остановки."
        >
          <Scrollbar visibility="scroll" inset="dropdown" className="h-52 w-56 rounded-2xl bg-white py-2 pl-4">
            <CheckboxList />
          </Scrollbar>
        </StorySection>

        <StorySection
          title="Голая область .themed-scrollbar"
          description="Класс без компонента (так делают выпадающие списки): полосу подключает PageScrollbar."
        >
          <div className="themed-scrollbar h-52 w-56 overflow-y-auto rounded-2xl bg-white py-2 pl-4">
            <CheckboxList />
          </div>
        </StorySection>

        <StorySection
          title="Полоса страницы"
          description="Высокий блок ниже делает страницу прокручиваемой: справа у окна бегунок кита 4 px от края, без дорожки."
        >
          <div className="h-[150vh] w-56 rounded-2xl bg-[var(--filter-grey-bg)]" />
        </StorySection>
      </StoryShowcase>
    </>
  ),
}
