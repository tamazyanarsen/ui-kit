import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StoryContentArea,
  optionsArgType,
  toggleArgType,
} from "@/stories/matrix"

import { ButtonMenuBlack } from "./black"
import {
  ButtonMenuBlackExamples,
  FIGMA_BUTTON_LABELS,
  INFO_COUNT,
  INFO_ITEMS,
  INFO_SUM,
  INFO_WRITE_OFF,
  blackButtons,
  type ButtonCount,
} from "@/stories/button-menu-black-fixtures"
import type { ButtonMenuPlacement } from "./placement"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"

/* Дизайн-чек №13: «в дизайн-системе на самом деле button-menu и
   button-menu-black это два отдельных компонента. Каждому из них нужна
   отдельная матрица переключений и отдельная матрица полных отображений».
   Раньше чёрная панель была одной секцией внутри историй Button Menu.

   Свойства унаследованы из компонент-сета «ELK / button menu (black)»:

     Button = None | One | Tho | Three | Four

   Плюс информационный бар: «элементы информационного бара, располагающегося
   в правой части панели, можно при необходимости частично или полностью
   отключить» — отсюда переключатель количества полей. */

/* Дизайн-чек от 07.09, замечание 4: «Не допускается перенос. Текст в 1
   строку, ширина параметра динамическая». Ширину колонки «Выбрано» больше
   не фиксируем: 64px из макета рвали «3 документа» на три строки.
   Историческая заметка ниже — почему она вообще была.
   Каждое поле бара — своё свойство панели: Show Count, Show Sum,
   Show Write-Off (дизайн-чек Storybook (Аня Багрова) №14). */

/* Дизайн-чек от 13.09, замечание 19 — те же три размещения, что и у белой
   панели (см. `./placement`). */
const PLACEMENT_LABELS: Record<ButtonMenuPlacement, string> = {
  full: "Полная ширина",
  left: "Слева",
  right: "Справа",
}

const SPANS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

interface PlaygroundArgs {
  placement: ButtonMenuPlacement
  span: number
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
  detached: boolean
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
    placement: {
      ...optionsArgType("Размещение", PLACEMENT_LABELS),
      description:
        "Полоса занимает все 12 колонок сетки или прижимается к левому/правому краю на заданное число колонок",
    },
    span: {
      name: "Колонок",
      description:
        "Сколько колонок занимает полоса при размещении слева или справа (при полной ширине не действует)",
      control: "select",
      options: SPANS,
    },
    pinned: {
      name: "Закреплена снизу",
      description:
        "«Button Menu всегда закрепляется в нижней части контентной области» — поэтому включено по умолчанию",
      control: "boolean",
    },
    detached: {
      name: "Отлипшая",
      description:
        "Дизайн-чек от 08.09, замечание 9: в продукте состояния быть не должно, пропс заведён на будущее — полоса становится островом и получает нижние скругления",
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
    detached: false,
    placement: "full",
    span: 6,
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
    detached,
    showButton,
    selectAllCount,
    selectedCount,
    placement,
    span,
    ...bar
  }) => (
    <StoryContentArea height="h-72">
      <div className="flex flex-col gap-4 p-6">
        {Array.from({ length: 10 }, (_, index) => (
          <p key={index} className="text-p2-medium text-[var(--accordion-card-subtitle-fg)]">
            Выделенная строка {index + 1}
          </p>
        ))}
      </div>
      <ButtonMenuBlack
        pinned={pinned}
        detached={detached}
        placement={placement}
        span={span}
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
  render: () => <ButtonMenuBlackExamples />,
}
