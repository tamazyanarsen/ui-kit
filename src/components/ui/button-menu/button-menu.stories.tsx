import type { Meta, StoryObj } from "@storybook/react-vite"

import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Interaction/ButtonMenu",
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

export const ThreeButtonsWithOverflow: Story = {
  render: () => (
    <ButtonMenu>
      <Button variant="primary">Сохранить</Button>
      <Button variant="secondary-grey">Отмена</Button>
      <Button variant="secondary-grey">Предпросмотр</Button>
      <ButtonMenuOverflow>
        <ButtonMenuOverflowItem text="Дублировать" description="Создать копию" />
        <ButtonMenuOverflowItem text="Удалить" />
      </ButtonMenuOverflow>
    </ButtonMenu>
  ),
}

export const AllGreyFirstButton: Story = {
  name: "First Button — Grey (not Brand)",
  render: () => (
    <ButtonMenu>
      <Button variant="secondary-grey">Экспорт</Button>
      <Button variant="secondary-grey">Печать</Button>
      <ButtonMenuOverflow>
        <ButtonMenuOverflowItem text="Отправить по почте" />
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
