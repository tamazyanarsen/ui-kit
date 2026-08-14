import type { Meta, StoryObj } from "@storybook/react-vite"

/**
 * Палитра ui-kit. Каждый свотч показывает три вещи:
 *   1. hex — фактическое значение токена в src/index.css;
 *   2. имя переменной Figma («Grey 284», «Blue 223» — числа контраста, как они
 *      названы в дизайн-системе), чтобы свотч можно было сравнить с набором Figma;
 *   3. CSS-переменные ui-kit, которые сейчас держат это значение.
 *
 * Дизайн-чек №4: раньше подписаны были только семантические CSS-имена
 * (`--btn-secondary-grey-bg`), которые не сопоставляются с Figma. Имена
 * собраны через `get_variable_defs` на компонент-сетах Figma (Button 32:9064,
 * Tag 847:53629, Toast 774:134168, Informer 70240:35984, Paginator 48825:4128).
 *
 * Заодно исправлены разошедшиеся значения: story держала hex-и, устаревшие
 * после более поздних пиксельных проходов (например `--tag-red-secondary-bg`
 * значился как #FAE9EA, фактически #FFF0F0), и два токена
 * (`--card-thumb-dot-a/-b`), которых в index.css уже нет.
 */
interface ColorToken {
  /** CSS custom property (без `--`), из которой берётся фон живого свотча. */
  cssVar: string
  hex: string
  /** Имя переменной в дизайн-системе Figma. `null` — соответствия пока не нашли. */
  figma: string | null
  /** Сколько всего токенов index.css резолвятся в это значение. */
  count: number
  /** Часть из них — для понимания, где цвет используется. */
  usedBy: string[]
}

interface ColorGroup {
  name: string
  description?: string
  tokens: ColorToken[]
}

const GROUPS: ColorGroup[] = [
  {
    name: "Нейтральные (Grey colors)",
    description: "Базовая серая шкала — фон, границы, текст. Общая для обеих тем.",
    tokens: [
      { cssVar: "btn-secondary-white-bg", hex: "#FFFFFF", figma: "Second/Grey colors/White 101", count: 48, usedBy: ["btn-secondary-white-bg", "input-bg", "modal-bg", "btn-secondary-black-fg"] },
      { cssVar: "card-bg", hex: "#F8F8F8", figma: "Second/Grey colors/Grey 106", count: 20, usedBy: ["card-bg", "file-item-icon-bg", "badge-light-grey-bg", "event-file-bg"] },
      { cssVar: "btn-secondary-grey-bg", hex: "#F4F4F4", figma: "Second/Grey colors/Grey 109", count: 13, usedBy: ["btn-secondary-grey-bg", "accordion-card-bg", "chips-light-bg", "calendar-range-bg"] },
      { cssVar: "btn-secondary-grey-bg-hover", hex: "#EFEFEF", figma: "Second/Grey colors/Grey 114", count: 22, usedBy: ["btn-secondary-grey-bg-hover", "btn-muted-bg", "input-bg-disabled", "table-row-hover-bg"] },
      { cssVar: "btn-secondary-grey-bg-active", hex: "#E6E6E6", figma: "Second/Grey colors/Grey 124", count: 6, usedBy: ["btn-secondary-grey-bg-active", "progress-track-bg", "table-row-active-bg"] },
      { cssVar: "modal-divider", hex: "#DEDEDE", figma: "Second/Grey colors/Grey 134", count: 21, usedBy: ["divider", "modal-divider", "calendar-divider", "accordion-list-border"] },
      { cssVar: "input-border", hex: "#C8C8CB", figma: "Second/Grey colors/Grey 166", count: 40, usedBy: ["input-border", "btn-muted-border", "input-fg-disabled", "header-menu-star-fg"] },
      { cssVar: "input-border-hover", hex: "#999999", figma: "Second/Grey colors/Grey 284", count: 57, usedBy: ["input-border-hover", "input-label-fg", "input-caption-fg", "otp-underline"] },
      { cssVar: "accordion-card-subtitle-fg", hex: "#6D6D6D", figma: "Second/Grey colors/Grey 517", count: 19, usedBy: ["accordion-card-subtitle-fg", "textarea-border-hover", "otp-subtitle-fg", "steps-tooltip-bg"] },
      { cssVar: "btn-secondary-logo-grey-bg", hex: "#494C4B", figma: "Second/Grey colors/Grey 868", count: 3, usedBy: ["btn-secondary-logo-grey-bg", "informer-description-fg", "header-menu-group-fg"] },
      { cssVar: "btn-primary-fg", hex: "#252628", figma: "Second/Grey colors/Grey 1514", count: 70, usedBy: ["btn-primary-fg", "input-fg", "table-fg", "почти весь основной текст"] },
    ],
  },
  {
    name: "Бренд — Blue (ЕЛК)",
    description:
      "Основной акцентный цвет кнопок и активных состояний. Реагирует на переключатель темы в тулбаре Storybook — в теме «Старые цвета» становится зелёным.",
    tokens: [
      { cssVar: "pagination-hover-bg", hex: "#F0FCFF", figma: null, count: 2, usedBy: ["pagination-hover-bg", "mail-feed-new-bg"] },
      { cssVar: "pagination-active-bg", hex: "#CFF7FF", figma: "Second/Blue colors/Blue 114", count: 2, usedBy: ["pagination-active-bg", "menu-banner-blue-glow"] },
      // Имя нашлось через get_variable_defs на баннере меню (нода 70303:58472) —
      // раньше значилось как несопоставленное.
      { cssVar: "pagination-onclick-bg", hex: "#B6F3FF", figma: "Second/Blue colors/Blue 121", count: 3, usedBy: ["pagination-onclick-bg", "toggle-track-checked-bg-disabled", "menu-banner-blue-bg"] },
      { cssVar: "btn-primary-bg", hex: "#80E3FF", figma: "Base/Blue 223", count: 8, usedBy: ["btn-primary-bg", "checkbox-checked-bg", "radio-checked-bg", "steps-active-ring"] },
      { cssVar: "btn-primary-bg-hover", hex: "#2FCEEF", figma: "Second/Blue colors/Blue 187", count: 7, usedBy: ["btn-primary-bg-hover", "checkbox-checked-bg-hover", "file-item-loading-fg"] },
      { cssVar: "btn-primary-bg-active", hex: "#14B1D1", figma: "Second/Blue colors/Blue 254", count: 5, usedBy: ["btn-primary-bg-active", "calendar-accent-fg", "header-hover-fg", "item-check-fg"] },
    ],
  },
  {
    name: "Тёмно-синий (Dark blue colors)",
    tokens: [
      { cssVar: "top-fixed-message-blue-bg", hex: "#EDF6FC", figma: "Second/Dark blue colors/Dark blue 109", count: 2, usedBy: ["top-fixed-message-blue-bg", "tag-blue-secondary-bg"] },
      { cssVar: "tag-blue-bg", hex: "#2487CA", figma: "Status/Dark blue 389", count: 1, usedBy: ["tag-blue-bg"] },
      { cssVar: "btn-secondary-black-bg-active", hex: "#1368A1", figma: "Second/Dark blue colors/Dark blue 596", count: 1, usedBy: ["btn-secondary-black-bg-active"] },
      { cssVar: "btn-secondary-black-bg-hover", hex: "#114870", figma: "Second/Dark blue colors/Dark blue 961", count: 2, usedBy: ["btn-secondary-black-bg-hover", "chips-dark-bg-hover"] },
      { cssVar: "btn-secondary-black-bg", hex: "#012F42", figma: "Second/Dark blue colors/Dark blue 1412", count: 6, usedBy: ["btn-secondary-black-bg", "calendar-selected-bg", "chips-dark-bg", "button-menu-black-bg"] },
    ],
  },
  {
    name: "Статус — Ошибка (Red colors)",
    tokens: [
      { cssVar: "tag-red-secondary-bg", hex: "#FFF0F0", figma: "Second/Red colors/Red 110", count: 3, usedBy: ["tag-red-secondary-bg", "accordion-card-blocked-bg", "file-item-error-bg"] },
      { cssVar: "toast-error-bg", hex: "#FFE8E3", figma: "Second/Red colors/Red 117", count: 4, usedBy: ["toast-error-bg", "top-fixed-message-red-bg", "accordion-card-blocked-bg-hover", "mail-feed-error-bg"] },
      { cssVar: "toast-error-border", hex: "#FFBEB5", figma: "Second/Red colors/Red 147", count: 1, usedBy: ["toast-error-border"] },
      { cssVar: "btn-destructive-bg-active", hex: "#FF737D", figma: "Second/Red colors/Red 182", count: 1, usedBy: ["btn-destructive-bg-active"] },
      { cssVar: "btn-destructive-bg-hover", hex: "#F0535E", figma: "Second/Red colors/Red 344", count: 3, usedBy: ["btn-destructive-bg-hover", "input-border-error-hover"] },
      { cssVar: "btn-destructive-bg", hex: "#D74B54", figma: "Status/Red 418", count: 29, usedBy: ["btn-destructive-bg", "input-border-error", "tag-red-bg", "toast-error-icon"] },
      { cssVar: "status-screen-error-bg", hex: "#FAE9EA", figma: null, count: 1, usedBy: ["status-screen-error-bg"] },
    ],
  },
  {
    name: "Статус — Успех (Mint colors)",
    tokens: [
      { cssVar: "tag-green-secondary-bg", hex: "#E5FCF1", figma: "Second/Mint colors/Mint 107", count: 1, usedBy: ["tag-green-secondary-bg"] },
      { cssVar: "toast-checked-bg", hex: "#BDF8DB", figma: "Second/Mint colors/Mint 119", count: 2, usedBy: ["toast-checked-bg", "menu-banner-green-glow"] },
      { cssVar: "toast-checked-border", hex: "#89F2BD", figma: "Second/Mint colors/Mint 135", count: 2, usedBy: ["toast-checked-border", "menu-banner-green-bg"] },
      { cssVar: "progress-green", hex: "#39C182", figma: "Status/Mint 230", count: 9, usedBy: ["progress-green", "tag-green-bg", "informer-icon-green", "item-right-text-fg"] },
      { cssVar: "status-screen-success-bg", hex: "#E7F8F0", figma: null, count: 1, usedBy: ["status-screen-success-bg"] },
      { cssVar: "status-screen-success-fg", hex: "#1F9254", figma: null, count: 1, usedBy: ["status-screen-success-fg"] },
    ],
  },
  {
    name: "Статус — Внимание (Yellow colors)",
    tokens: [
      { cssVar: "tag-orange-secondary-bg", hex: "#FFFAE0", figma: "Second/Yellow colors/Yellow 104", count: 1, usedBy: ["tag-orange-secondary-bg"] },
      { cssVar: "toast-attention-bg", hex: "#FDF0C1", figma: "Second/Yellow colors/Yellow 114", count: 2, usedBy: ["toast-attention-bg", "status-screen-attention-bg"] },
      { cssVar: "toast-attention-border", hex: "#FADC89", figma: "Second/Yellow colors/Yellow 134", count: 1, usedBy: ["toast-attention-border"] },
      { cssVar: "progress-amber", hex: "#EEA20F", figma: "Status/Yellow 214", count: 7, usedBy: ["progress-amber", "tag-orange-bg", "informer-icon-yellow", "event-status-attention-bg"] },
      { cssVar: "item-comment-yellow-fg", hex: "#B76E00", figma: null, count: 2, usedBy: ["item-comment-yellow-fg", "status-screen-attention-fg"] },
    ],
  },
  {
    name: "Сиреневый (Lavender colors)",
    description:
      "Один из трёх цветов баннера в раскрытом меню шапки (ui/header-menu). Имена подтверждены get_variable_defs на самом баннере (нода 70303:58473).",
    tokens: [
      { cssVar: "menu-banner-lilac-glow", hex: "#EBECFF", figma: "Second/Lavender colors/Lavender 116", count: 1, usedBy: ["menu-banner-lilac-glow"] },
      { cssVar: "menu-banner-lilac-bg", hex: "#D9DBFF", figma: "Second/Lavender colors/Lavender 135", count: 1, usedBy: ["menu-banner-lilac-bg"] },
    ],
  },
  {
    name: "Акцентные / разовые",
    description: "Не переиспользуются между компонентами — уникальные значения из своих Figma-спеков.",
    tokens: [
      { cssVar: "nps-star-fg", hex: "#F8C000", figma: null, count: 1, usedBy: ["nps-star-fg"] },
      { cssVar: "top-fixed-message-blue-icon", hex: "#5B90E0", figma: null, count: 1, usedBy: ["top-fixed-message-blue-icon"] },
      { cssVar: "btn-secondary-outline-border", hex: "#0D4CD3", figma: null, count: 1, usedBy: ["btn-secondary-outline-border"] },
      { cssVar: "btn-secondary-logo-grey-bg-hover", hex: "#5C5F5E", figma: null, count: 1, usedBy: ["btn-secondary-logo-grey-bg-hover"] },
      { cssVar: "btn-secondary-logo-grey-bg-active", hex: "#6E7170", figma: null, count: 1, usedBy: ["btn-secondary-logo-grey-bg-active"] },
      // Затемнение и под модалкой, и под раскрытым меню шапки: пиксельная
      // проба макета меню (нода 70303:58312) даёт ровно это значение при 70 %.
      { cssVar: "modal-backdrop", hex: "#1E2321", figma: null, count: 1, usedBy: ["modal-backdrop (модалка и раскрытое меню шапки)"] },
    ],
  },
]

/* Число в имени цвета Figma — это контраст к белому, умноженный на 100 и
   округлённый вниз: #999999 даёт 2.849 → «Grey 284», #DEDEDE — 1.345 →
   «Grey 134». Правило сошлось на 36 из 40 цветов, у которых имя удалось
   вытащить из Figma (исключения — «White 101» у чистого белого и три
   брендовых значения со своей нумерацией), поэтому для цветов без найденной
   переменной показываем вычисленный номер как подсказку для поиска в наборе,
   а не как готовое имя. */
function contrastNumber(hex: string) {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)))
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return Math.floor((1.05 / (luminance + 0.05)) * 100)
}

const LIGHT_HEXES = ["#FFFFFF", "#F8F8F8", "#F4F4F4", "#EFEFEF", "#E6E6E6", "#DEDEDE", "#F0FCFF", "#FFF0F0", "#E5FCF1", "#FFFAE0", "#EDF6FC", "#FAE9EA", "#E7F8F0"]

function Swatch({ token }: { token: ColorToken }) {
  const isLight = LIGHT_HEXES.includes(token.hex)
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-xl"
        style={{
          background: `var(--${token.cssVar})`,
          border: isLight ? "1px solid #DEDEDE" : "1px solid rgba(0,0,0,0.06)",
        }}
      />
      <div className="text-p3-regular leading-snug">
        {/* Имя из Figma — то, по чему дизайнер сверяет свотч с дизайн-системой.
            Показываем листовую часть («Grey 134») крупно, группу — подписью:
            в обсуждениях цвет называют именно листом. */}
        {token.figma ? (
          <>
            <div className="text-p2-medium text-[#252628]">{token.figma.split("/").at(-1)}</div>
            <div className="text-[#999999]">{token.figma.split("/").slice(0, -1).join(" / ")}</div>
          </>
        ) : (
          <>
            <div className="text-p2-medium text-[#D74B54]">нет переменной в Figma</div>
            <div className="text-[#999999]">контраст {contrastNumber(token.hex)}</div>
          </>
        )}
        <div className="mt-1 text-[#252628]">{token.hex}</div>
        <div className="text-[#999999]">
          --{token.cssVar}
          {token.count > 1 ? ` + ещё ${token.count - 1}` : ""}
        </div>
      </div>
    </div>
  )
}

function ColorsPage() {
  return (
    <div className="flex max-w-5xl flex-col gap-10 bg-white p-8">
      <div>
        <h1 className="text-h3 text-[#252628]">Палитра цветов</h1>
        <p className="mt-1 text-p2-regular text-[#6D6D6D]">
          Все уникальные цвета, использованные в токенах ui-kit (src/index.css). Под hex указано имя переменной в
          дизайн-системе Figma («числа контраста»), под ним — CSS-переменные ui-kit с этим значением. Свотчи читают
          значение напрямую из CSS-переменной и меняются вместе с переключателем «Тема» в тулбаре Storybook.
        </p>
      </div>
      {GROUPS.map((group) => (
        <section key={group.name} className="flex flex-col gap-4">
          <div>
            <h2 className="text-p1-medium text-[#252628]">{group.name}</h2>
            {group.description ? <p className="text-p3-regular text-[#999999]">{group.description}</p> : null}
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
