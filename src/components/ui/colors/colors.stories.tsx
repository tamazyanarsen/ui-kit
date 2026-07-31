import type { Meta, StoryObj } from "@storybook/react-vite"

interface ColorToken {
  /** CSS custom property (without the leading `--`) used for the live swatch background. */
  cssVar: string
  hex: string
  /** All token names in src/index.css that currently resolve to this hex value. */
  usedBy: string[]
}

interface ColorGroup {
  name: string
  description?: string
  tokens: ColorToken[]
}

const GROUPS: ColorGroup[] = [
  {
    name: "Нейтральные",
    description: "Базовая серая шкала — фон, границы, текст. Общая для обеих тем.",
    tokens: [
      { cssVar: "btn-secondary-white-bg", hex: "#FFFFFF", usedBy: ["btn-secondary-white-bg", "input-bg", "select-bg", "modal-bg", "card thumbnail fg"] },
      { cssVar: "card-bg", hex: "#F8F8F8", usedBy: ["card-bg", "informer-bg-grey", "notification-bg-hover", "file-upload-bg-disabled"] },
      { cssVar: "btn-secondary-grey-bg", hex: "#F4F4F4", usedBy: ["btn-secondary-grey-bg", "chips-light-bg", "accordion-card-bg", "otp-close-bg"] },
      { cssVar: "btn-secondary-grey-bg-hover", hex: "#EFEFEF", usedBy: ["btn-secondary-grey-bg-hover", "table-row-hover-bg", "item-hover-bg", "chips-light-bg-hover"] },
      { cssVar: "btn-secondary-grey-bg-active", hex: "#E6E6E6", usedBy: ["btn-secondary-grey-bg-active", "progress-track-bg", "table-row-active-bg"] },
      { cssVar: "modal-divider", hex: "#DEDEDE", usedBy: ["modal-divider", "calendar-divider", "table-divider", "accordion-list-border"] },
      { cssVar: "input-border", hex: "#C8C8CB", usedBy: ["input-border", "select-border", "checkbox-border", "btn-muted-border"] },
      { cssVar: "input-border-hover", hex: "#999999", usedBy: ["input-border-hover", "input-label-fg", "otp-underline", "empty-search-icon-fg"] },
      { cssVar: "input-caption-fg", hex: "#6D6D6D", usedBy: ["input-caption-fg", "textarea-border-hover", "select-caption-fg", "otp-subtitle-fg"] },
      { cssVar: "btn-primary-fg", hex: "#252628", usedBy: ["btn-primary-fg", "input-fg", "select-fg", "table-fg", "почти весь основной текст"] },
    ],
  },
  {
    name: "Бренд (ЕЛК)",
    description:
      "Основной акцентный цвет кнопок и активных состояний. Реагирует на переключатель темы в тулбаре Storybook — в теме «Старые цвета» становится зелёным.",
    tokens: [
      { cssVar: "btn-primary-bg", hex: "#80E3FF", usedBy: ["btn-primary-bg", "checkbox-checked-bg", "radio-checked-bg", "toggle-track-checked-bg"] },
      { cssVar: "btn-primary-bg-hover", hex: "#2FCEEF", usedBy: ["btn-primary-bg-hover", "checkbox-checked-bg-hover", "radio-checked-bg-hover"] },
      { cssVar: "btn-primary-bg-active", hex: "#14B1D1", usedBy: ["btn-primary-bg-active", "calendar-accent-fg"] },
    ],
  },
  {
    name: "Тёмно-синий (Secondary Black)",
    tokens: [
      { cssVar: "btn-secondary-black-bg", hex: "#012F42", usedBy: ["btn-secondary-black-bg", "calendar-selected-bg", "steps-fade-arrow-bg", "chips-dark-bg"] },
      { cssVar: "btn-secondary-black-bg-hover", hex: "#114870", usedBy: ["btn-secondary-black-bg-hover", "chips-dark-bg-hover"] },
      { cssVar: "btn-secondary-black-bg-active", hex: "#1368A1", usedBy: ["btn-secondary-black-bg-active"] },
    ],
  },
  {
    name: "Статус — Ошибка",
    tokens: [
      { cssVar: "btn-destructive-bg", hex: "#D74B54", usedBy: ["btn-destructive-bg", "input-border-error", "tag-red-bg", "toast-error-icon"] },
      { cssVar: "btn-destructive-bg-hover", hex: "#F0535E", usedBy: ["btn-destructive-bg-hover", "input-border-error-hover"] },
      { cssVar: "btn-destructive-bg-active", hex: "#FF737D", usedBy: ["btn-destructive-bg-active"] },
      { cssVar: "toast-error-bg", hex: "#FFE8E3", usedBy: ["toast-error-bg", "top-fixed-message-red-bg"] },
      { cssVar: "tag-red-secondary-bg", hex: "#FAE9EA", usedBy: ["tag-red-secondary-bg", "status-screen-error-bg"] },
      { cssVar: "file-item-error-bg", hex: "#FBE8E9", usedBy: ["file-item-error-bg"] },
      { cssVar: "accordion-card-blocked-bg", hex: "#FFF0F0", usedBy: ["accordion-card-blocked-bg"] },
    ],
  },
  {
    name: "Статус — Успех",
    tokens: [
      { cssVar: "progress-green", hex: "#39C182", usedBy: ["progress-green", "card-tag-bg", "tag-green-bg", "informer-icon-green"] },
      { cssVar: "item-right-text-fg", hex: "#1F9254", usedBy: ["item-right-text-fg", "status-screen-success-fg", "accordion-list-description-success-fg"] },
      { cssVar: "tag-green-secondary-bg", hex: "#E7F8F0", usedBy: ["tag-green-secondary-bg", "status-screen-success-bg"] },
      { cssVar: "toast-checked-bg", hex: "#BDF8DB", usedBy: ["toast-checked-bg"] },
    ],
  },
  {
    name: "Статус — Внимание",
    tokens: [
      { cssVar: "progress-amber", hex: "#EEA20F", usedBy: ["progress-amber", "event-status-attention-bg", "informer-icon-yellow", "toast-attention-icon"] },
      { cssVar: "item-comment-yellow-fg", hex: "#B76E00", usedBy: ["item-comment-yellow-fg", "status-screen-attention-fg", "accordion-list-description-attention-fg"] },
      { cssVar: "toast-attention-bg", hex: "#FDF0C1", usedBy: ["toast-attention-bg", "status-screen-attention-bg"] },
      { cssVar: "tag-orange-secondary-bg", hex: "#FDF4E2", usedBy: ["tag-orange-secondary-bg"] },
    ],
  },
  {
    name: "Статус — Информация (синий)",
    tokens: [
      { cssVar: "tag-blue-bg", hex: "#2487CA", usedBy: ["tag-blue-bg"] },
      { cssVar: "top-fixed-message-blue-icon", hex: "#5B90E0", usedBy: ["top-fixed-message-blue-icon"] },
      { cssVar: "top-fixed-message-blue-bg", hex: "#E3EEFF", usedBy: ["top-fixed-message-blue-bg"] },
      { cssVar: "tag-blue-secondary-bg", hex: "#E5F1F9", usedBy: ["tag-blue-secondary-bg"] },
    ],
  },
  {
    name: "Акцентные / разовые",
    description: "Не переиспользуются между компонентами — уникальные значения из своих Figma-спеков.",
    tokens: [
      { cssVar: "nps-star-fg", hex: "#F8C000", usedBy: ["nps-star-fg"] },
      { cssVar: "card-thumb-dot-a", hex: "#DC3030", usedBy: ["card-thumb-dot-a"] },
      { cssVar: "card-thumb-dot-b", hex: "#FF9F1A", usedBy: ["card-thumb-dot-b"] },
      { cssVar: "btn-secondary-logo-grey-bg", hex: "#494C4B", usedBy: ["btn-secondary-logo-grey-bg"] },
      { cssVar: "btn-secondary-outline-border", hex: "#0D4CD3", usedBy: ["btn-secondary-outline-border"] },
      { cssVar: "pagination-hover-bg", hex: "#F0FCFF", usedBy: ["pagination-hover-bg"] },
      { cssVar: "pagination-active-bg", hex: "#CFF7FF", usedBy: ["pagination-active-bg"] },
      { cssVar: "pagination-onclick-bg", hex: "#B6F3FF", usedBy: ["pagination-onclick-bg"] },
      { cssVar: "modal-backdrop", hex: "#1E2321", usedBy: ["modal-backdrop"] },
    ],
  },
]

function Swatch({ token }: { token: ColorToken }) {
  const isLight = ["#FFFFFF", "#F8F8F8", "#F4F4F4", "#EFEFEF", "#E6E6E6", "#DEDEDE"].includes(token.hex)
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-xl"
        style={{
          background: `var(--${token.cssVar})`,
          border: isLight ? "1px solid #DEDEDE" : "1px solid rgba(0,0,0,0.06)",
        }}
      />
      <div className="text-xs leading-snug">
        <div className="font-medium text-[#252628]">{token.hex}</div>
        <div className="text-[#999999]">--{token.cssVar}</div>
      </div>
    </div>
  )
}

function ColorsPage() {
  return (
    <div className="flex max-w-5xl flex-col gap-10 bg-white p-8">
      <div>
        <h1 className="text-2xl font-medium text-[#252628]">Палитра цветов</h1>
        <p className="mt-1 text-sm text-[#6D6D6D]">
          Все уникальные цвета, использованные в токенах ui-kit (src/index.css). Свотчи в группе «Бренд» читают
          значение напрямую из CSS-переменной и меняются вместе с переключателем темы «Тема» в тулбаре Storybook.
        </p>
      </div>
      {GROUPS.map((group) => (
        <section key={group.name} className="flex flex-col gap-4">
          <div>
            <h2 className="text-base font-medium text-[#252628]">{group.name}</h2>
            {group.description ? <p className="text-xs text-[#999999]">{group.description}</p> : null}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {group.tokens.map((token) => (
              <Swatch key={token.cssVar} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

const meta = {
  title: "Preview/.Colors",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ColorsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {
  render: () => <ColorsPage />,
}
