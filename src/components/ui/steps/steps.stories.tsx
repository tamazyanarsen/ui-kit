import type { Meta, StoryObj } from "@storybook/react-vite"

import { StatesMatrix } from "@/stories/matrix"

import { Steps, type Step, type StepsProps } from "./steps"
import type { StepState, StepStatus } from "./variants"

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
  { title: "Шаг 5", description: "Оплата" },
  { title: "Шаг 6", description: "Доставка документов" },
  { title: "Шаг 7", description: "Регистрация" },
  { title: "Шаг 8", description: "Завершение" },
]

/* Дизайн-чек №17: количество шагов — списком, а не правкой JSON-массива.
   Пул устроен так, что с ростом числа подключаются и разные состояния шага
   (заполнен → активный → обычный → заблокированный).

   Дизайн-чек 3/3 №15: пул расширен до 8 — на четырёх шагах лента помещалась
   в контейнер целиком, прокручивать было нечего, и стрелки Left/Right Fade
   выглядели неработающими даже после того, как прокрутку научились делать. */
const STEP_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8] as const
type StepCount = (typeof STEP_COUNTS)[number]

/* `State` и `Type` — свойства `Steps (ELK)` / `Steps Status (ELK)`:
   Disabled / Default / Active и None / Error / Filled.

   Дизайн-чек 3/3 №14: раньше контролы меняли состояние ТОЛЬКО второго шага
   («контролы State и Type указаны только для одного из нескольких шагов»),
   что и выглядело, и работало как случайность. Теперь они применяются ко
   всем шагам сразу — это свойства одной карточки, а лента лишь повторяет её.

   Дизайн-чек 3/3 №13: контрол Type при этом не давал ВООБЩЕ никакого
   эффекта, потому что `status` красит только строку статуса, а `statusText`
   ниже не передавался — красить было нечего. Подпись к каждому статусу
   заведена здесь же. */
const STEP_STATES = ["default", "active", "disabled"] as const
const STEP_STATUSES = ["none", "filled", "error"] as const

const STATUS_TEXT: Record<(typeof STEP_STATUSES)[number], string | undefined> = {
  none: "Не заполнено",
  filled: "Заполнено",
  error: "Ошибка в данных",
}

type PlaygroundArgs = StepsProps & {
  stepsCount?: StepCount
  currentState?: (typeof STEP_STATES)[number]
  currentStatus?: (typeof STEP_STATUSES)[number]
}

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
    currentState: {
      name: "State",
      control: "inline-radio",
      options: STEP_STATES,
    },
    currentStatus: {
      name: "Type",
      control: "inline-radio",
      options: STEP_STATUSES,
    },
    showLeftFade: { control: "boolean" },
    showRightFade: { control: "boolean" },
  },
  args: {
    steps: BASE_STEPS,
    stepsCount: 8,
    currentState: "default",
    currentStatus: "none",
    // Включены по умолчанию: на 8 шагах лента заведомо не помещается,
    // поэтому обе стрелки сразу и видны, и рабочие.
    showLeftFade: true,
    showRightFade: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({
    stepsCount = 4,
    currentState = "active",
    currentStatus = "none",
    ...args
  }) => {
    const steps = BASE_STEPS.slice(0, stepsCount).map((step) => ({
      ...step,
      state: currentState as StepState,
      status: currentStatus as StepStatus,
      statusText: STATUS_TEXT[currentStatus],
      // Подсказка нужна только заблокированному шагу — на остальных
      // состояниях её в макете нет.
      disabledHint:
        currentState === "disabled" ? "Заполните предыдущий шаг" : undefined,
    }))
    return <Steps {...args} steps={steps} />
  },
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
