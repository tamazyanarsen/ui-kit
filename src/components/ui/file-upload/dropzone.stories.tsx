import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  PseudoBox,
  StatesMatrix,
  sizeArgType,
  stateArgTypeOf,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import { FileUploadDropzone } from "./dropzone"

type DropzoneProps = ComponentProps<typeof FileUploadDropzone>

/* Панель «Свойства компонента» компонент-сета `ELK / file-upload`
   (таблица 16029:57793 на канвасе File Upload 677:14056):

     Size   Desktop, Mobile
     State  Default, Hover, Disabled, Error

   Дизайн-чек «Сторибук Ч.2» от 10.09.2026, замечание 1: «должно быть 2
   контрола с выпадающим списком Size и State, дополнительных тоглов быть не
   должно. Отдельно должны отображаться поля Title, Subtitle, заполненные».
   Поэтому `error` и `disabled` больше не отдельные тоглы — это значения оси
   State, а `multiple`/`accept` убраны из панели совсем: свойствами компонента
   в макете они не являются, это параметры нативного `<input type="file">`.

   Замечание 11 (Major): «в состоянии desktop текст должен быть размером 16».
   Причина была не в самом компоненте — 16 у него и стоял (`desktop:text-p1-
   medium`), — а в умолчании контрола формы: он был `auto`, то есть форму
   решала ширина окна, и в узком окне дизайнера подпись честно падала до 14.
   Теперь `Size` — свойство макета со значениями Desktop/Mobile и умолчанием
   Desktop, «авто» из панели ушло. */
type PlaygroundArgs = Omit<DropzoneProps, "children"> & {
  state?: PlaygroundState
  viewport?: Viewport
  title?: string
}

/** Ссылка в подписи — «загрузите файлы» подчёркнуто и в макете
    (нода I16029:57763;16029:57994), а править Title дизайнер должен целиком,
    одной строкой. Поэтому фразу подчёркивает витрина, а не компонент. */
const LINK = "загрузите файлы"

function withUploadLink(title: string) {
  const at = title.indexOf(LINK)
  if (at === -1) return title
  return (
    <>
      {title.slice(0, at)}
      <span className="text-link">{LINK}</span>
      {title.slice(at + LINK.length)}
    </>
  )
}

const CONTENT = { table: { category: "Контент" } }

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
    viewport: sizeArgType,
    state: stateArgTypeOf(["default", "hover", "disabled", "error"]),
    title: { name: "Title", control: "text", ...CONTENT },
    subtitle: { name: "Subtitle", control: "text", ...CONTENT },
    // Не свойства макета: `multiple`/`accept` настраивают нативный выбор
    // файлов, а `error`/`disabled` теперь приезжают из оси State.
    multiple: { table: { disable: true } },
    accept: { table: { disable: true } },
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    title: "Перетащите или загрузите файлы",
    subtitle: "PDF, DOCX до 10 МБ",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, viewport, title, ...args }) => (
    <PseudoBox state={state} viewport={viewport} className="w-full">
      <FileUploadDropzone
        {...args}
        error={state === "error"}
        disabled={state === "disabled"}
      >
        {withUploadLink(title ?? "")}
      </FileUploadDropzone>
    </PseudoBox>
  ),
}

/* Замечание 1: «Subtitle отключать нельзя, необходимо убрать это из матрицы
   всех состояний» — колонки «С подписью / Без подписи» больше нет, подпись
   стоит в каждой клетке. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<DropzoneProps>
      responsive
      stretch
      cellClassName="min-w-[360px]"
      baseProps={{ subtitle: "PDF, DOCX до 10 МБ" }}
      columns={[
        { label: "Штатная подпись", props: {} },
        {
          label: "Свой текст",
          props: { children: "Загрузите скан паспорта" },
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Hover", props: {}, pseudo: "hover" },
        { label: "Error", props: { error: true } },
        { label: "Disabled", props: { disabled: true } },
      ]}
      render={(props) => <FileUploadDropzone {...props} />}
    />
  ),
}
