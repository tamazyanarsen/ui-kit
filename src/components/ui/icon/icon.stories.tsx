import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { StorySection, StoryShowcase } from "@/stories/matrix"

import { Icon, ICON_NAMES, type IconProps } from "./icon"

const meta = {
  title: "Компоненты/Icon",
  component: Icon,
  parameters: { layout: "centered" },
  argTypes: {
    name: {
      control: "select",
      options: ICON_NAMES,
      description: "Иконка из набора кита",
    },
    size: {
      control: "inline-radio",
      options: [16, 24],
      description:
        "Начертание: часть иконок Figma рисует под 16 и 24 отдельно, а не масштабирует",
    },
    filled: {
      control: "boolean",
      description: "Только для star — заполненная звезда вместо контурной",
    },
    className: { control: "text" },
  },
  args: {
    name: "check",
    size: 24,
    filled: false,
    className: "text-[var(--btn-primary-bg-active)]",
  },
} satisfies Meta<IconProps>

export default meta
type Story = StoryObj<IconProps>

export const Playground: Story = {}

/* Клик по плитке копирует готовый вызов — набор большой, и искать имя
   глазами по списку неудобно. */
function IconTile({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(`<Icon name="${name}" />`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-[var(--divider)] bg-[var(--modal-bg)] p-4 text-center transition-colors hover:border-[var(--input-border-hover)] hover:bg-[var(--card-bg)]"
    >
      <Icon name={name} size={24} className="text-[var(--btn-primary-fg)]" />
      <span className="text-p4-regular text-[var(--accordion-card-subtitle-fg)]">
        {copied ? "Скопировано" : name}
      </span>
    </button>
  )
}

export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title={`Весь набор — ${ICON_NAMES.length} иконок`}
        description="Список собирается из @/icons сам, поэтому не отстаёт от набора. Клик по плитке копирует вызов."
      >
        <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8">
          {ICON_NAMES.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Размеры"
        description="16 и 24 — это разные начертания, а не одно масштабированное: у 24px толще штрих и другие пропорции."
      >
        <div className="flex items-end gap-6">
          {(["bell", "mail", "wallet", "circle-alert"] as const).map((name) => (
            <div key={name} className="flex items-end gap-3">
              <Icon name={name} size={16} />
              <Icon name={name} size={24} />
            </div>
          ))}
        </div>
      </StorySection>

      <StorySection
        title="Цвет"
        description="Иконка наследует currentColor, поэтому красится любым текстовым токеном."
      >
        <div className="flex items-center gap-6">
          <Icon name="circle-check" size={24} className="text-[var(--tag-green-bg)]" />
          <Icon name="circle-alert" size={24} className="text-[var(--tag-orange-bg)]" />
          <Icon name="circle-x" size={24} className="text-[var(--btn-destructive-bg)]" />
          <Icon name="info" size={24} className="text-[var(--input-border-hover)]" />
        </div>
      </StorySection>

      <StorySection title="Star — заполненная и контурная">
        <div className="flex items-center gap-6">
          <Icon name="star" size={24} className="text-[var(--nps-star-fg)]" />
          <Icon name="star" size={24} filled className="text-[var(--nps-star-fg)]" />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
}
