import type { Meta, StoryObj } from "@storybook/react-vite"

import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Interaction/ButtonMenu",
  component: ButtonMenu,
  // ButtonMenu is a full-width, bottom-anchored bar (not a floating w-fit
  // pill — see root.tsx's design-check #5 note), so it's shown inside a
  // fixed-width container that stands in for its usual content area rather
  // than Storybook's unconstrained "centered" canvas, which would otherwise
  // stretch it edge-to-edge across the whole preview.
  parameters: { layout: "padded" },
} satisfies Meta<typeof ButtonMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Toolbar: Story = {
  render: () => (
    <div className="w-[640px]">
      <ButtonMenu>
        <Button variant="primary">Сохранить</Button>
        <Button variant="secondary-grey">Отмена</Button>
        <ButtonMenuOverflow>
          <ButtonMenuOverflowItem text="Дублировать" description="Создать копию" />
          <ButtonMenuOverflowItem text="Удалить" />
        </ButtonMenuOverflow>
      </ButtonMenu>
    </div>
  ),
}

export const ThreeButtonsWithOverflow: Story = {
  render: () => (
    <div className="w-[640px]">
      <ButtonMenu>
        <Button variant="primary">Сохранить</Button>
        <Button variant="secondary-grey">Отмена</Button>
        <Button variant="secondary-grey">Предпросмотр</Button>
        <ButtonMenuOverflow>
          <ButtonMenuOverflowItem text="Дублировать" description="Создать копию" />
          <ButtonMenuOverflowItem text="Удалить" />
        </ButtonMenuOverflow>
      </ButtonMenu>
    </div>
  ),
}

export const AllGreyFirstButton: Story = {
  name: "First Button — Grey (not Brand)",
  render: () => (
    <div className="w-[640px]">
      <ButtonMenu>
        <Button variant="secondary-grey">Экспорт</Button>
        <Button variant="secondary-grey">Печать</Button>
        <ButtonMenuOverflow>
          <ButtonMenuOverflowItem text="Отправить по почте" />
        </ButtonMenuOverflow>
      </ButtonMenu>
    </div>
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
