import { cn } from "@/lib/utils"
import { DropdownFooterButton } from "@/components/ui/dropdown/dropdown-footer"
import { Divider } from "@/components/ui/divider"

// Кнопки подвала — общая кнопка подвала выпадающих списков
// (`DropdownFooterButton`), а не `Button`: Правки UI-Kit от 25.10 («Button
// внутри выпадающих списков — своё поведение») — заливка наведения и нажатия
// на всю ячейку без скругления, ячейка при нажатии не ужимается, сжимается
// только подпись. Прежде здесь стоял Button secondary-white, и его заливка
// при нажатии ужималась внутри карточки. Классы ниже вызваны двумя
// оговорками:
//   * радиус — кнопки стоят вровень с собственной скруглённой оболочкой
//     карточки с overflow-hidden (та же схема «ряд вровень», что у Dropdown
//     и DropdownItem), поэтому их заливка наведения обязана идти от края до
//     края без собственного радиуса;
//   * размер — форму подвала календарь выбирает по пропсу `compact`, а не по
//     брейкпоинту, поэтому высота и кегль задаются явно (у общей кнопки
//     размер по умолчанию — десктопный).
// Desktop — высота 56px, бока 32px, P1 Medium 16/24; mobile — высота 48px,
// бока 24px, P1 Medium Mobile 14/20.
// Дизайн-чек №25 («лишнее свободное место в выпадающем календаре»): карточка
// раздувалась до 305px при спецификации в 280 (символ `Size=Desktop,
// Type=Week` — min/max-width 280). Виноват был подвал: кнопки шли без
// `min-w-0`, поэтому их min-content — подпись плюс px-8 с каждой стороны —
// работал как распорка (144 + 1 + 158 = 303) и через `w-fit` карточки
// задавал ей ширину. Сетке дней нужно ровно 252 + 28 = 280.
//
// Горизонтальные паддинги при этом ничего не рисуют: кнопки — половинки на
// `flex-1` с центрированной подписью, и при любой ширине карточки ≥ подписи
// результат один в один. В макете они есть (`px-[32px]`), но там же кнопка
// стоит `flex-[1_0_0] min-w-px`, то есть тоже не влияет на ширину родителя.
// Поэтому оставляем `min-w-0` и минимальный паддинг — визуально совпадает с
// макетом, а карточка приходит к своим 280px.
const FOOTER_BUTTON = "min-w-0 flex-1 rounded-none"
const FOOTER_SIZE = {
  regular: "h-full min-h-0 px-2 py-0 text-p1-medium",
  compact: "h-full min-h-0 px-2 py-0 text-p2-medium",
}

function CalendarFooter({
  compact,
  showSecondary = true,
  onReset,
  onApply,
}: {
  /**
   * Свойство `Show Secondary Button` панели свойств: вторичная кнопка
   * «Сбросить». Выключенная оставляет в подвале одну «Применить».
   *
   * Дизайн-чек Storybook (Аня Багрова) №17: свойство есть в макете, но в
   * коде управлять им было нечем.
   */
  showSecondary?: boolean
  /** Мобильная шторка использует подвал с кнопками размера M (48px), а
   * десктопный поповер — L (56px). Раскладку вызывающий код выбирает явно
   * через `layout`, а не по брейкпоинту CSS, поэтому это пропс, а не класс
   * `desktop:`. */
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
      {showSecondary && (
        <>
          <DropdownFooterButton
            onClick={onReset}
            className={cn(FOOTER_BUTTON, sizeClass)}
          >
            Сбросить
          </DropdownFooterButton>
          <Divider orientation="vertical" />
        </>
      )}
      <DropdownFooterButton
        onClick={onApply}
        className={cn(FOOTER_BUTTON, sizeClass)}
      >
        Применить
      </DropdownFooterButton>
    </div>
  )
}

export { CalendarFooter }
