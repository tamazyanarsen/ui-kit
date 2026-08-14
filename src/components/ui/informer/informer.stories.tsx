import type { Meta, StoryObj } from "@storybook/react-vite"

import { RESPONSIVE_NOTE, StatesMatrix } from "@/stories/matrix"

import { Informer, type InformerProps } from "./informer"
import type { InformerIcon } from "./variants"

const ICONS: InformerIcon[] = [
  "attention-red",
  "attention-yellow",
  "check",
  "information",
  "clock",
]

/* Переключатели видимости кнопок живут в истории, а не в компоненте: сами
   пропсы — это подписи, а не флаги (дизайн-чек №27). */
type PlaygroundArgs = InformerProps & {
  showMainButton?: boolean
  showAdditionalButton?: boolean
}

const meta = {
  title: "Компоненты/Informer",
  component: Informer,
  parameters: { layout: "padded" },
  // `description`/`mainButtonLabel`/`additionalButtonLabel` are all
  // `React.ReactNode` but every usage is a plain string — without this,
  // leaving one unset falls back to a generic "Set object" JSON editor.
  argTypes: {
    icon: { control: "select", options: ICONS },
    solid: { control: "inline-radio", options: ["white", "grey"] },
    title: { control: "text" },
    date: { control: "text" },
    description: { control: "text" },
    // Дизайн-чек №27: кнопки включаются булевыми переключателями, а не тем,
    // что у них стёрли подпись.
    showMainButton: { name: "Основная кнопка", control: "boolean" },
    mainButtonLabel: { control: "text" },
    showAdditionalButton: { name: "Дополнительная кнопка", control: "boolean" },
    additionalButtonLabel: { control: "text" },
    showCross: { control: "boolean" },
  },
  args: {
    icon: "attention-red",
    solid: "white",
    title: "Требуется подпись",
    date: "24.12.2022",
    description: "Документ ожидает вашей подписи для продолжения работы",
    showCross: true,
    showMainButton: true,
    mainButtonLabel: "Подписать",
    showAdditionalButton: true,
    additionalButtonLabel: "Отложить",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    showMainButton,
    mainButtonLabel,
    showAdditionalButton,
    additionalButtonLabel,
    ...args
  }) => (
    <Informer
      {...args}
      mainButtonLabel={showMainButton ? mainButtonLabel : undefined}
      additionalButtonLabel={showAdditionalButton ? additionalButtonLabel : undefined}
    />
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<InformerProps>
      stretch
      rowHeader={RESPONSIVE_NOTE}
      baseProps={{
        title: "Title",
        date: "24.12.2022",
        description: "Description",
      }}
      columnGroups={[
        {
          label: "Solid: White",
          columns: ICONS.map((icon) => ({ label: icon, props: { icon } })),
        },
      ]}
      rows={[
        { label: "Default", props: {} },
        { label: "Без крестика", props: { showCross: false } },
        {
          label: "Только заголовок",
          props: { date: undefined, description: undefined },
        },
        {
          label: "С кнопками",
          props: {
            mainButtonLabel: "Подписать",
            additionalButtonLabel: "Отложить",
          },
        },
        { label: "Solid: Grey", props: { solid: "grey" } },
      ]}
      render={(props) => <Informer {...props} onClose={() => {}} />}
    />
  ),
}

// Size=Mobile: a 328px card with 16px padding (Desktop is 592/min-400 with
// 24px). The switch is a `md:` media query, so it follows the *viewport* —
// a narrow wrapper would not trigger it. Pin the story to a phone viewport
// so the mobile form is what actually renders.
export const MobileSize: Story = {
  name: "Mobile (328px)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { controls: { disable: true } },
  args: {
    title: "Требуется подпись",
    date: "24.12.2022",
    description: "Документ ожидает вашей подписи",
    mainButtonLabel: "Подписать",
  },
}
