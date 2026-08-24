import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { PALETTE, type PaletteColor } from "./palette"

/**
 * Палитра ui-kit — нижний слой токенов.
 *
 * Дизайн-чек №4 просил подписать свотчи именами Figma («Grey 284», «Blue
 * 223»), потому что семантические CSS-имена (`--btn-secondary-grey-bg`) с
 * дизайн-системой не сопоставляются. Сначала имена были только подписью, а
 * переменные оставались семантическими — теперь у кита есть настоящий слой
 * палитры: `--blue-223`, `--grey-1514`, `--red-418`, и вся семантика на него
 * ссылается (`--btn-primary-bg: var(--blue-223)`).
 *
 * Семантику при этом НЕ переименовывали: тема «Старые цвета» перекрашивает
 * primary в зелёный, и переменная с именем `blue-223` зелёной стать не может.
 * В Figma ровно та же развязка — переменная палитры и ссылающаяся на неё
 * заливка компонента.
 *
 * Список цветов не поддерживается руками: `palette.ts` генерируется из
 * `src/styles/palette.css` (`python scripts/build-palette.py --ts`), а значение
 * каждого свотча читается живым из CSS-переменной, поэтому страница едет
 * вместе с переключателем «Тема» в тулбаре.
 */

const FAMILY_TITLE: Record<string, string> = {
  white: "Белый",
  grey: "Нейтральные (Grey colors)",
  blue: "Бренд — Blue (ЕЛК)",
  "dark-blue": "Тёмно-синий (Dark blue colors)",
  red: "Статус — Ошибка (Red colors)",
  mint: "Статус — Успех (Mint colors)",
  yellow: "Статус — Внимание (Yellow colors)",
  lavender: "Сиреневый (Lavender colors)",
  "odl-green": "Старый бренд — зелёный",
  "odl-red": "Старый бренд — красный",
  "odl-grey": "Старый бренд — серый",
  "odl-dark-blue": "Старый бренд — синий",
}

/** Живое значение переменной: следует за темой, выбранной в тулбаре. */
function useCssValue(name: string) {
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    const read = () =>
      setValue(
        getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
      )
    read()
    // Тема переключается атрибутом data-product на <html>.
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-product", "class"],
    })
    return () => observer.disconnect()
  }, [name])
  return value
}

function Swatch({ color }: { color: PaletteColor }) {
  const live = useCssValue(color.name)
  const leaf = color.figma?.split("/").at(-1)
  const group = color.figma?.split("/").slice(0, -1).join(" / ")

  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-xl border border-[var(--divider)]"
        style={{ background: `var(--${color.name})` }}
      />
      <div className="text-p3-regular leading-snug">
        {/* Крупно — имя CSS-переменной: теперь оно же и есть имя из Figma. */}
        <div className="text-p2-medium text-[var(--btn-primary-fg)]">--{color.name}</div>
        {color.figma ? (
          <div className="text-[var(--input-border-hover)]">
            {group} / {leaf}
          </div>
        ) : (
          <div className="text-[var(--btn-destructive-bg)]">
            имя выведено — в наборе Figma такого нет
          </div>
        )}
        <div className="mt-1 text-[var(--btn-primary-fg)]">
          {live || color.hex}
          {live && live.toUpperCase() !== color.hex.toUpperCase() ? (
            <span className="text-[var(--input-border-hover)]"> (ЕЛК {color.hex})</span>
          ) : null}
        </div>
        <div className="text-[var(--input-border-hover)]">
          {color.usedBy.length === 0
            ? "нет ссылок"
            : `${color.usedBy.length} ${plural(color.usedBy.length)}: ${color.usedBy
                .slice(0, 3)
                .map((token) => `--${token}`)
                .join(", ")}${color.usedBy.length > 3 ? "…" : ""}`}
        </div>
      </div>
    </div>
  )
}

function plural(count: number) {
  const tail = count % 100
  if (tail >= 11 && tail <= 14) return "токенов"
  switch (count % 10) {
    case 1:
      return "токен"
    case 2:
    case 3:
    case 4:
      return "токена"
    default:
      return "токенов"
  }
}

function ColorsPage() {
  const families: string[] = []
  for (const color of PALETTE) {
    if (!families.includes(color.family)) families.push(color.family)
  }

  return (
    <div className="flex max-w-5xl flex-col gap-10 bg-[var(--modal-bg)] p-8">
      <div>
        <h1 className="text-h3 text-[var(--btn-primary-fg)]">Палитра цветов</h1>
        <p className="mt-1 text-p2-regular text-[var(--accordion-card-subtitle-fg)]">
          Нижний слой токенов: имена переменных совпадают с именами набора Figma
          («Blue 223» → <code>--blue-223</code>). Вся семантика кита ссылается на эти
          переменные, поэтому здесь видно, сколько токенов держит каждый цвет.
          Свотчи читают значение живым из CSS и меняются вместе с переключателем «Тема».
          Палитра старого бренда — под префиксом <code>odl-</code>: её имён в Figma нет,
          они выведены по правилу контраста.
        </p>
      </div>
      {families.map((family) => (
        <section key={family} className="flex flex-col gap-4">
          <h2 className="text-p1-medium text-[var(--btn-primary-fg)]">
            {FAMILY_TITLE[family] ?? family}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {PALETTE.filter((color) => color.family === family).map((color) => (
              <Swatch key={color.name} color={color} />
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
