import { cn } from "@/lib/utils"

// Рисованные ячейки кода поверх прозрачного `<input>`.
//
// Цифры в Object Sans пропорциональные (у «1» ход 18px, у «0» 32px при кегле
// 44), а мастер кладёт каждую в ячейку 40px по центру с зазором 16 (десктоп) и
// 8 (мобильная): ширина чернил кода 882372 — 304px. Через `letter-spacing`
// у самого поля такой ритм не получить — он даёт постоянный шаг «начало —
// начало», и цифры «гуляют» относительно ячеек. Поэтому цифры рисуются здесь,
// а поле остаётся единственным носителем значения, фокуса, вставки, стирания
// и выделения — только его текст и каретка прозрачны, а каретку и
// подсветку выделения рисует этот слой.
//
// Слой `aria-hidden` и не ловит указатель: скринридер читает поле, клики
// доходят до него (положение каретки по клику выставляет само поле).
interface OtpCellsProps {
  /** Введённые цифры. */
  digits: string
  /** Выделение в поле (индексы цифр). */
  start: number
  end: number
  focused: boolean
  invalid: boolean
  disabled?: boolean
}

const CARET =
  "absolute top-1/2 h-[1.2em] w-px -translate-y-1/2 bg-current animate-[otp-caret-blink_1s_step-end_infinite]"

// Каретка пустого поля (состояние Focused мастера, где placeholder скрыт —
// см. `focus:placeholder:text-transparent` у поля): 1px шириной, 32px высотой
// на мобильной форме и 40px на десктопной, верхним краем вровень с кадром
// Code (центр на calc(50% - 8px) при высоте кадра 48/56), цвет #252628. С
// цифрами каретка стоит между ячейками и повторяет их строку (CARET выше) —
// для неё в мастере состояния нет.
const CARET_EMPTY =
  "absolute top-0 h-8 w-px bg-current animate-[otp-caret-blink_1s_step-end_infinite] desktop:h-10"

function OtpCells({ digits, start, end, focused, invalid, disabled }: OtpCellsProps) {
  const cells = Array.from(digits)
  // Каретка стоит на границе ячеек: перед ячейкой `start`, а в конце кода —
  // после последней. Половина зазора отделяет её от цифры.
  const caretAt = focused && start === end ? start : -1

  return (
    <div
      aria-hidden="true"
      data-slot="otp-cells"
      // Те же кегль, высота и нижний отступ, что у поля под слоем: строка
      // центрируется в том же окне, поэтому цифры стоят на тех же y, что
      // и в мастере (центр строки на 24 при высоте 56, на 19 при 48).
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 box-border flex h-12 items-center justify-center border-b border-transparent pb-[10px] text-h1-mobile [--otp-gap:8px]",
        "desktop:h-14 desktop:pb-[7px] desktop:text-h1 desktop:[--otp-gap:16px]",
        "desktop:@max-[367px]/otp:h-12 desktop:@max-[367px]/otp:pb-[10px] desktop:@max-[367px]/otp:text-h1-mobile desktop:@max-[367px]/otp:[--otp-gap:8px]",
        invalid ? "text-[var(--otp-error-fg)]" : "text-[var(--otp-fg)]",
        disabled && "opacity-50"
      )}
    >
      {cells.length === 0 ? (
        // Пустое поле в фокусе: каретка по центру подчёркивания, как в
        // состоянии Focus мастера; placeholder в фокусе прозрачный.
        focused && <span data-slot="otp-caret" className={CARET_EMPTY} />
      ) : (
        // Ячейка 40px, зазор — из переменной слоя. В узкой колонке ячейки
        // сжимаются (`shrink`), а зазор остаётся: длинный код не уходит
        // за край.
        <div className="flex w-full min-w-0 justify-center gap-(--otp-gap)">
          {cells.map((digit, index) => {
            const selected = focused && index >= start && index < end
            return (
              <span
                key={index}
                data-otp-cell=""
                className={cn(
                  "relative w-10 min-w-0 shrink text-center",
                  selected && "bg-[Highlight] text-[HighlightText]"
                )}
              >
                {digit}
                {caretAt === index && (
                  <span
                    data-slot="otp-caret"
                    className={cn(CARET, "left-[calc(var(--otp-gap)/-2)]")}
                  />
                )}
                {caretAt === cells.length && index === cells.length - 1 && (
                  <span
                    data-slot="otp-caret"
                    className={cn(CARET, "right-[calc(var(--otp-gap)/-2)]")}
                  />
                )}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { OtpCells }
