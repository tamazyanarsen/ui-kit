import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  StatesMatrix,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { Item, type ItemProps, type RightElementType } from "./item"

/* Дизайн-чек №33: «набор атрибутов компонента Item не соответствует
   таковому в Figma… необходимо привести атрибуты в Storybook в соответствие
   с тем, как это оформлено в Figma, чтобы можно было проверять компоненты».

   Компонент-сет «ELK / item» объявляет ровно пять
   свойств, и все они теперь есть в контролах под своими именами:

     State        = Default | Disabled            → `disabled`
     Type         = Value | Thumbneil             → `thumbnail`
     Сonclusion   = False | True                  → строка `text` над Value
     Sub Сategory = False | True                  → `subCategory`
     Text Color   = Grey | Red | Yellow           → `commentColor`

   Плюс два булевых слота самого мастера — `showComment` и
   `showRightElement` — и вложенный сет «Right Element (Desktop, ELK)» со
   своими семью значениями.

   Заодно исправлено имя: наш `accordion` — это Figma-шный `Select`
   (он рисует ровно `icon / arrow down chevron`), так что
   значение переименовано, чтобы список совпадал с макетом. `none` —
   единственное добавленное сверх Figma значение: в макете правый элемент
   выключается отдельным булевым слотом, а у нас это его же список. */
const RIGHT_ELEMENTS: RightElementType[] = [
  "none",
  "check",
  "text",
  "navigation",
  "information",
  "select",
  "checkbox",
  "toggle",
]

const FIGMA_TYPES = ["Value", "Thumbneil"] as const
type FigmaType = (typeof FIGMA_TYPES)[number]

type PlaygroundArgs = ItemProps & {
  figmaType?: FigmaType
  conclusion?: boolean
  showComment?: boolean
  showRightElement?: boolean
  state?: PlaygroundState
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Item",
  component: Item,
  parameters: { layout: "padded" },
  // `thumbnail` держит JSX-элемент (или значение-маркер `true`, при котором
  // рисуется встроенный в компонент `DefaultThumbnail`), поэтому понятный
  // выбор «None» и «Default» отображается в `undefined` и `true`, а не
  // контрол выключается (тот же приём, что и с `icon` у Button).
  argTypes: {
    /* Порядок и имена — как в таблице «Свойства компонента»:
       State / Type / Conclusion / Sub Category / Show Comment /
       Show Right Element / Show Divider. */
    // У самого сета `ELK / item` оси Size нет: Desktop и Mobile разведены
    // отдельными мастерами вложенных элементов (`Right Element (Desktop,
    // ELK)`), поэтому форма всё равно должна переключаться контролом.
    viewport: sizeArgType,
    state: stateArgTypeOf(["default", "disabled"]),
    // Type в Figma — это наличие тумбнейла: Value (без) / Thumbneil (с).
    figmaType: {
      name: "Type",
      description: "Свойство Type компонента ELK / item",
      control: "inline-radio",
      options: FIGMA_TYPES,
    },
    thumbnail: { table: { disable: true } },
    // Сonclusion=True добавляет строку Text над Value (P2 Medium над P1
    // Medium) — сверено на символах True и False.
    conclusion: {
      name: "Сonclusion",
      description: "Строка Text над значением",
      control: "boolean",
    },
    subCategory: { name: "Sub Сategory", control: "boolean" },
    showComment: toggleArgType("Show Comment"),
    showRightElement: toggleArgType("Show Right Element"),
    divider: toggleArgType("Show Divider"),
    // Вложенные сеты мастера: «Right Element (Desktop, ELK)»
    // и «Comment (Desktop, ELK)» — своими категориями, как в
    // Figma они показаны отдельными блоками свойств вложенного инстанса.
    rightElement: {
      name: "Type",
      control: "select",
      options: RIGHT_ELEMENTS,
      table: { category: "Right Element (ELK)" },
    },
    open: {
      name: "Раскрыта",
      control: "boolean",
      description:
        "Панель, которую раскрывает строка, сейчас открыта (Right Element = select): шеврон смотрит вверх и выставляется aria-expanded",
      table: { category: "Right Element (ELK)" },
    },
    // Имеет смысл только при rightElement="toggle" и "checkbox".
    // Playground оставляет их кликабельными через собственное состояние, но
    // заданный контрол закрепляет значение (та же схема, что и с `checked`
    // у Checkbox).
    toggleChecked: { control: "boolean", table: { category: "Right Element (ELK)" } },
    checkboxChecked: { control: "boolean", table: { category: "Right Element (ELK)" } },
    rightText: { control: "text", table: { category: "Right Element (ELK)" } },
    commentColor: {
      name: "Text Color",
      control: "inline-radio",
      options: ["grey", "red", "yellow"],
      table: { category: "Comment (ELK)" },
    },
    // `text`, `comment`, `informationText` и `rightText` объявлены как
    // `React.ReactNode`, но везде используются обычными строками. Без этого
    // незаданное значение откатывается на универсальный JSON-редактор
    // «Set object».
    text: { control: "text", table: { category: "Контент" } },
    value: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    informationText: { control: "text", table: { category: "Контент" } },
    // Значение оси State — отдельного контрола у него нет.
    disabled: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop",
    state: "default" as PlaygroundState,
    figmaType: "Value",
    conclusion: true,
    subCategory: false,
    showComment: true,
    showRightElement: true,
    divider: true,
    rightElement: "navigation",
    open: false,
    rightText: "+1,5%",
    commentColor: "grey",
    text: "Тип операции",
    value: "Перевод между счетами",
    comment: "Comment",
    informationText: "Дополнительная информация об операции",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    figmaType,
    conclusion,
    showComment,
    showRightElement,
    text,
    comment,
    rightElement,
    viewport,
    state,
    ...args
  }) => (
    <ViewportScope viewport={viewport}>
      <InteractiveItem
        {...args}
        disabled={state === "disabled"}
        thumbnail={figmaType === "Thumbneil" ? true : undefined}
        text={conclusion ? text : undefined}
        comment={showComment ? comment : undefined}
        rightElement={showRightElement ? rightElement : "none"}
      />
    </ViewportScope>
  ),
}

// Оставляет правые элементы toggle и checkbox кликабельными, но при этом
// позволяет контролам `toggleChecked` и `checkboxChecked` закрепить
// значение, когда они заданы.
function InteractiveItem({ toggleChecked, checkboxChecked, ...props }: ItemProps) {
  const [toggle, setToggle] = useState(true)
  const [checkbox, setCheckbox] = useState(false)
  return (
    <Item
      {...props}
      toggleChecked={toggleChecked ?? toggle}
      onToggleChange={setToggle}
      checkboxChecked={checkboxChecked ?? checkbox}
      onCheckboxChange={setCheckbox}
    />
  )
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Right Element — собственная ось вариантов в макете. */}
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[280px]"
        responsive
        baseProps={{
          text: "Title",
          value: "Value",
          informationText: "Дополнительная информация",
          rightText: "+1,5%",
        }}
        columnGroups={[
          {
            label: "Right Element",
            columns: RIGHT_ELEMENTS.map((rightElement) => ({
              label: rightElement,
              props: { rightElement },
            })),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "С миниатюрой", props: { thumbnail: true } },
          { label: "Sub category", props: { subCategory: true } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <InteractiveItem {...props} />}
      />

      {/* Цвет комментария и форма «только значение» не зависят от правого
          элемента. */}
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[320px]"
        baseProps={{ text: "Title", value: "Value" }}
        columns={[
          { label: "Comment: grey", props: { comment: "Comment", commentColor: "grey" } },
          { label: "Comment: red", props: { comment: "Comment", commentColor: "red" } },
          { label: "Comment: yellow", props: { comment: "Comment", commentColor: "yellow" } },
        ]}
        rows={[
          { label: "С заголовком", props: {} },
          // Только значение: строка схлопывается в одну.
          { label: "Только значение", props: { text: undefined } },
          {
            // Правило «Максимальное количество строк» из макета: значение
            // переносится максимум на 3 строки, комментарий — на 5, дальше
            // оба обрезаются многоточием.
            label: "Длинный текст\n(3 / 5 строк)",
            props: {
              value:
                "Пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов",
              comment:
                "Пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов",
            },
          },
        ]}
        render={(props) => <Item {...props} />}
      />
    </div>
  ),
}
