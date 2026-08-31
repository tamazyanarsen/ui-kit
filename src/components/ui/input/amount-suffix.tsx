import * as React from "react"

import { cn } from "@/lib/utils"

import { FIELD_TEXT_SIZE, type InputSize } from "./variants"

/**
 * Знак «₽» у маски суммы — и невидимый двойник, которым меряется ширина
 * числа.
 *
 * Знак стоит РЯДОМ с полем, а не внутри маскированного значения, поэтому
 * поле должно сжиматься по фактической ширине числа, а не растягиваться на
 * весь бокс через `flex-1`. Атрибут `size` (число символов) для этого не
 * годится: он считает каждый символ шириной с «0», а разрядные пробелы в
 * пропорциональном шрифте заметно уже цифры, — `size={value.length}`
 * промахивается тем сильнее, чем длиннее число. Это и есть тот самый баг с
 * «₽, висящим в пустоте после цифр». Замер настоящей ширины текста скрытым
 * близнецом в том же шрифте снимает расхождение целиком.
 */
function AmountSuffix({
  value,
  size,
  floating,
  measureRef,
}: {
  value: string
  size: InputSize
  /** Поле с плавающей подписью сдвигает свой текст вниз — знаку туда же. */
  floating: boolean
  // React.Ref, а не RefObject: типы React 18 и 19 по-разному типизируют
  // результат useRef(null), а Ref принимает обе формы.
  measureRef: React.Ref<HTMLSpanElement>
}) {
  return (
    <>
      <span
        ref={measureRef}
        aria-hidden="true"
        className={cn(
          // Начертание обязано совпадать с видимым текстом глиф в глиф
          // (`font-medium` из `FIELD_TEXT_SIZE`): двойник в другом весе
          // намерял бы не ту ширину.
          "invisible absolute whitespace-pre",
          FIELD_TEXT_SIZE[size]
        )}
      >
        {value}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          // Подтягивает знак из общего `gap` бокса (он одинаково разводит
          // все слоты) примерно до ширины пробела — дизайн-чек №31: число и
          // «₽» по смыслу не два слота, а плотно набранный текст.
          "-ml-1.5 shrink-0 text-[var(--input-fg)] desktop:-ml-2",
          FIELD_TEXT_SIZE[size],
          // Текст поля опускается ниже центра строки, когда плавающая
          // подпись выталкивает его вниз (`pt-4`/`pt-5` у поля). Без того же
          // отступа знак, отцентрованный по полной высоте строки, зависал бы
          // над цифрами.
          floating && "pt-4 desktop:pt-5"
        )}
      >
        ₽
      </span>
      <span aria-hidden="true" className="flex-1" />
    </>
  )
}

export { AmountSuffix }
