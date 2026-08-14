import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { Button } from "@/components/ui/button"

/* Свойства унаследованы из компонент-сета «ELK / button menu» (нода
   4244:20536) и его под-компонентов «Pabel Of Buttons (Primary/Secondary,
   ELK)» (41357:38739 / 41357:45337):

     Type            = With Primary | Only Secondary
     Number Of Buttons = 1 | 2 | 3 | 4

   Дизайн-чек №14: раньше в контролах были только два текстовых поля с
   подписями кнопок и булев `thirdButton`, то есть нельзя было ни выбрать
   одну или четыре кнопки, ни переключить первую кнопку между брендовой и
   серой. Теперь оба свойства Figma представлены явно. */
const TYPES = ["With Primary", "Only Secondary"] as const
type MenuType = (typeof TYPES)[number]

const BUTTON_COUNTS = [1, 2, 3, 4] as const
type ButtonCount = (typeof BUTTON_COUNTS)[number]

/* Подписи для примера — по спецификации Secondary-кнопки идут в порядке
   «первыми наиболее часто используемые». */
const LABELS = ["Сохранить", "Отмена", "Предпросмотр", "Экспорт"]

/* Возвращает массив, а НЕ компонент-обёртку: ButtonMenu приводит кнопки к
   размеру lg через React.Children.map + cloneElement, а он видит только
   прямых детей — обёртка спрятала бы их на уровень глубже, и кнопки остались
   бы дефолтного размера. Массив React.Children.map разворачивает. */
function menuButtons(type: MenuType, count: ButtonCount) {
  return LABELS.slice(0, count).map((label, index) => (
    <Button
      key={label}
      // «Кнопка Primary всегда располагается слева» — брендовой может быть
      // только первая, и только в типе With Primary.
      variant={index === 0 && type === "With Primary" ? "primary" : "secondary-grey"}
    >
      {label}
    </Button>
  ))
}

function Overflow() {
  return (
    <ButtonMenuOverflow>
      <ButtonMenuOverflowItem text="Дублировать" description="Создать копию" />
      <ButtonMenuOverflowItem text="Удалить" />
    </ButtonMenuOverflow>
  )
}

interface PlaygroundArgs {
  type: MenuType
  buttons: ButtonCount
  overflow: boolean
}

const meta = {
  title: "Компоненты/Button Menu",
  // No `component:` — ButtonMenu takes only `children`, so the Playground's
  // controls are synthetic (which buttons to put in the bar) and would not
  // typecheck against the real prop type.
  //
  // ButtonMenu is a full-width, bottom-anchored bar (not a floating w-fit
  // pill — see root.tsx's design-check #5 note), so it's shown inside a
  // fixed-width container that stands in for its usual content area rather
  // than Storybook's unconstrained "centered" canvas, which would otherwise
  // stretch it edge-to-edge across the whole preview.
  parameters: { layout: "padded" },
  argTypes: {
    type: {
      name: "Type",
      description: "Свойство Type компонента ELK / button menu",
      control: "inline-radio",
      options: TYPES,
    },
    buttons: {
      name: "Number Of Buttons",
      description: "Количество кнопок в панели — от одной до четырёх",
      control: "inline-radio",
      options: BUTTON_COUNTS,
    },
    overflow: {
      name: "Меню «ещё»",
      description:
        "По спецификации кнопка More допустима только когда показаны три кнопки",
      control: "boolean",
    },
  },
  args: {
    type: "With Primary",
    buttons: 3,
    overflow: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ type, buttons, overflow }) => (
    <div className="w-[640px]">
      <ButtonMenu>
        {menuButtons(type, buttons)}
        {overflow && <Overflow />}
      </ButtonMenu>
    </div>
  ),
}

/* ButtonMenu is a composition (a bar plus whatever buttons the page puts in
   it), so there is no prop grid to enumerate — Figma's page shows the same
   handful of arrangements instead. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      {TYPES.map((type) => (
        <StorySection
          key={type}
          title={
            type === "With Primary"
              ? "Type = With Primary — панель с кнопками, с кнопкой Primary"
              : "Type = Only Secondary — панель с кнопками, только Secondary"
          }
          description={
            type === "With Primary"
              ? "Кнопка Primary всегда располагается слева. Количество кнопок — от одной до четырёх."
              : "Когда ни одно действие не является основным. Количество кнопок — от одной до четырёх."
          }
        >
          <div className="flex w-[640px] flex-col gap-4">
            {BUTTON_COUNTS.map((count) => (
              <ButtonMenu key={count}>
                {menuButtons(type, count)}
              </ButtonMenu>
            ))}
          </div>
        </StorySection>
      ))}

      <StorySection
        title="С меню «ещё»"
        description="Кнопка More может использоваться только в случае, если отображаются три кнопки."
      >
        <div className="w-[640px]">
          <ButtonMenu>
            {menuButtons("With Primary", 3)}
            <Overflow />
          </ButtonMenu>
        </div>
      </StorySection>

      <StorySection title="Только меню «ещё»">
        <Overflow />
      </StorySection>
    </StoryShowcase>
  ),
}
