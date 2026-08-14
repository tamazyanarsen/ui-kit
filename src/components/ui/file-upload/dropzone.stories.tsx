import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { FileUploadDropzone } from "./dropzone"

type DropzoneProps = ComponentProps<typeof FileUploadDropzone>

/* Ось `State` есть в макете (`ELK / file-upload`: State = Default | Hover | Disabled | Error), а hover пропом не
   выставить — его даёт общий контрол `state`. */
type PlaygroundArgs = DropzoneProps & { state?: PlaygroundState }

const meta = {
  // Дизайн-чек №26: компонент назывался «Dropzone», в Figma он —
  // «ELK / file-upload» на канвасе «File Upload» (677:14056). Имя в
  // Storybook должно совпадать с Figma, иначе продуктовый разработчик не
  // найдёт компонент по имени из макета. Код-имя `FileUploadDropzone`
  // оставлено: рядом живёт `ELK / files` (список загруженных файлов),
  // и «FileUpload» без уточнения путало бы их между собой.
  title: "Компоненты/File Upload",
  component: FileUploadDropzone,
  parameters: { layout: "padded" },
  argTypes: {
    state: stateArgType,
    children: { control: "text" },
    subtitle: { control: "text" },
    accept: { control: "text" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
  },
  args: {
    state: "default" as PlaygroundState,
    subtitle: "PDF, DOCX до 10 МБ",
    error: false,
    disabled: false,
    multiple: false,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state} className="w-full">
      <FileUploadDropzone {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<DropzoneProps>
      stretch
      cellClassName="min-w-[360px]"
      columns={[
        { label: "С подписью", props: { subtitle: "PDF, DOCX до 10 МБ" } },
        { label: "Без подписи", props: {} },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Error", props: { error: true } },
        { label: "Disabled", props: { disabled: true } },
        { label: "Свой текст", props: { children: "Загрузите скан паспорта" } },
      ]}
      render={(props) => <FileUploadDropzone {...props} />}
    />
  ),
}
