import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { OtpConfirmCard } from "./confirm-card"

type OtpConfirmCardProps = ComponentProps<typeof OtpConfirmCard>

const meta = {
  title: "Template/OTP Code/Confirm Card",
  component: OtpConfirmCard,
  parameters: { layout: "centered" },
  // The card is a dialog (Figma composes it from ELK / Modal), so the
  // Playground opens it outright instead of relying on a trigger click.
  args: { phone: "+7 900 000-00-00", defaultOpen: true, length: 6 },
  // title/subtitle/error are typed React.ReactNode but every usage is a
  // plain string — pin text controls so leaving one unset doesn't fall back
  // to Storybook's "Set object" JSON-editor placeholder.
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    error: { control: "text" },
    phone: { control: "text" },
    length: { control: { type: "number", min: 4, max: 8 } },
    resendSeconds: { control: "number" },
    defaultOpen: { control: "boolean" },
  },
} satisfies Meta<OtpConfirmCardProps>

export default meta
type Story = StoryObj<OtpConfirmCardProps>

export const Playground: Story = {}

/* The card is a real modal dialog (portal + backdrop + focus trap), so only
   one can be open at a time — the variants are separate triggers rather than
   matrix cells. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="С триггером"
        description="Обычный сценарий: карточка открывается по действию пользователя."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          trigger={<button type="button">Подтвердить контакты</button>}
        />
      </StorySection>
      <StorySection
        title="С ошибкой"
        description="Код введён неверно — под полем появляется текст ошибки."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          defaultValue="1234"
          error="Неверный код, попробуйте снова"
          trigger={<button type="button">Открыть с ошибкой</button>}
        />
      </StorySection>
      <StorySection
        title="Код из 4 знаков"
        description="Длина кода задаётся пропом `length`."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          length={4}
          trigger={<button type="button">Открыть</button>}
        />
      </StorySection>
    </StoryShowcase>
  ),
}
