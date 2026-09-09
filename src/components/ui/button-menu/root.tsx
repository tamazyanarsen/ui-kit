import * as React from "react"

import { cn } from "@/lib/utils"
import { useViewportInsetBottom } from "@/lib/use-viewport-inset-bottom"

import { ButtonMenuRow, isButton, isOverflow } from "./row"
import { PINNED_CLASS, barShapeClass } from "./pinning"

// Закрепление у нижнего края — поведение по умолчанию, а не опция «на
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

interface ButtonMenuProps extends React.ComponentProps<"div"> {
  /**
   * Прижимать панель к низу контейнера. По умолчанию включено — в макете
   * она всегда закреплена; выключайте, когда панель нужна обычным блоком
   * в потоке (например, внутри карточки).
   */
  pinned?: boolean
  /**
   * «Отлипшая» полоса — дизайн-чек от 08.09, замечание 9: в продукте такого
   * состояния быть не должно, но пропс заведён на будущее. Полоса становится
   * островом в потоке и получает скругления снизу, такие же как сверху.
   */
  detached?: boolean
}

// Pill-shaped inline toolbar. Pass `Button` instances as children — per the
// spec, a Primary button (if any) always goes first/left (though the first
// slot can just as validly be Secondary/grey — the spec doesn't force a
// brand button), followed by up to three Secondary buttons ordered
// most-frequently-used first.
//
// Дизайн-чек от 07.09, замечание 3: «Непоместившиеся кнопки должны уходить
// в многоточие. Либо 3 команды и многоточие (если всё влезло), либо если не
// влезло — то правые команды тоже должны уходить в многоточие». Раньше
// панель просто рисовала всё, что ей дали, и лишние кнопки вылезали за
// правый край. Теперь ряд меряется тем же механизмом, что и навигация
// шапки, табы и свитчер (`useOverflowCount`), а не поместившиеся кнопки
// уходят в меню «ещё» — своё, если вызывающий его не передал, или в конец
// переданного, если передал. Сам механизм с 08.09 живёт в `ButtonMenuRow` и
// переиспользуется рядами команд вне панели (дизайн-чек от 08.09, №3).
function ButtonMenu({
  pinned = true,
  detached = false,
  className,
  children,
  ...props
}: ButtonMenuProps) {
  const nodes = React.Children.toArray(children)
  // Всё, что не кнопка и не меню «ещё», рисуется как есть и в замер не
  // входит: панель не берётся угадывать, что это и как оно сжимается.
  const row = nodes.filter((node) => isButton(node) || isOverflow(node))
  const extras = nodes.filter((node) => !isButton(node) && !isOverflow(node))

  // Та же публикация занятой высоты, что и у чёрной панели: всё, что липнет
  // к низу вьюпорта (полоса прокрутки таблицы), обязано вставать над ней.
  const ref = React.useRef<HTMLDivElement>(null)
  useViewportInsetBottom(ref, pinned && !detached)

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
      ref={ref}
      data-slot="button-menu"
      data-pinned={(pinned && !detached) || undefined}
      data-detached={detached || undefined}
      className={cn(
        "flex w-full items-center gap-4 border-t border-r border-l border-solid border-[var(--button-menu-border)] bg-[var(--button-menu-bg)] px-8 py-4 shadow-universal",
        barShapeClass({ detached, bordered: true }),
        pinned && !detached && PINNED_CLASS,
        className
      )}
      {...props}
    >
      {/* Мерная зона — только ряд кнопок: `extras` в неё не входят, иначе
          панель считала бы их место свободным. */}
      <ButtonMenuRow size="lg">{row}</ButtonMenuRow>
      {extras}
    </div>
  )
}

export { ButtonMenu }
export type { ButtonMenuProps }
