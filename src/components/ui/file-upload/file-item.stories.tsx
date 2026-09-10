import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  stateArgTypeOf,
  toggleArgType,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { FileListItem } from "./file-item"

type FileListItemProps = ComponentProps<typeof FileListItem>

/* Панель «Свойства компонента» компонент-сета `ELK / files` (вторая таблица
   в ноде 16029:57793 на канвасе File Upload 677:14056):

     Size              L / Desktop, S / Desktop, L / Mobile, S / Mobile
     State             Default, Load, Disabled, Error
     Show Description  True, False
     Show Text Error   True, False
     Show Count        True, False
     Show Edit         True, False
     Show Cross        True, False

   Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 3. `Size` в макете —
   ОДНА ось из четырёх значений, а не размер и форма по отдельности: в коде
   это пара `size` + `viewport`, поэтому контрол склеен здесь, а история
   разбирает его обратно.

   ⚠️ `Show Count` в замечании не перечислен, и счётчика у компонента нет —
   свойство осталось незакрытым, о нём сказано заказчику отдельно. */
const SIZE_LABELS = {
  "l-desktop": "L / Desktop",
  "s-desktop": "S / Desktop",
  "l-mobile": "L / Mobile",
  "s-mobile": "S / Mobile",
} as const

type FigmaSize = keyof typeof SIZE_LABELS

function splitSize(value: FigmaSize) {
  const [size, viewport] = value.split("-") as ["l" | "s", Viewport]
  return { size, viewport }
}

/* Ось State у этого компонента целиком совпадает с пропом `state` —
   псевдоклассов среди её значений нет, поэтому отдельный контрол витрины не
   нужен и тип не расширяется. */
type PlaygroundArgs = FileListItemProps & { figmaSize?: FigmaSize }

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Files",
  component: FileListItem,
  parameters: { layout: "padded" },
  argTypes: {
    figmaSize: optionsArgType("Size", SIZE_LABELS),
    // В макете загрузка подписана `Load`, а не `Loading`.
    state: stateArgTypeOf(["default", "loading", "disabled", "error"], {
      loading: "Load",
    }),
    showDescription: toggleArgType("Show Description"),
    showErrorText: toggleArgType(
      "Show Text Error",
      "Текст ошибки под именем файла. Виден только в состоянии Error"
    ),
    showEdit: toggleArgType(
      "Show Edit",
      "Иконка more — меню действий с файлом"
    ),
    showCross: toggleArgType("Show Cross"),
    // Замечание 3: «переименовать поле name на title». Подпись контрола — из
    // макета, проп остаётся `name`.
    name: { name: "Title", control: "text", ...CONTENT },
    meta: {
      name: "Description",
      control: "text",
      if: { arg: "showDescription", truthy: true },
      ...CONTENT,
    },
    errorText: {
      control: "text",
      if: { arg: "showErrorText", truthy: true },
      ...CONTENT,
    },
    // Разъехалось на склеенный контрол `Size` выше.
    size: { table: { disable: true } },
  },
  args: {
    figmaSize: "l-desktop" as FigmaSize,
    state: "default" as FileListItemProps["state"],
    showDescription: true,
    showErrorText: true,
    showEdit: true,
    showCross: true,
    name: "Договор аренды.pdf",
    meta: "1.2 МБ",
    errorText: "Не удалось загрузить файл",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ figmaSize, ...args }) => {
    const { size, viewport } = splitSize(figmaSize ?? "l-desktop")
    return (
      <PseudoBox viewport={viewport} className="w-full">
        <FileListItem {...args} size={size} />
      </PseudoBox>
    )
  },
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<FileListItemProps>
      responsive
      stretch
      cellClassName="min-w-[360px]"
      rowHeader="Size=S — компактная строка: иконка 16px без плитки, имя P3, подпись P4."
      baseProps={{ name: "Договор аренды.pdf", meta: "1.2 МБ" }}
      // Замечание 4: столбец «С крестиком» убран, во втором показаны оба
      // действия (more и крестик), третий оставлен как был.
      columns={[
        { label: "С действиями", props: { showEdit: true, showCross: true } },
        { label: "Без действий", props: { showCross: false, showEdit: false } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Load", props: { state: "loading" } },
        {
          label: "Error",
          props: { state: "error", errorText: "Не удалось загрузить файл" },
        },
        {
          label: "Error\nбез текста",
          props: { state: "error", showErrorText: false },
        },
        { label: "Disabled", props: { state: "disabled" } },
        { label: "Без описания", props: { showDescription: false } },
        { label: "Size=S", props: { size: "s" } },
        { label: "Size=S\nLoad", props: { size: "s", state: "loading" } },
        {
          label: "Size=S\nError",
          props: {
            size: "s",
            state: "error",
            errorText: "Не удалось загрузить файл",
          },
        },
      ]}
      render={(props) => <FileListItem {...props} />}
    />
  ),
}
