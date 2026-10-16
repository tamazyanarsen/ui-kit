import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"
import { sizeArgType } from "@/stories/figma-props"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { TitleCard } from "./title-card"
import { TitleRegistry } from "./title-registry"
import { TitleInformationText } from "./information-text"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/ui/navbar"

interface TitleExampleProps {
  /** `Size`: Desktop / Mobile — задаёт ViewportScope. */
  viewport?: Viewport
  /** Тип заголовка: со статусом (Title Card) или без (Registry). */
  variant?: "card" | "registry"
  title?: string
  description?: string
  showBack?: boolean
  /** Только для «без статуса»: кнопки действий страницы. */
  showActions?: boolean
  showSecondaryAction?: boolean
  showHelp?: boolean
  /** `Button Title (ELK)` · Type — «Справка» или «Ещё». */
  helpType?: "support" | "more"
  /** Только для «со статусом»: тег и Information Text. */
  showTag?: boolean
  showInformation?: boolean
  /* Дизайн-чек 3/3 №10: у Information Text два вида — «ссылка» и «текст»
     (пары «подпись: значение»), а в контролах переключателя не было, поэтому
     второй вид из Playground был недостижим. */
  informationType?: "link" | "text"
}

function TitleExample({
  viewport = "desktop",
  variant = "card",
  title = "Title",
  description = "Description",
  showBack = true,
  showActions = true,
  showSecondaryAction = true,
  showHelp = true,
  helpType = "support",
  showTag = true,
  showInformation = true,
  informationType = "link",
}: TitleExampleProps = {}) {
  const content =
    variant === "registry" ? (
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
    ) : (
      <TitleCard
        title={title}
        description={description || undefined}
        backLabel={showBack ? "Назад" : null}
        helpType={helpType}
        helpLabel={showHelp ? undefined : null}
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

  return (
    <ViewportScope viewport={viewport}>
      {/* Мобильный мастер — 328px (экран 360 минус поля 16). */}
      <div className={viewport === "mobile" ? "w-[328px]" : "w-full"}>{content}</div>
    </ViewportScope>
  )
}

/* Порядок контролов — по таблице «Свойства» доки 70482:8697: Size, Type,
   Show Back, Show Buttons, Show Secondary Button, Show Help, Show Tag, Show
   Information Text. В мобильной форме кнопок нет вовсе (их место — Navbar),
   поэтому кнопочные контролы видны только у Desktop. */
const desktopOnly = { if: { arg: "viewport", eq: "desktop" } } as const

const meta = {
  title: "Компоненты/Title",
  component: TitleExample,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    variant: {
      name: "Type",
      control: { type: "inline-radio", labels: { card: "Title Card", registry: "Title Registy" } },
      options: ["card", "registry"],
    },
    showBack: { control: "boolean", name: "Show Back", ...desktopOnly },
    showActions: { control: "boolean", name: "Show Buttons", ...desktopOnly },
    showSecondaryAction: { control: "boolean", name: "Show Secondary Button", ...desktopOnly },
    showHelp: { control: "boolean", name: "Show Help", ...desktopOnly },
    helpType: {
      name: "Button Title (ELK)",
      description: "Тип кнопки справа от заголовка Title Card: Support («Справка») или More («Ещё»)",
      control: { type: "inline-radio", labels: { support: "Support", more: "More" } },
      options: ["support", "more"],
      ...desktopOnly,
    },
    showTag: { control: "boolean", name: "Show Tag" },
    showInformation: { control: "boolean", name: "Show Information Text" },
    informationType: {
      name: "Information Text",
      control: "inline-radio",
      options: ["link", "text"],
    },
    title: { control: "text", table: { category: "Контент" } },
    description: { control: "text", table: { category: "Контент" } },
  },
  args: {
    viewport: "desktop",
    variant: "card",
    showBack: true,
    showActions: true,
    showSecondaryAction: true,
    showHelp: true,
    helpType: "support",
    showTag: true,
    showInformation: true,
    informationType: "link",
    title: "Title",
    description: "Description",
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
        description="Опциональные элементы: все, кроме Title и кнопки. Дизайн кнопки «Справка» менять нельзя. Кнопка справа — Button Title (ELK): Support («Справка») или More («Ещё»)."
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
          <TitleCard title="Title" description="Description" tag="Example Text" helpType="more" />
          <TitleCard title="Title" description="Description" helpType="more" />
          <TitleCard title="Title" description="Description" backLabel={null} helpType="more" />
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

      <StorySection
        title="Мобильная форма (Size=Mobile)"
        description="Ни «Назад», ни «Справки», ни действий: кнопки уезжают в Navbar над заголовком и в нижнее меню. Заголовок H2 Mobile 22/30, остальное 12/16, зазоры 4px."
      >
        <ViewportScope viewport="mobile">
          <div className="flex flex-wrap items-start gap-10">
            <div className="w-[328px]">
              <TitleCard
                title="Title"
                description="Description"
                tag="Example Text"
                information={<TitleInformationText href="#">Link</TitleInformationText>}
              />
            </div>
            <div className="w-[328px]">
              <TitleRegistry title="Title" description="Description" />
            </div>
            {/* «Пример отображения компонента в мобильной адаптации». */}
            <div className="w-[360px] bg-[var(--page-bg)]">
              <Navbar type="top" sticky={false} />
              <div className="px-4 pt-4 pb-4">
                <TitleCard title="Кредитный договор 01-0015/ИЖС" tag="Действующий" />
              </div>
            </div>
          </div>
        </ViewportScope>
      </StorySection>
    </StoryShowcase>
  ),
}
