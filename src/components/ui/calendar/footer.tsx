import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"

// Оба действия подвала макет собирает инстансами `ELK / button`, поэтому
// здесь рисуется настоящий Button, а не подделка, — отсюда и берутся токены
// белого фона, #252628 и наведения #EFEFEF. Переопределения ниже вызваны
// двумя оговорками:
//   * радиус — кнопки стоят вровень с собственной скруглённой оболочкой
//     карточки с overflow-hidden (та же схема «ряд вровень», что у Dropdown
//     и DropdownItem), поэтому их заливка наведения обязана идти от края до
//     края без собственного радиуса;
//   * размер — форму подвала календарь выбирает по пропсу `compact`, а не по
//     брейкпоинту, поэтому десктопную половину варианта `lg` у Button
//     приходится закреплять на том же значении, что и базовую: иначе
//     мобильная шторка, открытая при ширине ≥768px, молча выросла бы до
//     десктопной формы 56px/32px/16px.
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
  regular:
    "h-14 px-2 text-p1-medium desktop:h-14 desktop:px-2 desktop:text-p1-medium",
  compact:
    "h-12 px-2 text-p2-medium desktop:h-12 desktop:px-2 desktop:text-p2-medium",
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
        "flex overflow-hidden border-t border-[var(--calendar-divider)]",
        compact ? "h-12" : "h-14"
      )}
    >
      {showSecondary && (
        <>
          <Button
            variant="secondary-white"
            size="lg"
            onClick={onReset}
            className={cn(FOOTER_BUTTON, sizeClass)}
          >
            Сбросить
          </Button>
          <Divider orientation="vertical" />
        </>
      )}
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
