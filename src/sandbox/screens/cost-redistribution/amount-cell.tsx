import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import { integer, money, parseAmount } from "../../shell"

// Ячейка суммы в таблице перераспределения ССР.
//
// В эталоне (кадр 70371:36101) у каждой суммы своя коробка поля, и различаются
// они ровно одним: у РОДИТЕЛЬСКИХ строк и у столбца «Сметная стоимость» поле
// залито серым и не редактируется — это производная величина, — а у листьев в
// столбцах средств поле белое и в него вводят.
//
// Почему не `Input readOnly`: заблокированное поле кита гасит и текст, а здесь
// сумма — главное содержимое строки и читаться должна в полную силу. Поэтому
// нередактируемый вариант — не поле вовсе, а плашка тех же размеров: та же
// высота 32, тот же радиус 8 и те же поля 16, но без рамки и без фокуса.

interface AmountCellProps {
  value: number
  /** Поле только для чтения — серая плашка вместо ввода. */
  readOnly?: boolean
  onChange?: (next: number) => void
  label?: string
}

// ⚠️ Ширина в пикселях, а не `w-full`. Ячейка таблицы выключена вправо и
// сжимает содержимое до его собственной ширины (замер: колонка 240, а коробка
// поля — 114), поэтому `w-full` считался бы от уже сжатого предка. 184 — это
// 200 из макета (нода 70371:36205, «Ячейка шапки шага 1») минус поля ячейки.
const BOX = "h-8 w-[184px] rounded-[8px] px-4 text-p2-medium"

function AmountCell({ value, readOnly, onChange, label }: AmountCellProps) {
  // ⚠️ В поле с маской `amount` уходит УЖЕ РАЗБИТАЯ по разрядам строка, а не
  // «90000000». Маска подгоняет ширину поля под ширину числа (невидимым
  // двойником в `AmountSuffix` — иначе знак «₽» повис бы в стороне), а меряет
  // она ровно ту строку, которую ей дали. С сырыми цифрами двойник намерял
  // 62px под текст в 81, и число обрезалось до «90 000 (₽».
  const [text, setText] = React.useState(() => integer(value))

  // Значение может приехать снаружи (сброс формы, пересчёт). Сверка идёт по
  // ЧИСЛУ, а не по строке: своё же форматирование иначе затирало бы ввод на
  // каждом нажатии.
  React.useEffect(() => {
    setText((prev) => (parseAmount(prev) === value ? prev : integer(value)))
  }, [value])

  if (readOnly) {
    return (
      <span
        className={cn(
          BOX,
          "flex items-center bg-[var(--grey-109)] text-[var(--grey-284)] tabular-nums"
        )}
      >
        {money(value)}
      </span>
    )
  }

  return (
    <Input
      size="sm"
      mask="amount"
      aria-label={label}
      // Крестика очистки у суммы нет: пустая сумма — это не «нет значения», а
      // ноль, и стирать её одним нажатием опаснее, чем полезно.
      clearable={false}
      value={text}
      onChange={(event) => {
        setText(event.target.value)
        onChange?.(parseAmount(event.target.value))
      }}
      containerClassName={cn(BOX, "min-w-0")}
    />
  )
}

export { AmountCell }
export type { AmountCellProps }
