import type { Meta, StoryObj } from "@storybook/react-vite"

import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { Button } from "@/components/ui/button"

const meta = {
  title: "UI/ButtonMenu",
  component: ButtonMenu,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Toolbar: Story = {
  render: () => (
    <ButtonMenu>
      <Button variant="primary">Сохранить</Button>
      <Button variant="secondary-grey">Отмена</Button>
      <ButtonMenuOverflow>
        <ButtonMenuOverflowItem text="Дублировать" description="Создать копию" />
        <ButtonMenuOverflowItem text="Удалить" />
      </ButtonMenuOverflow>
    </ButtonMenu>
  ),
}

export const OverflowMenuOnly: Story = {
  render: () => (
    <ButtonMenuOverflow>
      <ButtonMenuOverflowItem text="Редактировать" description="Изменить параметры" />
      <ButtonMenuOverflowItem text="Архивировать" />
      <ButtonMenuOverflowItem text="Удалить" />
    </ButtonMenuOverflow>
  ),
}
