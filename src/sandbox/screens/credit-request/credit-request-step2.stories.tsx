import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { CreditRequestStep2 } from "./step2"

// Три эталонных кадра — один экран, поэтому и история одна, с контролом
// состояния. Отдельные истории на каждое состояние читались бы как три
// разные страницы каталога, а это не так.
const meta = {
  title: "Песочница/Подача заявки на кредит. Шаг 2",
  component: CreditRequestStep2,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
  argTypes: {
    state: {
      name: "Состояние",
      control: "inline-radio",
      options: ["empty", "files", "errors"],
      description:
        "Стартовое состояние: пусто (70371:24608), файлы приложены (70371:24650), ошибки (70371:24684)",
    },
  },
  args: { state: "files" },
} satisfies Meta<typeof CreditRequestStep2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
