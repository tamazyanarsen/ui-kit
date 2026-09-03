import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  sizeArgType,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"
import { Attach, CircleAlert, Lock } from "@/icons"

import {
  IssueItem,
  type IssueIcon,
  type IssueItemProps,
  type IssueStatus,
} from "./issue-item"

/**
 * Issue Item — строка «что не так»: цветной значок + текст. Ставится под
 * формой, в карточке, в модалке подтверждения — везде, где нужно
 * перечислить проблемы, не занимая места информером.
 *
 * Панель «Свойства компонента» сета `Error (ELK)`:
 *
 *     Status   Error, Attention
 *
 * Состояний, наведения, нажатия и курсора-руки в сете нет вовсе — строка
 * ничего не обещает, поэтому оси State у истории тоже нет.
 *
 * Наши надстройки сверх сета (объявлены вслух): третий статус `Info` со
 * значком Grey 284, слот значка и мобильный размер (в ките он «появится
 * позже»).
 */
const STATUS_LABELS: Record<IssueStatus, string> = {
  error: "Error",
  attention: "Attention",
  info: "Info (наш)",
}

const STATUSES = Object.keys(STATUS_LABELS) as IssueStatus[]

const ICON_OPTIONS: Record<string, IssueIcon | undefined> = {
  "icon / alert (по умолчанию)": undefined,
  "icon / attention": CircleAlert,
  "icon / attach": Attach,
  "icon / lock": Lock,
}

type PlaygroundArgs = Omit<IssueItemProps, "icon"> & {
  viewport?: Viewport
  iconName?: string
}

const meta = {
  title: "Компоненты/Issue Item",
  component: IssueItem,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    status: optionsArgType("Status", STATUS_LABELS),
    iconName: {
      name: "Значок",
      description:
        "Слот значка — наша надстройка сверх сета. Цвет остаётся статусным: смысл несёт он, а слот говорит, о ЧЁМ проблема",
      control: "select",
      options: Object.keys(ICON_OPTIONS),
    },
    children: { name: "Текст", control: "text", table: { category: "Контент" } },
  },
  args: {
    viewport: "desktop" as Viewport,
    status: "error" as IssueStatus,
    iconName: "icon / alert (по умолчанию)",
    children: "Не заполнено обязательное поле «ИНН организации»",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ viewport, iconName, ...args }) => (
    <PseudoBox viewport={viewport}>
      <IssueItem {...args} icon={ICON_OPTIONS[iconName ?? ""]} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Ось Status — единственная ось самого сета. */}
      <StatesMatrix<IssueItemProps>
        responsive
        baseProps={{ children: "Не заполнено обязательное поле" }}
        columns={STATUSES.map((status) => ({
          label: STATUS_LABELS[status],
          props: { status },
        }))}
        rows={[{ label: "Default", props: {} }]}
        render={(props) => <IssueItem {...props} />}
      />

      {/* Слот значка: глиф меняется, цвет остаётся статусным. */}
      <StatesMatrix<IssueItemProps>
        responsive
        baseProps={{ children: "Строка проблемы" }}
        columns={[
          { label: "icon / alert", props: {} },
          { label: "icon / attention", props: { icon: CircleAlert } },
          { label: "icon / attach", props: { icon: Attach } },
          { label: "icon / lock", props: { icon: Lock } },
        ]}
        rows={STATUSES.map((status) => ({
          label: STATUS_LABELS[status],
          props: { status },
        }))}
        render={(props) => <IssueItem {...props} />}
      />

      {/* Перенос: значок выравнивается по ПЕРВОЙ строке, а не по середине
          абзаца — отсюда `items-start`. */}
      <StatesMatrix<IssueItemProps>
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
        rows={[{ label: "Error", props: { status: "error" } }]}
        render={(props) => (
          <div className="max-w-[440px]">
            <IssueItem {...props} />
          </div>
        )}
      />
    </div>
  ),
}
