import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { ButtonMenu } from "./root"
import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"
import { ButtonMenuBlack } from "./black"
import { Button } from "@/components/ui/button"

interface PlaygroundArgs {
  primaryLabel: string
  secondaryLabel: string
  thirdButton: boolean
  overflow: boolean
}

const meta = {
  title: "Interaction/Button Menu",
  // No `component:` — ButtonMenu takes only `children`, so the Playground's
  // controls are synthetic (which buttons to put in the bar) and would not
  // typecheck against the real prop type.
  //
  // ButtonMenu is a full-width, bottom-anchored bar (not a floating w-fit
  // pill — see root.tsx's design-check #5 note), so it's shown inside a
  // fixed-width container that stands in for its usual content area rather
  // than Storybook's unconstrained "centered" canvas, which would otherwise
  // stretch it edge-to-edge across the whole preview.
  parameters: { layout: "padded" },
  argTypes: {
    primaryLabel: { control: "text" },
    secondaryLabel: { control: "text" },
    thirdButton: { control: "boolean" },
    overflow: { control: "boolean" },
  },
  args: {
    primaryLabel: "Сохранить",
    secondaryLabel: "Отмена",
    thirdButton: false,
    overflow: true,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ primaryLabel, secondaryLabel, thirdButton, overflow }) => (
    <div className="w-[640px]">
      <ButtonMenu>
        <Button variant="primary">{primaryLabel}</Button>
        <Button variant="secondary-grey">{secondaryLabel}</Button>
        {thirdButton && <Button variant="secondary-grey">Предпросмотр</Button>}
        {overflow && (
          <ButtonMenuOverflow>
            <ButtonMenuOverflowItem text="Дублировать" description="Создать копию" />
            <ButtonMenuOverflowItem text="Удалить" />
          </ButtonMenuOverflow>
        )}
      </ButtonMenu>
    </div>
  ),
}

/* ButtonMenu is a composition (a bar plus whatever buttons the page puts in
   it), so there is no prop grid to enumerate — Figma's page shows the same
   handful of arrangements instead. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Две кнопки + меню «ещё»"
        description="Первая кнопка — брендовая, остальные серые."
      >
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
      </StorySection>

      <StorySection title="Три кнопки + меню «ещё»">
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
      </StorySection>

      <StorySection
        title="Без брендовой кнопки"
        description="Когда ни одно действие не является основным."
      >
        <div className="w-[640px]">
          <ButtonMenu>
            <Button variant="secondary-grey">Экспорт</Button>
            <Button variant="secondary-grey">Печать</Button>
            <ButtonMenuOverflow>
              <ButtonMenuOverflowItem text="Отправить по почте" />
            </ButtonMenuOverflow>
          </ButtonMenu>
        </div>
      </StorySection>

      <StorySection title="Только меню «ещё»">
        <ButtonMenuOverflow>
          <ButtonMenuOverflowItem text="Редактировать" description="Изменить параметры" />
          <ButtonMenuOverflowItem text="Архивировать" />
          <ButtonMenuOverflowItem text="Удалить" />
        </ButtonMenuOverflow>
      </StorySection>

      <StorySection
        title="Чёрная панель"
        description="Тёмная разновидность с блоком информации слева."
      >
        <div className="w-[720px]">
          <ButtonMenuBlack
            info={[{ label: "Выбрано", value: "3 документа" }]}
            onClose={() => {}}
          >
            <Button variant="primary">Подписать</Button>
            <Button variant="secondary-white">Скачать</Button>
          </ButtonMenuBlack>
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
