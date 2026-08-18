import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StatesMatrix, viewportArgType } from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { FileListItem } from "./file-item"

type FileListItemProps = ComponentProps<typeof FileListItem>

type PlaygroundArgs = FileListItemProps & { viewport?: Viewport }

const meta = {
  title: "Компоненты/Files",
  component: FileListItem,
  parameters: { layout: "padded" },
  // `errorText` is `React.ReactNode` but every usage is a plain string —
  // without this, leaving it unset falls back to a generic "Set object"
  // JSON editor.
  argTypes: {
    name: { control: "text" },
    meta: { control: "text" },
    errorText: { control: "text" },
    size: {
      name: "Size",
      control: "inline-radio",
      options: ["l", "s"],
      description: "L — строка с плиткой 48px, S — компактная с иконкой 16px",
    },
    state: {
      control: "inline-radio",
      options: ["default", "loading", "error", "disabled"],
    },
    showEdit: { control: "boolean" },
    showCross: { control: "boolean" },
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: viewportArgType,
  },
  args: { name: "Договор аренды.pdf", meta: "1.2 МБ", size: "l", state: "default", viewport: "auto" as Viewport },
  // Дизайн-чек №3 №19: контрол `viewport` из панели истории форсирует
  // десктопную/мобильную форму, не трогая размер вьюпорта. Обёртка общая
  // для всех историй файла — в матрицах она не мешает: там форму задаёт
  // сама матрица (`responsive`), а этот скоуп остаётся в «auto».
  decorators: [
    (Story, context) => (
      <ViewportScope viewport={(context.args as { viewport?: Viewport }).viewport}>
        <Story />
      </ViewportScope>
    ),
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

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
      columns={[
        { label: "С крестиком", props: { showCross: true } },
        { label: "С карандашом", props: { showEdit: true } },
        { label: "Без действий", props: { showCross: false, showEdit: false } },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Loading", props: { state: "loading" } },
        {
          label: "Error",
          props: { state: "error", errorText: "Не удалось загрузить файл" },
        },
        { label: "Disabled", props: { state: "disabled" } },
        { label: "Size=S", props: { size: "s" } },
        { label: "Size=S\nLoading", props: { size: "s", state: "loading" } },
        {
          label: "Size=S\nError",
          props: { size: "s", state: "error", errorText: "Не удалось загрузить файл" },
        },
      ]}
      render={(props) => <FileListItem {...props} />}
    />
  ),
}
