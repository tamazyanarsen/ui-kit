import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  sizeArgType,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"

import {
  SampleError,
  type SampleErrorProps,
  type SampleErrorStatus,
} from "./sample-error"

/**
 * Sample Error — строка «что не так»: цветной значок + текст (бывший Issue
 * Item, дизайн-чек от 08.10, замечание 13).
 *
 * Панель «Свойства компонента» сета `Sample Error (ELK)`:
 *
 *     Size     Desktop, Mobile
 *     Status   Error, Attention, Information
 *
 * Состояний, наведения, нажатия и курсора-руки в сете нет вовсе — строка
 * ничего не обещает, поэтому оси State у истории тоже нет. Надстроек сверх
 * сета больше нет: прежний контрол «Значок» снят вместе со слотом.
 */
const STATUS_LABELS: Record<SampleErrorStatus, string> = {
  error: "Error",
  attention: "Attention",
  information: "Information",
}

const STATUSES = Object.keys(STATUS_LABELS) as SampleErrorStatus[]

type PlaygroundArgs = SampleErrorProps & {
  viewport?: Viewport
}

const meta = {
  title: "Компоненты/Sample Error",
  component: SampleError,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    status: optionsArgType("Status", STATUS_LABELS),
    children: { name: "Текст", control: "text", table: { category: "Контент" } },
  },
  args: {
    viewport: "desktop" as Viewport,
    status: "error" as SampleErrorStatus,
    children: "Не заполнено обязательное поле «ИНН организации»",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, ...args }) => (
    <PseudoBox viewport={viewport}>
      <SampleError {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Ось Status — по колонкам, Size — через `responsive`. */}
      <StatesMatrix<SampleErrorProps>
        responsive
        baseProps={{ children: "Sample Text" }}
        columns={STATUSES.map((status) => ({
          label: STATUS_LABELS[status],
          props: { status },
        }))}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => <SampleError {...props} />}
      />

      {/* Перенос: значок выравнивается по ПЕРВОЙ строке, а не по середине
          абзаца — отсюда `items-start`. */}
      <StatesMatrix<SampleErrorProps>
        responsive
        columns={[
          { label: "Одна строка", props: { children: "Короткая проблема" } },
          {
            label: "Перенос",
            props: {
              children:
                "Сумма транша превышает остаток лимита по договору, поэтому заявку нельзя отправить на согласование в текущем виде",
            },
          },
        ]}
        rows={STATUSES.map((status) => ({
          label: STATUS_LABELS[status],
          props: { status },
        }))}
        render={(props) => (
          <div className="max-w-[440px]">
            <SampleError {...props} />
          </div>
        )}
      />
    </div>
  ),
}
