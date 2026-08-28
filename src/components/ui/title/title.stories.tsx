import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { TitleCard } from "./title-card"
import { TitleRegistry } from "./title-registry"
import { TitleInformationText } from "./information-text"
import { Button } from "@/components/ui/button"

interface TitleExampleProps {
  /** Тип заголовка: со статусом (Title Card) или без (Registry). */
  variant?: "card" | "registry"
  title?: string
  description?: string
  showBack?: boolean
  showHelp?: boolean
  /** Только для «со статусом»: тег и Information Text. */
  showTag?: boolean
  showInformation?: boolean
  /* Дизайн-чек 3/3 №10: у Information Text два вида — «ссылка» и «текст»
     (пары «подпись: значение»), а в контролах переключателя не было, поэтому
     второй вид из Playground был недостижим. */
  informationType?: "link" | "text"
  /** Только для «без статуса»: кнопки действий страницы. */
  showActions?: boolean
  showSecondaryAction?: boolean
}

function TitleExample({
  variant = "card",
  title = "Title",
  description = "Description",
  showBack = true,
  showHelp = true,
  showTag = true,
  showInformation = true,
  informationType = "link",
  showActions = true,
  showSecondaryAction = true,
}: TitleExampleProps = {}) {
  if (variant === "registry") {
    return (
      <TitleRegistry
        title={title}
        description={description || undefined}
        helpLabel={showHelp ? "Справка" : null}
        actions={
          showActions ? (
            <>
              <Button variant="primary" size="sm">
                Button
              </Button>
              {showSecondaryAction && (
                <Button variant="secondary-black" size="sm">
                  Button
                </Button>
              )}
            </>
          ) : undefined
        }
      />
    )
  }

  return (
    <TitleCard
      title={title}
      description={description || undefined}
      backLabel={showBack ? "Назад" : null}
      helpLabel={showHelp ? "Справка" : null}
      tag={showTag ? "Example Text" : undefined}
      information={
        showInformation ? (
          informationType === "text" ? (
            <TitleInformationText
              type="text"
              items={[
                { label: "Text", value: "Value" },
                { label: "Text", value: "Value" },
              ]}
            />
          ) : (
            <TitleInformationText href="#">Link</TitleInformationText>
          )
        ) : undefined
      }
    />
  )
}

const meta = {
  title: "Компоненты/Title",
  component: TitleExample,
  parameters: { layout: "padded" },
  argTypes: {
    variant: { control: "inline-radio", options: ["card", "registry"] },
    title: { control: "text" },
    description: { control: "text" },
    showBack: { control: "boolean" },
    showHelp: { control: "boolean" },
    showTag: { control: "boolean" },
    showInformation: { control: "boolean" },
    informationType: {
      name: "Information Text",
      control: "inline-radio",
      options: ["link", "text"],
    },
    showActions: { control: "boolean" },
    showSecondaryAction: { control: "boolean" },
  },
  args: {
    variant: "card",
    title: "Title",
    description: "Description",
    showBack: true,
    showHelp: true,
    showTag: true,
    showInformation: true,
    informationType: "link",
    showActions: true,
    showSecondaryAction: true,
  },
} satisfies Meta<TitleExampleProps>

export default meta
type Story = StoryObj<TitleExampleProps>

export const Playground: Story = {}

export const Examples: Story = {
  name: "Варианты",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="Заголовок со статусом (Title Card)"
        description="Опциональные элементы: все, кроме Title и кнопки. Дизайн кнопки «Справка» менять нельзя."
      >
        <div className="flex w-full flex-col gap-10">
          <TitleCard
            title="Title"
            description="Description"
            tag="Example Text"
            information={<TitleInformationText href="#">Link</TitleInformationText>}
          />
          <TitleCard
            title="Title"
            description="Description"
            tag="Example Text"
            information={
              <TitleInformationText
                type="text"
                items={[
                  { label: "Text", value: "Value" },
                  { label: "Text", value: "Value" },
                ]}
              />
            }
          />
          <TitleCard title="Title" description="Description" tag="Example Text" />
          <TitleCard title="Title" description="Description" backLabel={null} />
          <TitleCard title="Title" backLabel={null} helpLabel={null} />
        </div>
      </StorySection>

      <StorySection
        title="Заголовок без статуса (Registry)"
        description="Ни кнопки «Назад», ни строки статуса; корневой отступ 8px вместо 16."
      >
        <div className="flex w-full flex-col gap-10">
          <TitleRegistry
            title="Title"
            description="Description"
            actions={
              <>
                <Button variant="primary" size="sm">
                  Button
                </Button>
                <Button variant="secondary-black" size="sm">
                  Button
                </Button>
              </>
            }
          />
          <TitleRegistry title="Title" description="Description" />
          <TitleRegistry title="Title" helpLabel={null} />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
