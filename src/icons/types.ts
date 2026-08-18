import type { SVGProps } from "react"

/** Figma draws this icon set per size — `Size=16x16` and `Size=24x24` are
 * separate variants whose glyphs are optically corrected, not scaled
 * (the 24px alert has a 2px stroke and a longer stem than the 16px one
 * enlarged 1.5×). `size` therefore picks the *drawing*, not just the box:
 * pass `size={24}` anywhere the icon renders at 24px, and keep using
 * `className="size-6"` for layout as usual.
 *
 * Дизайн-чек №3 №10: теперь оба начертания есть у всего набора (страница
 * ALL ICONS, канвас 70326:26), а не у горстки иконок. Забыть `size={24}` в
 * месте, где коробка 24px, — самая частая ошибка: глиф не сломается, но
 * растянется из 16px и будет заметно жирнее макета. */
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: 16 | 24
}
