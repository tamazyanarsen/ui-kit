import type { Meta, StoryObj } from "@storybook/react-vite"

import { SANDBOX_DECORATORS, SANDBOX_PARAMETERS } from "../../shell"

import { PlacementRequestScreen } from "./screen"

// Модальное окно истории изменений отдельной историей не заводится
// намеренно: оно не самостоятельная витрина, а состояние этого экрана —
// открывается ссылкой «История изменений» в шапке страницы. Окно подсказок
// раздела — тоже состояние, и открывается кнопкой «Справка».
const meta = {
  title: "Песочница/Деталка заявки на размещение",
  component: PlacementRequestScreen,
  parameters: SANDBOX_PARAMETERS,
  decorators: SANDBOX_DECORATORS,
} satisfies Meta<typeof PlacementRequestScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
