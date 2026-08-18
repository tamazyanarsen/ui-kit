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
 *
 * Дизайн-чек №3 №10: «Нужны все иконки из кита в двух размерах». Плитка
 * поэтому показывает оба начертания рядом — у большинства глифов 16 и 24 в
 * мастере нарисованы отдельно, и разницу видно только так. Поиск добавлен
 * по той же причине: набор вырос до пяти сотен, и листать его глазами
 * бессмысленно.
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
      <span className="flex min-h-6 items-end gap-3 text-[var(--btn-primary-fg)]">
        <Icon name={name} size={16} />
        <Icon name={name} size={24} />
      </span>
      <span className="text-p4-regular break-all text-[var(--accordion-card-subtitle-fg)]">
        {copied ? "Скопировано" : name}
      </span>
    </button>
  )
}

function IconsPage() {
  const [query, setQuery] = useState("")
  const needle = query.trim().toLowerCase()
  const shown = needle
    ? ICON_NAMES.filter((name) => name.includes(needle))
    : ICON_NAMES

  return (
    <div className="flex flex-col gap-6 bg-[var(--modal-bg)] p-8">
      <div>
        <h1 className="text-h3 text-[var(--btn-primary-fg)]">Иконки</h1>
        <p className="mt-1 text-p2-regular text-[var(--accordion-card-subtitle-fg)]">
          Все {ICON_NAMES.length} иконок набора, каждая в двух размерах — 16 и
          24. Клик по плитке копирует вызов компонента. Цвет наследуется от
          text-color (currentColor) и задаётся через className. Список
          собирается из <code>@/icons</code> автоматически, поэтому не отстаёт
          от набора.
        </p>
      </div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Поиск по имени — например «arrow» или «card»"
        className="h-12 w-full max-w-96 rounded-[16px] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 text-p1-medium text-[var(--input-fg)] outline-none placeholder:text-[var(--input-label-fg)] focus:border-[var(--input-border-hover)]"
      />
      <p className="-mt-3 text-p3-regular text-[var(--accordion-card-subtitle-fg)]">
        Показано: {shown.length}
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {shown.map((name) => (
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
