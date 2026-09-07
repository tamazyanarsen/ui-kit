import * as React from "react"

import { cn } from "@/lib/utils"
import { useOverflowCount } from "@/lib/use-overflow-count"
import { useViewportInsetBottom } from "@/lib/use-viewport-inset-bottom"
import { Button } from "@/components/ui/button"

import { ButtonMenuOverflow, ButtonMenuOverflowItem } from "./overflow"

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

/** Зазор между кнопками панели (`gap-4`). */
const BUTTON_GAP = 16
/** Место под «…»: `icon-lg` на десктопе — 56px, плюс зазор. */
const OVERFLOW_RESERVED = 56 + BUTTON_GAP

interface ButtonMenuProps extends React.ComponentProps<"div"> {
  /**
   * Прижимать панель к низу контейнера. По умолчанию включено — в макете
   * она всегда закреплена; выключайте, когда панель нужна обычным блоком
   * в потоке (например, внутри карточки).
   */
  pinned?: boolean
}

type ButtonElement = React.ReactElement<{
  children?: React.ReactNode
  onClick?: React.MouseEventHandler
  disabled?: boolean
  size?: string
}>

const isButton = (node: React.ReactNode): node is ButtonElement =>
  React.isValidElement(node) && node.type === Button

const isOverflow = (
  node: React.ReactNode
): node is React.ReactElement<{ children?: React.ReactNode }> =>
  React.isValidElement(node) && node.type === ButtonMenuOverflow

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
// переданного, если передал.
function ButtonMenu({ pinned = true, className, children, ...props }: ButtonMenuProps) {
  const nodes = React.Children.toArray(children)
  const buttons = nodes.filter(isButton)
  const supplied = nodes.find(isOverflow)
  // Всё, что не кнопка и не меню «ещё», рисуется как есть и в замер не
  // входит: панель не берётся угадывать, что это и как оно сжимается.
  const extras = nodes.filter((node) => !isButton(node) && !isOverflow(node))

  const { containerRef, itemRefs, visibleCount } = useOverflowCount(
    buttons.length,
    // Место под «…» резервируется только когда ему есть куда деться: если
    // вызывающий уже передал меню, оно и так занимает место в ряду.
    supplied ? 0 : OVERFLOW_RESERVED,
    BUTTON_GAP
  )

  // Design-check #6: every Button child is forced to Large Desktop
  // regardless of what size (if any) the caller passed — the spec requires
  // uniform height across the row, and Button's own default size isn't
  // "lg", so without this a plain `<Button>` here would silently render
  // shorter than ButtonMenuOverflow's always-lg trigger.
  const sized = (child: ButtonElement, key: React.Key) =>
    React.cloneElement(child, { key, size: "lg" })

  const visible = buttons.slice(0, visibleCount).map(sized)
  const hidden = buttons.slice(visibleCount)

  // Спрятанная кнопка становится строкой меню: подпись — её содержимое,
  // действие — её же обработчик. Ничего третьего у кнопки панели нет.
  const hiddenItems = hidden.map((child, index) => (
    <ButtonMenuOverflowItem
      key={`overflow-${index}`}
      text={child.props.children}
      disabled={child.props.disabled}
      onClick={child.props.onClick as (() => void) | undefined}
    />
  ))

  let overflow: React.ReactNode = null
  if (supplied) {
    // Переданное меню остаётся тем же инстансом (у него свои Direction,
    // Size и Show Dropdown) — в него лишь дописываются спрятанные команды,
    // причём В НАЧАЛО: они стояли левее в ряду.
    overflow = React.cloneElement(supplied, undefined, [
      ...hiddenItems,
      ...React.Children.toArray(supplied.props.children),
    ])
  } else if (hiddenItems.length > 0) {
    overflow = <ButtonMenuOverflow>{hiddenItems}</ButtonMenuOverflow>
  }

  // Та же публикация занятой высоты, что и у чёрной панели: всё, что липнет
  // к низу вьюпорта (полоса прокрутки таблицы), обязано вставать над ней.
  const ref = React.useRef<HTMLDivElement>(null)
  useViewportInsetBottom(ref, pinned)

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
      data-pinned={pinned || undefined}
      className={cn(
        "flex w-full items-center gap-4 rounded-tl-[16px] rounded-tr-[16px] border-t border-r border-l border-solid border-[var(--button-menu-border)] bg-[var(--button-menu-bg)] px-8 py-4 shadow-universal",
        pinned && PINNED_CLASS,
        className
      )}
      {...props}
    >
      {/* Мерная зона — только ряд кнопок: `extras` в неё не входят, иначе
          панель считала бы их место свободным. */}
      <div
        ref={containerRef}
        data-slot="button-menu-row"
        className="relative flex min-w-0 flex-1 items-center gap-4"
      >
        {visible}
        {overflow}
        <MeasureRow buttons={buttons} itemRefs={itemRefs} />
      </div>
      {extras}
    </div>
  )
}

/**
 * Всегда отрисованная невидимая копия ряда — источник ширин для
 * `useOverflowCount`: спрятанная кнопка мерялась бы нулём и счёт больше
 * никогда не вырос бы обратно.
 *
 * ⚠️ Обёртка `inset-0 overflow-hidden` обязательна: копия шире ряда по
 * определению, и хотя она абсолютная, в ОБЛАСТЬ ПРОКРУТКИ документа она
 * входит — без обрезки панель раздвигала бы страницу вбок (ровно этот
 * дефект чинился в шапке, см. header/nav-row).
 */
function MeasureRow({
  buttons,
  itemRefs,
}: {
  buttons: ButtonElement[]
  itemRefs: ReturnType<typeof useOverflowCount>["itemRefs"]
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none invisible absolute inset-0 overflow-hidden"
    >
      <div className="absolute top-0 left-0 flex gap-4">
        {buttons.map((child, index) => (
          <div
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="shrink-0"
          >
            {React.cloneElement(child, { size: "lg" })}
          </div>
        ))}
      </div>
    </div>
  )
}

export { ButtonMenu }
export type { ButtonMenuProps }
