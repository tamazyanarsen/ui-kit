import * as React from "react"

import { cn } from "@/lib/utils"

import {
  usePinnedCell,
  useTableScrollState,
  type TablePin,
} from "./pin"

// Shared geometry for the sticky/pinned cells. The `edge` cell of a block
// carries the divider line that marks the block off, and only while the
// scroll position actually hides content behind it.
//
// ⚠️ Here used to sit the kit's Universal shadow — the primitive Figma
// actually draws (`Left Shadow` 3805:19990 / `Right Shadow` 3805:19991,
// drop-shadow #8B99A93D 0/4/12). It is gone on purpose: the product is
// dropping shadow elements, and the pinned block is now marked off by a 1px
// Grey 134 line on its inner side — left block along its right edge, right
// block along its left. The same change is queued for the kit itself, so a
// later pass finding "Figma says shadow" should NOT put it back.
function usePinPresentation<T extends HTMLTableCellElement>(
  pin: TablePin | undefined,
  header: boolean
) {
  const { ref, offset, edge } = usePinnedCell<T>(pin)
  const { scrolledFromStart, scrolledFromEnd } = useTableScrollState()

  // «Блок реально перекрывает прокручиваемый контент». Отдельно от линии,
  // потому что её рисует только крайняя ячейка блока (`edge`), а вот
  // собственная непрозрачная заливка нужна всем ячейкам блока.
  const covers =
    (pin === "left" && scrolledFromStart) ||
    (pin === "right" && scrolledFromEnd)

  const style: React.CSSProperties | undefined = pin
    ? pin === "left"
      ? { left: offset }
      : { right: offset }
    : undefined

  // Header cells sit above body cells, and a pinned header cell above the
  // rest of the header — otherwise the scrolling columns slide over the
  // corner where the two stickies meet.
  // Note: no background here on purpose — a pinned cell must be opaque, but
  // *which* opaque fill differs (the header keeps white, a body cell takes
  // the row's own Line Fill), so each call site appends its own after this
  // class string.
  const className = pin
    ? cn("relative sticky", header ? "z-30" : "z-10")
    : header
      ? "relative z-20"
      : "relative"

  // A real element rather than `::after`: `<th>` already spends both of its
  // pseudo-elements on the header's bottom rule and the column divider.
  // Absolutely positioned so it can't take a pixel off the block's width the
  // way a `border` would — that pixel is exactly what would let the header
  // drift out of alignment with the body.
  const divider =
    pin && edge ? (
      <span
        aria-hidden="true"
        data-slot="table-pin-divider"
        className={cn(
          "pointer-events-none absolute inset-y-0 z-[1] w-px bg-[var(--table-pin-divider)] transition-opacity duration-150 ease-out",
          pin === "left" ? "right-0" : "left-0",
          covers ? "opacity-100" : "opacity-0"
        )}
      />
    ) : null

  return { ref, style, className, covers, divider }
}

export { usePinPresentation }
