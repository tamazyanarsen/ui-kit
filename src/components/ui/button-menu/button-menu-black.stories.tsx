import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StoryContentArea,
  StorySection,
  StoryShowcase,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"

import { ButtonMenuBlack } from "./black"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { Button } from "@/components/ui/button"

/* Дизайн-чек №13: «в дизайн-системе на самом деле button-menu и
   button-menu-black это два отдельных компонента. Каждому из них нужна
   отдельная матрица переключений и отдельная матрица полных отображений».
   Раньше чёрная панель была одной секцией внутри историй Button Menu.

   Свойства унаследованы из компонент-сета «ELK / button menu (black)»
   (нода 700:54288):

     Button = None | One | Tho | Three | Four

   Плюс информационный бар: «элементы информационного бара, располагающегося
   в правой части панели, можно при необходимости частично или полностью
   отключить» (нода 4008:30588) — отсюда переключатель количества полей. */
const BUTTON_COUNTS = [0, 1, 2, 3, 4] as const
type ButtonCount = (typeof BUTTON_COUNTS)[number]

/* ⚠️ «Tho» — опечатка самого кита в значении «Two». Не исправлена
   намеренно: имя значения здесь должно совпадать с панелью «Свойства
   компонента» посимвольно, иначе сверка со списком свойств перестаёт быть
   один в один. Чинить это надо в Figma, а не у себя. */
const FIGMA_BUTTON_NAMES: Record<ButtonCount, string> = {
  0: "None",
  1: "One",
  2: "Tho",
  3: "Three",
  4: "Four",
}

/* Подписи контрола — как в замечании дизайн-чека: «Button (1/2/3/4)». */
const FIGMA_BUTTON_LABELS: Record<ButtonCount, string> = {
  0: "None",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
}

const LABELS = ["Подписать", "Скачать", "Отправить", "Удалить"]

/* «Выбрано» Figma фиксирует шириной 64px, остальные колонки — по контенту.
   Каждое поле бара — своё свойство панели: Show Count, Show Sum,
   Show Write-Off (дизайн-чек Storybook (Аня Багрова) №14). */
const INFO_COUNT = { label: "Выбрано", value: "3 документа", className: "w-16" }
const INFO_SUM = { label: "Сумма", value: "1 200 101,16 ₽" }
const INFO_WRITE_OFF = { label: "Счёт списания", value: "40702810…1234" }
const INFO_ITEMS = [INFO_COUNT, INFO_SUM, INFO_WRITE_OFF]

interface PlaygroundArgs {
  buttons: ButtonCount
  showButton: boolean
  selectAllCount: number
  selectedCount: number
  overflow: boolean
  showBar: boolean
  showCount: boolean
  showSum: boolean
  showWriteOff: boolean
  showClose: boolean
  pinned: boolean
}

/** Поля информационного бара по трём переключателям панели свойств. */
function infoBar({
  showBar,
  showCount,
  showSum,
  showWriteOff,
}: Pick<PlaygroundArgs, "showBar" | "showCount" | "showSum" | "showWriteOff">) {
  if (!showBar) return undefined
  return [
    showCount && INFO_COUNT,
    showSum && INFO_SUM,
    showWriteOff && INFO_WRITE_OFF,
  ].filter(Boolean) as typeof INFO_ITEMS
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
    // Дизайн-чек Storybook (Аня Багрова) №14: панель контролов приведена к
    // «Свойствам компонента» — Button, Show Bar, Show Count, Show Sum,
    // Show Write-Off. Значение None в списке замечания не названо, но в
    // компонент-сете оно есть, поэтому остаётся первым пунктом.
    buttons: {
      ...optionsArgType<ButtonCount>("Button", FIGMA_BUTTON_LABELS, "inline-radio"),
      description: "Свойство Button компонента ELK / button menu (black)",
    },
    // Четвёртое булево свойство сета (появилось вместе с кнопкой
    // «Выбрать на всех страницах»).
    showButton: toggleArgType(
      "Show Button",
      "Кнопка «Выбрать на всех страницах (N)» над полосой. Включена по умолчанию: возможность, спрятанная по умолчанию, просто не находится"
    ),
    selectAllCount: {
      name: "N — строк под отбором",
      description:
        "Считает табличный блок по ОТОБРАННЫМ строкам всех страниц (`selectableRowKeys`), а не экран: вторая копия расчёта разошлась бы молча",
      control: { type: "number", min: 0, max: 999 },
      table: { category: "Контент" },
    },
    selectedCount: {
      name: "Выбрано сейчас",
      description:
        "Кнопка пропадает, когда выбрано всё, и возвращается, как только снята хотя бы одна галка — вместе с ней уходит и распорка, блок возвращается к 72",
      control: { type: "number", min: 0, max: 999 },
      table: { category: "Контент" },
    },
    showBar: toggleArgType(
      "Show Bar",
      "Информационный бар в правой части панели целиком"
    ),
    showCount: toggleArgType("Show Count", "Поле «Выбрано»"),
    showSum: toggleArgType("Show Sum", "Поле «Сумма»"),
    showWriteOff: toggleArgType("Show Write-Off", "Поле «Счёт списания»"),
    overflow: {
      name: "Меню «ещё»",
      description:
        "«Количество кнопок не превышает трёх, при необходимости дополнительный функционал скрывается в элемент More»",
      control: "boolean",
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
    showButton: true,
    selectAllCount: 40,
    selectedCount: 10,
    overflow: false,
    showBar: true,
    showCount: true,
    showSum: true,
    showWriteOff: true,
    showClose: true,
    pinned: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    buttons,
    overflow,
    showClose,
    pinned,
    showButton,
    selectAllCount,
    selectedCount,
    ...bar
  }) => (
    <StoryContentArea height="h-72">
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
        info={infoBar(bar)}
        onClose={showClose ? () => {} : undefined}
        showSelectAllPages={showButton}
        selectAllPagesCount={selectAllCount}
        selectedCount={selectedCount}
        onSelectAllPages={() => {}}
      >
        {blackButtons(buttons)}
        {overflow && (
          <ButtonMenuOverflow>
            <ButtonMenuOverflowItem text="Отправить по почте" />
            <ButtonMenuOverflowItem text="Архивировать" />
          </ButtonMenuOverflow>
        )}
      </ButtonMenuBlack>
    </StoryContentArea>
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
        <StoryContentArea height="h-72">
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
        </StoryContentArea>
      </StorySection>

      <StorySection
        title="Свойство Button — от None до Four"
        description="Кнопки на тёмной панели всегда белые: брендового акцента здесь нет."
      >
        <div className="flex w-full flex-col gap-4">
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
        <div className="flex w-full flex-col gap-4">
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
        <div className="w-full">
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
        <div className="w-full">
          <ButtonMenuBlack info={[{ label: "Выбрано", value: "3 документа", className: "w-16" }]}>
            {blackButtons(2)}
          </ButtonMenuBlack>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
