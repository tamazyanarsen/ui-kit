import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"

// Figma models both footer actions as `ELK / button` instances (node
// 32:9064), so they render the real Button rather than a look-alike — that
// is where the white/#252628/#EFEFEF-hover tokens come from. Two caveats
// drive the overrides below:
//   * radius — the buttons sit flush against the card's own rounded,
//     overflow-hidden shell (same flush-row pattern as Dropdown/DropdownItem),
//     so their hover fill must run edge-to-edge with no radius of its own;
//   * sizing — the calendar picks its footer form from the `compact` prop,
//     not from a breakpoint, so Button's `desktop:` half of the `lg` variant
//     has to be pinned to the same value as the base or a mobile sheet viewed
//     at ≥768px would silently grow to the desktop 56px/32px/16px form.
// Desktop = 56px tall, 32px sides, P1 Medium 16/24 (node 7415:58522);
// mobile = 48px tall, 24px sides, P1 Medium Mobile 14/20 (node 7415:58832).
// Дизайн-чек №25 («лишнее свободное место в выпадающем календаре»): карточка
// раздувалась до 305px при спецификации в 280 (символ `Size=Desktop,
// Type=Week`, нода 7415:58522 — min/max-width 280). Виноват был подвал:
// кнопки шли без `min-w-0`, поэтому их min-content — подпись плюс px-8 с
// каждой стороны — работал как распорка (144 + 1 + 158 = 303) и через
// `w-fit` карточки задавал ей ширину. Сетке дней нужно ровно 252 + 28 = 280.
//
// Горизонтальные паддинги при этом ничего не рисуют: кнопки — половинки на
// `flex-1` с центрированной подписью, и при любой ширине карточки ≥ подписи
// результат один в один. В макете они есть (`px-[32px]`), но там же кнопка
// стоит `flex-[1_0_0] min-w-px`, то есть тоже не влияет на ширину родителя.
// Поэтому оставляем `min-w-0` и минимальный паддинг — визуально совпадает с
// макетом, а карточка приходит к своим 280px.
const FOOTER_BUTTON = "min-w-0 flex-1 rounded-none"
const FOOTER_SIZE = {
  regular:
    "h-14 px-2 text-p1-medium desktop:h-14 desktop:px-2 desktop:text-p1-medium",
  compact:
    "h-12 px-2 text-p2-medium desktop:h-12 desktop:px-2 desktop:text-p2-medium",
}

function CalendarFooter({
  compact,
  onReset,
  onApply,
}: {
  /** Mobile sheet uses the M-size button footer (48px); desktop popover uses
   * L (56px) — the two layouts are chosen explicitly by the caller via
   * `layout`, not by a CSS breakpoint, so this is a prop, not a `desktop:`
   * class. */
  compact?: boolean
  onReset?: () => void
  onApply?: () => void
}) {
  const sizeClass = FOOTER_SIZE[compact ? "compact" : "regular"]

  return (
    <div
      className={cn(
        "flex border-t border-[var(--calendar-divider)]",
        compact ? "h-12" : "h-14"
      )}
    >
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onReset}
        className={cn(FOOTER_BUTTON, sizeClass)}
      >
        Сбросить
      </Button>
      <Divider orientation="vertical" />
      <Button
        variant="secondary-white"
        size="lg"
        onClick={onApply}
        className={cn(FOOTER_BUTTON, sizeClass)}
      >
        Применить
      </Button>
    </div>
  )
}

export { CalendarFooter }
