import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Steps, type Step, type StepsProps } from "./steps"

const BASE_STEPS: Step[] = [
  { title: "Шаг 1", description: "Заполнение заявки", status: "filled" },
  { title: "Шаг 2", description: "Проверка данных", state: "active" },
  { title: "Шаг 3", description: "Подписание" },
  {
    title: "Шаг 4",
    description: "Заблокирован",
    state: "disabled",
    disabledHint: "Заполните предыдущий шаг",
  },
]

const meta = {
  title: "Компоненты/Steps",
  component: Steps,
  parameters: { layout: "padded" },
  argTypes: {
    steps: { control: "object" },
    showLeftFade: { control: "boolean" },
    showRightFade: { control: "boolean" },
  },
  args: { steps: BASE_STEPS, showLeftFade: false, showRightFade: false },
} satisfies Meta<StepsProps>

export default meta
type Story = StoryObj<StepsProps>

export const Playground: Story = {}

/* A single step's own State (default / active / disabled) × Status (none /
   filled / error) is the real grid — the Steps container is just the strip
   they sit in, so each cell is a one-step strip. */
export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<Pick<Step, "state" | "status" | "statusText">>
        stretch
        cellClassName="min-w-[220px]"
        columns={[
          { label: "State: default", props: { state: "default" } },
          { label: "State: active", props: { state: "active" } },
          { label: "State: disabled", props: { state: "disabled" } },
        ]}
        rows={[
          { label: "Status: none", props: { status: "none" } },
          { label: "Status: filled", props: { status: "filled" } },
          {
            label: "Status: error",
            props: { status: "error", statusText: "Ошибка в данных" },
          },
        ]}
        render={(step) => (
          <Steps
            steps={[
              {
                title: "Step N",
                description: "Description",
                disabledHint:
                  step.state === "disabled" ? "Заполните предыдущий шаг" : undefined,
                ...step,
              },
            ]}
          />
        )}
      />

      {/* The fade arrows only appear when the strip overflows its container. */}
      <StatesMatrix<StepsProps>
        stretch
        cellClassName="min-w-[560px]"
        columns={[{ label: "Со стрелками прокрутки" }]}
        rows={[
          {
            label: "Обе стрелки",
            props: {
              showLeftFade: true,
              showRightFade: true,
              steps: Array.from({ length: 6 }, (_, i) => ({
                title: `Шаг ${i + 1}`,
                description: "Описание шага",
                state: i === 2 ? "active" : "default",
              })),
            },
          },
        ]}
        render={(props) => <Steps {...props} />}
      />
    </div>
  ),
}
