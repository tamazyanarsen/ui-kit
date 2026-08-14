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

/* Дизайн-чек №17: количество шагов — списком, а не правкой JSON-массива.
   Пул устроен так, что с ростом числа подключаются и разные состояния шага
   (заполнен → активный → обычный → заблокированный). */
const STEP_COUNTS = [1, 2, 3, 4] as const
type StepCount = (typeof STEP_COUNTS)[number]

type PlaygroundArgs = StepsProps & { stepsCount?: StepCount }

const meta = {
  title: "Компоненты/Steps",
  component: Steps,
  parameters: { layout: "padded" },
  argTypes: {
    stepsCount: {
      name: "Количество шагов",
      control: "select",
      options: STEP_COUNTS,
    },
    steps: { table: { disable: true } },
    showLeftFade: { control: "boolean" },
    showRightFade: { control: "boolean" },
  },
  args: {
    steps: BASE_STEPS,
    stepsCount: 4,
    showLeftFade: false,
    showRightFade: false,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ stepsCount = 4, ...args }) => (
    <Steps {...args} steps={BASE_STEPS.slice(0, stepsCount)} />
  ),
}

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
