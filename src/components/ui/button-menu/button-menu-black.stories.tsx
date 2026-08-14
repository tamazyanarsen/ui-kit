import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { ButtonMenuBlack } from "./black"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { Button } from "@/components/ui/button"

/* Дизайн-чек №13: «в дизайн-системе на самом деле button-menu и
   button-menu-black это два отдельных компонента. Каждому из них нужна
   отдельная матрица переключений и отдельная матрица полных отображений».
   Раньше чёрная панель была одной секцией внутри историй Button Menu.

   Свойства унаследованы из компонент-сета «ELK / button menu (black)»
   (нода 700:54288):

     Button = None | One | Two | Three | Four

   Плюс информационный бар: «элементы информационного бара, располагающегося
   в правой части панели, можно при необходимости частично или полностью
   отключить» (нода 4008:30588) — отсюда переключатель количества полей. */
const BUTTON_COUNTS = [0, 1, 2, 3, 4] as const
type ButtonCount = (typeof BUTTON_COUNTS)[number]

const FIGMA_BUTTON_NAMES: Record<ButtonCount, string> = {
  0: "None",
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
}

const LABELS = ["Подписать", "Скачать", "Отправить", "Удалить"]

/* «Выбрано» Figma фиксирует шириной 64px, остальные колонки — по контенту. */
const INFO_ITEMS = [
  { label: "Выбрано", value: "3 документа", className: "w-16" },
  { label: "Сумма", value: "1 200 101,16 ₽" },
  { label: "Счёт", value: "40702810…1234" },
]

interface PlaygroundArgs {
  buttons: ButtonCount
  overflow: boolean
  infoFields: 0 | 1 | 2 | 3
  showClose: boolean
  pinned: boolean
}

/* Возвращает массив, а НЕ компонент-обёртку: ButtonMenuBlack приводит кнопки
   к нужному размеру и варианту через React.Children.map + cloneElement, а он
   видит только прямых детей. Компонент-обёртка спрятала бы кнопки на уровень
   глубже — и они остались бы брендовыми, как и было в дизайн-чеке. Массив
   React.Children.map разворачивает, поэтому так всё работает. */
function blackButtons(count: ButtonCount) {
  // Вариант намеренно не передаётся: ButtonMenuBlack форсит secondary-white
  // для всех кнопок (дизайн-чек №12).
  return LABELS.slice(0, count).map((label) => <Button key={label}>{label}</Button>)
}

const meta = {
  title: "Компоненты/Button Menu Black",
  parameters: { layout: "padded" },
  argTypes: {
    buttons: {
      name: "Button",
      description: "Свойство Button компонента ELK / button menu (black)",
      control: "inline-radio",
      options: BUTTON_COUNTS,
    },
    overflow: {
      name: "Меню «ещё»",
      description:
        "«Количество кнопок не превышает трёх, при необходимости дополнительный функционал скрывается в элемент More»",
      control: "boolean",
    },
    infoFields: {
      name: "Полей в информационном баре",
      description: "Бар можно отключить частично или полностью",
      control: "inline-radio",
      options: [0, 1, 2, 3],
    },
    showClose: { name: "Крестик", control: "boolean" },
    pinned: {
      name: "Закреплена снизу",
      description:
        "«Button Menu всегда закрепляется в нижней части контентной области» — поэтому включено по умолчанию",
      control: "boolean",
    },
  },
  args: {
    buttons: 2,
    overflow: false,
    infoFields: 1,
    showClose: true,
    pinned: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ buttons, overflow, infoFields, showClose, pinned }) => (
    // Прокручиваемый контейнер: закрепление прижимает панель к низу именно
    // прокручиваемой области, на статичном холсте его не увидеть.
    <div className="flex h-72 w-[720px] flex-col overflow-y-auto rounded-2xl border border-[var(--divider)]">
      <div className="flex flex-col gap-4 p-6">
        {Array.from({ length: 10 }, (_, index) => (
          <p key={index} className="text-p2-regular text-[var(--accordion-card-subtitle-fg)]">
            Выделенная строка {index + 1}
          </p>
        ))}
      </div>
      <ButtonMenuBlack
        pinned={pinned}
        className="mt-auto"
        info={INFO_ITEMS.slice(0, infoFields)}
        onClose={showClose ? () => {} : undefined}
      >
        {blackButtons(buttons)}
        {overflow && (
          <ButtonMenuOverflow>
            <ButtonMenuOverflowItem text="Отправить по почте" />
            <ButtonMenuOverflowItem text="Архивировать" />
          </ButtonMenuOverflow>
        )}
      </ButtonMenuBlack>
    </div>
  ),
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Закреплена снизу (по умолчанию)"
        description="Панель подменяет собой белую, пока выделены строки таблицы, и стоит там же — у нижнего края контентной области."
      >
        <div className="flex h-72 w-[720px] flex-col overflow-y-auto rounded-2xl border border-[var(--divider)]">
          <div className="flex flex-col gap-4 p-6">
            {Array.from({ length: 10 }, (_, index) => (
              <p key={index} className="text-p2-regular text-[var(--accordion-card-subtitle-fg)]">
                Выделенная строка {index + 1}
              </p>
            ))}
          </div>
          <ButtonMenuBlack
            className="mt-auto"
            info={[{ label: "Выбрано", value: "3 документа", className: "w-16" }]}
            onClose={() => {}}
          >
            {blackButtons(2)}
          </ButtonMenuBlack>
        </div>
      </StorySection>

      <StorySection
        title="Свойство Button — от None до Four"
        description="Кнопки на тёмной панели всегда белые: брендового акцента здесь нет."
      >
        <div className="flex w-[720px] flex-col gap-4">
          {BUTTON_COUNTS.map((count) => (
            <div key={count} className="flex flex-col gap-1">
              {/* Имя значения — как в Figma, чтобы сверка шла один в один. */}
              <span className="text-p3-regular text-[#999999]">
                Button = {FIGMA_BUTTON_NAMES[count]}
              </span>
              {/* Витрина: панели стоят стопкой образцами, поэтому
                  закрепление выключено — иначе все прилипли бы к низу разом.
                  Закрепление показано отдельной секцией ниже. */}
              <ButtonMenuBlack
                pinned={false}
                info={[{ label: "Выбрано", value: "3 документа", className: "w-16" }]}
                onClose={() => {}}
              >
                {blackButtons(count)}
              </ButtonMenuBlack>
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Информационный бар"
        description="Поля бара можно отключить частично или полностью."
      >
        <div className="flex w-[720px] flex-col gap-4">
          {([3, 2, 1, 0] as const).map((fields) => (
            <ButtonMenuBlack
              pinned={false}
              key={fields}
              info={INFO_ITEMS.slice(0, fields)}
              onClose={() => {}}
            >
              {blackButtons(2)}
            </ButtonMenuBlack>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="С меню «ещё»"
        description="Когда действий больше трёх, лишнее уходит в More."
      >
        <div className="w-[720px]">
          <ButtonMenuBlack
            info={[{ label: "Выбрано", value: "3 документа", className: "w-16" }]}
            onClose={() => {}}
          >
            {blackButtons(3)}
            <ButtonMenuOverflow>
              <ButtonMenuOverflowItem text="Отправить по почте" />
              <ButtonMenuOverflowItem text="Архивировать" />
            </ButtonMenuOverflow>
          </ButtonMenuBlack>
        </div>
      </StorySection>

      <StorySection title="Без крестика">
        <div className="w-[720px]">
          <ButtonMenuBlack info={[{ label: "Выбрано", value: "3 документа", className: "w-16" }]}>
            {blackButtons(2)}
          </ButtonMenuBlack>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
