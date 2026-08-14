import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import { Icon, ICON_NAMES } from "@/components/ui/icon"

/**
 * Превью набора иконок.
 *
 * Список берётся из реестра `Icon`, который собирается из `@/icons` сам.
 * Раньше здесь был массив руками — и он отставал на шесть глифов (`Plus`,
 * `Drag`, `Sbp`, `Coins`, `Alarm`, `ArrowLeftSmall`/`ArrowRightSmall`
 * появились в наборе, а на странице их не было).
 */
function IconTile({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(`<Icon name="${name}" />`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-[var(--divider)] bg-[var(--modal-bg)] p-4 text-center transition-colors hover:border-[var(--input-border-hover)] hover:bg-[var(--card-bg)]"
    >
      <Icon name={name} size={24} className="text-[var(--btn-primary-fg)]" />
      <span className="text-p4-regular text-[var(--accordion-card-subtitle-fg)]">
        {copied ? "Скопировано" : name}
      </span>
    </button>
  )
}

function IconsPage() {
  return (
    <div className="flex flex-col gap-6 bg-[var(--modal-bg)] p-8">
      <div>
        <h1 className="text-h3 text-[var(--btn-primary-fg)]">Иконки</h1>
        <p className="mt-1 text-p2-regular text-[var(--accordion-card-subtitle-fg)]">
          Все {ICON_NAMES.length} иконок набора. Клик по плитке копирует вызов
          компонента. Цвет наследуется от text-color (currentColor) и задаётся
          через className. Список собирается из <code>@/icons</code>
          автоматически, поэтому не отстаёт от набора.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {ICON_NAMES.map((name) => (
          <IconTile key={name} name={name} />
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: "Preview/.Icons",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof IconsPage>

export default meta
type Story = StoryObj<typeof meta>

export const AllIcons: Story = {
  render: () => <IconsPage />,
}
