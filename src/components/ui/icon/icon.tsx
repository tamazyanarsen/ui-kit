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

/** `CircleAlert` -> `circle-alert`, `Loader2` -> `loader2`. */
function toKebab(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

// Один и тот же глиф экспортируется под несколькими именами (`Ellipsis` и
// `MoreHorizontal`, `Check` и `CheckIcon`). Ключи модульного пространства
// имён отсортированы по алфавиту, поэтому канонический — первый: он же в
// коде и используется как основной.
const REGISTRY = new Map<string, GlyphComponent>()
const seen = new Set<GlyphComponent>()

for (const [exportName, value] of Object.entries(glyphs)) {
  if (typeof value !== "function") continue
  const glyph = value as GlyphComponent
  if (seen.has(glyph)) continue
  seen.add(glyph)
  REGISTRY.set(toKebab(exportName), glyph)
}

/** Имена всех иконок набора — годится как `options` для контролов. */
const ICON_NAMES = [...REGISTRY.keys()].sort() as readonly string[]

type IconName = string

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  /** Имя из набора, например `check` или `circle-alert`. */
  name: IconName
  /**
   * Какое начертание брать: у части иконок Figma рисует 16 и 24 отдельно,
   * а не масштабирует. На размер бокса не влияет — его задаёт className.
   */
  size?: 16 | 24
  /** Только для `star`: заполненная звезда вместо контурной. */
  filled?: boolean
}

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
      filled={filled}
      // Размер по умолчанию совпадает с выбранным начертанием, но любой
      // `size-*` в className его перебивает — на то он и className.
      className={cn(size === 24 ? "size-6" : "size-4", className)}
      {...props}
    />
  )
}

export { Icon, ICON_NAMES, REGISTRY as ICON_REGISTRY }
export type { IconProps, IconName }
