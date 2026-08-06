import type { SVGProps } from "react"

/** Figma draws this icon set per size — `16x16 / …` and `24x24 / …` are
 * separate component sets whose glyphs are optically corrected, not scaled
 * (the 24px alert has a 2px stroke and a longer stem than the 16px one
 * enlarged 1.5×). `size` therefore picks the *drawing*, not just the box:
 * pass `size={24}` anywhere the icon renders at 24px, and keep using
 * `className="size-6"` for layout as usual.
 *
 * Icons that Figma only ships at 16px keep the plain SVGProps signature. */
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: 16 | 24
}
