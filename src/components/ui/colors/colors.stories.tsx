import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { ODL_DERIVED, ODL_FAMILIES, type OdlColor } from "@/stories/palette-odl-fixtures"
import { ODL_USAGE } from "@/stories/palette-usage"

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
 *
 * Дизайн-чек от 08.10, замечание 36: при «Старых цветах» витрина оставалась
 * голубой и теряла подписи. Голубой — потому что свотчи новой палитры
 * (`--blue-223`) тема и не должна перекрашивать: она переопределяет
 * семантику, а не палитру. Подписи — потому что текст брал `--btn-primary-fg`
 * (подпись кнопки, в старой теме белая). Теперь в старой теме страница
 * показывает палитру старого бренда — листы «Было» из Figma с их именами, —
 * а у каждого цвета видно, какие токены рисуют им в этой теме.
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
}

/** Значение, которое пересчитывается при смене темы: тема переключается
 * атрибутом data-product на <html>. */
function useThemed<T>(read: () => T, key: string) {
  const [value, setValue] = React.useState<T>(read)
  React.useEffect(() => {
    const update = () => setValue(read())
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-product", "class"],
    })
    return () => observer.disconnect()
    // `read` — свежая стрелка на каждом рендере; зависимость — её ключ.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return value
}

/** Живое значение переменной: следует за темой, выбранной в тулбаре. */
function useCssValue(name: string) {
  return useThemed(
    () =>
      name
        ? getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
        : "",
    name
  )
}

function useProduct() {
  return useThemed(
    () => document.documentElement.getAttribute("data-product") ?? "elk",
    "product"
  )
}

function tokensLine(tokens: readonly string[]) {
  return tokens.length === 0
    ? "нет ссылок"
    : `${tokens.length} ${plural(tokens.length)}: ${tokens
        .slice(0, 3)
        .map((token) => `--${token}`)
        .join(", ")}${tokens.length > 3 ? "…" : ""}`
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
      <div className="text-p3-medium leading-snug">
        {/* Крупно — имя CSS-переменной: теперь оно же и есть имя из Figma. */}
        <div className="text-p2-medium text-[var(--title-fg)]">--{color.name}</div>
        {color.figma ? (
          <div className="text-[var(--input-border-hover)]">
            {group} / {leaf}
          </div>
        ) : (
          <div className="text-[var(--btn-destructive-bg)]">
            имя выведено — в наборе Figma такого нет
          </div>
        )}
        <div className="mt-1 text-[var(--title-fg)]">
          {live || color.hex}
          {live && live.toUpperCase() !== color.hex.toUpperCase() ? (
            <span className="text-[var(--input-border-hover)]"> (ЕЛК {color.hex})</span>
          ) : null}
        </div>
        <div className="text-[var(--input-border-hover)]">{tokensLine(color.usedBy)}</div>
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

/** Свотч старой палитры: имя из листа «Было», hex макета и переменная кита. */
function OdlSwatch({ color }: { color: OdlColor }) {
  const live = useCssValue(color.cssVar ?? "")
  const tokens = color.cssVar ? (ODL_USAGE.get(color.cssVar) ?? []) : []
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-xl border border-[var(--divider)]"
        style={{ background: color.cssVar ? `var(--${color.cssVar})` : color.hex }}
      />
      <div className="text-p3-medium leading-snug">
        <div className="text-p2-medium text-[var(--title-fg)]">{color.figma}</div>
        <div className="mt-1 text-[var(--title-fg)]">{(color.cssVar && live) || color.hex}</div>
        {color.cssVar ? (
          <>
            <div className="text-[var(--input-border-hover)]">--{color.cssVar}</div>
            <div className="text-[var(--input-border-hover)]">{tokensLine(tokens)}</div>
          </>
        ) : (
          <div className="text-[var(--input-border-hover)]">в ките не используется</div>
        )}
      </div>
    </div>
  )
}

function OdlSection({
  title,
  note,
  children,
}: {
  title: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-p1-medium text-[var(--title-fg)]">{title}</h2>
        <p className="text-p3-medium text-[var(--accordion-card-subtitle-fg)]">{note}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">{children}</div>
    </section>
  )
}

/** Палитра темы «Старые цвета». */
function OdlColorsPage() {
  const listed = new Set<string>([
    ...ODL_FAMILIES.flatMap((family) => family.colors.map((c) => c.cssVar ?? "")),
    ...ODL_DERIVED,
  ])
  // Цвета новой палитры, которыми старая тема всё ещё рисует часть токенов:
  // у этих компонентов при ребрендинге пары в «Было» не нашлось.
  const leftovers = PALETTE.filter(
    (color) => !listed.has(color.name) && (ODL_USAGE.get(color.name)?.length ?? 0) > 0
  )

  return (
    <div className="flex max-w-5xl flex-col gap-10 bg-[var(--modal-bg)] p-8">
      <div>
        <h1 className="text-h3 text-[var(--title-fg)]">Палитра цветов — старая тема</h1>
        <p className="mt-1 text-p2-medium text-[var(--accordion-card-subtitle-fg)]">
          Палитра старого бренда: листы «Было» со страницы перехода в Figma, с их
          именами. Под каждым цветом — переменная кита, которая его держит, и
          токены, которые рисуют им в теме «Старые цвета». Цвет без переменной в
          ките не используется и показан по hex из макета.
        </p>
      </div>
      {ODL_FAMILIES.map((family) => (
        <OdlSection key={family.title} title={family.title} note={family.note}>
          {family.colors.map((color) => (
            <OdlSwatch key={color.figma} color={color} />
          ))}
        </OdlSection>
      ))}
      <OdlSection
        title="Выведены китом"
        note="Наведение и нажатие тёмных элементов: в макете старой темы их нет, шаг осветления взят из соседних пар."
      >
        {ODL_DERIVED.map((name) => (
          <OdlSwatch key={name} color={{ figma: "выведено китом", hex: "", cssVar: name }} />
        ))}
      </OdlSection>
      {leftovers.length > 0 && (
        <OdlSection
          title="Из новой палитры, без пары в «Было»"
          note="Этими цветами старая тема по-прежнему рисует часть токенов."
        >
          {leftovers.map((color) => (
            <Swatch
              key={color.name}
              color={{ ...color, usedBy: ODL_USAGE.get(color.name) ?? [] }}
            />
          ))}
        </OdlSection>
      )}
    </div>
  )
}

function ColorsPage() {
  const product = useProduct()
  if (product === "odl-elk") return <OdlColorsPage />
  return <NewColorsPage />
}

function NewColorsPage() {
  const families: string[] = []
  for (const color of PALETTE) {
    if (!families.includes(color.family)) families.push(color.family)
  }

  return (
    <div className="flex max-w-5xl flex-col gap-10 bg-[var(--modal-bg)] p-8">
      <div>
        <h1 className="text-h3 text-[var(--title-fg)]">Палитра цветов</h1>
        <p className="mt-1 text-p2-medium text-[var(--accordion-card-subtitle-fg)]">
          Нижний слой токенов: имена переменных совпадают с именами набора Figma
          («Blue 223» → <code>--blue-223</code>). Вся семантика кита ссылается на эти
          переменные, поэтому здесь видно, сколько токенов держит каждый цвет.
          Свотчи читают значение живым из CSS и меняются вместе с переключателем «Тема».
          Палитра старого бренда показывается здесь же при теме «Старые цвета» в
          тулбаре — с именами из листов «Было» в Figma.
        </p>
      </div>
      {families.map((family) => (
        <section key={family} className="flex flex-col gap-4">
          <h2 className="text-p1-medium text-[var(--title-fg)]">
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
  title: "Атомы/.Colors",
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ColorsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {
  render: () => <ColorsPage />,
}
