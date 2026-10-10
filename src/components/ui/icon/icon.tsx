import * as React from "react"
import * as glyphs from "@/icons"

import { cn } from "@/lib/utils"

/**
 * Icon — единая точка доступа к набору иконок кита по имени.
 *
 * Зачем компонент, если есть `src/icons`: оттуда глиф импортируется по
 * ссылке (`<Check />`), и выбрать его *значением* нельзя. А это нужно
 * везде, где иконка — свойство: Tag, Item, Informer, плитки меню
 * создания. В Figma это instance swap, то есть свойство компонента, и в
 * Storybook оно должно быть обычным выпадающим списком, а не «передайте
 * JSX в проп».
 *
 * Реестр собирается из самого бочонка `@/icons`, а не переписывается
 * руками: список в превью-странице иконок уже отставал на шесть глифов.
 * Плата за это — Icon тянет за собой весь набор, поэтому в местах, где имя
 * известно на этапе сборки, по-прежнему правильнее импортировать глиф
 * напрямую.
 */

type GlyphComponent = React.ComponentType<glyphs.IconProps & { filled?: boolean }>

/*
 * Имя иконки на уровне типов — то же преобразование, что `toKebab` ниже:
 * дефис перед заглавной, если до неё строчная буква или цифра, всё в нижний
 * регистр. `CircleAlert` → `circle-alert`, `Loader2` → `loader2`.
 *
 * Ревью 10.10, КК-5: `IconName` был просто `string`, и опечатка в имени
 * (`<Icon name="chek" />`) типами не ловилась — только `console.warn` в
 * разработке и пустое место в продукте.
 */
type IsUpper<C extends string> = C extends Lowercase<C> ? false : true
type IsLowerOrDigit<C extends string> = C extends ""
  ? false
  : C extends Uppercase<C>
    ? C extends `${number}`
      ? true
      : false
    : true
type KebabFrom<S extends string, Prev extends string> = S extends `${infer C}${infer Rest}`
  ? `${IsUpper<C> extends true ? (IsLowerOrDigit<Prev> extends true ? "-" : "") : ""}${Lowercase<C>}${KebabFrom<Rest, C>}`
  : ""
type GlyphExport = {
  [K in keyof typeof glyphs]: (typeof glyphs)[K] extends (...args: never[]) => unknown ? K : never
}[keyof typeof glyphs]

/** `CircleAlert` -> `circle-alert`, `Loader2` -> `loader2`. */
function toKebab(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

// Один и тот же глиф экспортируется под несколькими именами (`Ellipsis` и
// `MoreHorizontal`, `OpenEye` и `Eye`). По имени находится КАЖДЫЙ экспорт:
// раньше повторы отбрасывались, и из пары выживало имя, первое по алфавиту,
// — `<Icon name="open-eye">` и `chevron-down` рисовали пустоту.
//
// В список для контролов попадает одно имя на глиф — первое по алфавиту
// (ключи модульного пространства имён отсортированы), иначе выпадающий
// список дублировал бы каждую иконку с псевдонимом.
const REGISTRY = new Map<string, GlyphComponent>()
const canonical: string[] = []
const seen = new Set<GlyphComponent>()

for (const [exportName, value] of Object.entries(glyphs)) {
  if (typeof value !== "function") continue
  const glyph = value as GlyphComponent
  const name = toKebab(exportName)
  REGISTRY.set(name, glyph)
  if (seen.has(glyph)) continue
  seen.add(glyph)
  canonical.push(name)
}

/** Имя иконки набора: `check`, `circle-alert`, `arrow-down-chevron`… */
type IconName = KebabFrom<GlyphExport & string, "">

/** Имена всех иконок набора — годится как `options` для контролов. */
const ICON_NAMES = canonical.sort() as readonly IconName[]

/**
 * Строка — имя иконки набора. Для пропов, которые принимают имя ИЛИ
 * разметку (`icon` у Tag, Thumbnail, Switcher, Informer): строку из
 * контрола Storybook или с сервера типами не проверить, а проверить в
 * рантайме — можно.
 */
function isIconName(value: unknown): value is IconName {
  return typeof value === "string" && REGISTRY.has(value)
}

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  /** Имя из набора, например `check` или `circle-alert`. */
  name: IconName
  /**
   * Какое начертание брать: у части иконок Figma рисует 16 и 24 отдельно,
   * а не масштабирует. На размер бокса не влияет — его задаёт className.
   */
  size?: 16 | 24
  /** Только для `star` и `file-icon`: заливка вместо контура. */
  filled?: boolean
}

/* `filled` понимают всего два глифа. Остальные просто разливают полученные
   пропсы по `<svg>`, и булев `filled` доезжал до DOM — React ругается
   «Received `false` for a non-boolean attribute». Раньше это не всплывало,
   потому что проп почти всегда был `undefined` (такие React выбрасывает
   сам), но контрол в истории `Icon` передаёт именно `false`.

   Поэтому пробрасываем адресно. Набор маленький и не растёт: у остальных
   иконок Figma рисует контур и заливку не отдельными вариантами, а разными
   иконками (`bookmark checked` / `bookmark uncheck`). */
// По глифу, а не по имени: теперь находятся и псевдонимы.
const FILLED_CAPABLE = new Set(
  ["star", "file-icon"].map((name) => REGISTRY.get(name)).filter(Boolean)
)

function Icon({ name, size = 16, filled, className, ...props }: IconProps) {
  const Glyph = REGISTRY.get(name)

  if (!Glyph) {
    if (import.meta.env.DEV) {
      console.warn(`Icon: нет иконки «${name}». Доступные: ${ICON_NAMES.join(", ")}`)
    }
    return null
  }

  return (
    <Glyph
      data-slot="icon"
      data-icon-name={name}
      size={size}
      filled={FILLED_CAPABLE.has(Glyph) ? filled : undefined}
      // Размер по умолчанию совпадает с выбранным начертанием, но любой
      // `size-*` в className его перебивает — на то он и className.
      className={cn(size === 24 ? "size-6" : "size-4", className)}
      {...props}
    />
  )
}

export { Icon, ICON_NAMES, REGISTRY as ICON_REGISTRY, isIconName }
export type { IconProps, IconName }
