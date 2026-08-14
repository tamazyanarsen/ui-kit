import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Закрепление у нижней края — поведение по умолчанию, а не опция «на
// всякий случай»: в макете так и написано — «Панель всегда закреплена в
// нижней части экрана» (Button Menu) и «Button Menu всегда закрепляется в
// нижней части контентной области и занимает всю ширину» (Black).
//
// Именно `sticky`, а не `fixed`: панель остаётся в потоке и упирается в
// низ своего контейнера, поэтому не наезжает на контент — макет отдельно
// оговаривает «Панель не должна перекрывать кнопку „Показать ещё“».
// `fixed` вырвал бы её из потока и как раз перекрыл бы. Из этого же
// следует, что закрепление работает относительно прокручиваемого
// контейнера: панель прижимается к низу контентной области, а не окна.
const PINNED_CLASS = "sticky bottom-0 z-30"

interface ButtonMenuProps extends React.ComponentProps<"div"> {
  /**
   * Прижимать панель к низу контейнера. По умолчанию включено — в макете
   * она всегда закреплена; выключайте, когда панель нужна обычным блоком
   * в потоке (например, внутри карточки).
   */
  pinned?: boolean
}

// Pill-shaped inline toolbar. Pass `Button` instances as children — per the
// spec, a Primary button (if any) always goes first/left (though the first
// slot can just as validly be Secondary/grey — the spec doesn't force a
// brand button), followed by up to three Secondary buttons ordered
// most-frequently-used first. Append `ButtonMenuOverflow` as the last child
// for the "..." overflow menu — 1-3 buttons plus the overflow is a normal
// combination, not a special case.
function ButtonMenu({ pinned = true, className, children, ...props }: ButtonMenuProps) {
  // Design-check #6: every Button child is forced to Large Desktop
  // regardless of what size (if any) the caller passed — the spec requires
  // uniform height across the row, and Button's own default size isn't
  // "lg", so without this a plain `<Button>` here would silently render
  // shorter than ButtonMenuOverflow's always-lg trigger.
  const sizedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Button) {
      return React.cloneElement(child as React.ReactElement<{ size?: string }>, {
        size: "lg",
      })
    }
    return child
  })

  return (
    // Figma's live "ELK / button menu" master component (node 4244:20536,
    // v2.0.0) confirms design-check #5's original reading: this is a
    // bottom-anchored bar, not a floating pill — top corners rounded only,
    // border on the top/left/right only (no bottom border/radius, since
    // that edge sits flush against the viewport/container bottom), plus a
    // specific drop shadow (offset 0/4, blur 12, #8B99A9 @ 24%). The stale
    // static preview asset that justified the old fully-rounded/no-border
    // treatment predates this; trust the live component over it.
    //
    // Full width, not content-hugging: the "Использование в макете" mockups
    // show the bar always spanning the full content width, buttons hugging
    // left with the white background filling the rest — not a fixed-width
    // island (confirmed against the mockups, not just the isolated
    // component preview).
    <div
      data-slot="button-menu"
      data-pinned={pinned || undefined}
      className={cn(
        "flex w-full items-center gap-4 rounded-tl-[16px] rounded-tr-[16px] border-t border-r border-l border-solid border-[var(--button-menu-border)] bg-[var(--button-menu-bg)] px-8 py-4 shadow-universal",
        pinned && PINNED_CLASS,
        className
      )}
      {...props}
    >
      {sizedChildren}
    </div>
  )
}

export { ButtonMenu }
export type { ButtonMenuProps }
