import * as React from "react"

import { X } from "@/icons"
import { cn } from "@/lib/utils"

// CloseCross — плоский крестик закрытия, один на весь кит.
//
// Крестик жил одиннадцатью копиями. У тоста, верхнего сообщения, информера и
// тултипа не было отклика на нажатие вовсе (в других местах был), а коробка
// 24 × 24 стояла то с радиусом, то без — то есть у одного и того же элемента
// расходились и поведение, и геометрия.
//
// Разделение такое: **поведение (курсор, нажатие, кольцо фокуса, радиус) —
// общее, а размер и цвет остаются за местом применения**. Цвет и правда
// разный по месту: у тоста он свой, у тултипа свой, на чёрной панели белый —
// это не расхождение, а часть оформления блока.
//
// Отклик на нажатие — тоже токеном (`--close-cross-fg-active`), а не жёстко
// зашитым цветом: на светлом блоке нажатие темнит глиф до Grey 1514, а на
// тёмной панели это сделало бы его невидимым, и место применения обязано
// иметь возможность переопределить ступень.
//
// ⚠️ Крестик НА ПЛАШКЕ (Modal, Calendar, OTP) сюда не относится: он в Figma
// инстанс `ELK / button` и собирается кнопкой кита
// (`variant="secondary-grey" size="sm" iconPosition="only"`), а плашку красит
// один общий токен `--btn-secondary-grey-bg`.

interface CloseCrossProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  /**
   * Размер глифа. У крестика ДВА самостоятельных рисунка, а не один
   * масштабированный: 24px-коробка обязана получать 24px-рисунок, иначе
   * линии выходят на треть толще макета.
   */
  size?: 16 | 24
}

const GLYPH_CLASS: Record<16 | 24, string> = {
  16: "size-4",
  24: "size-6",
}

function CloseCross({
  size = 16,
  className,
  "aria-label": ariaLabel = "Закрыть",
  ...props
}: CloseCrossProps) {
  return (
    <button
      type="button"
      data-slot="close-cross"
      aria-label={ariaLabel}
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center rounded-[4px] outline-none transition-colors",
        "active:text-[var(--close-cross-fg-active)]",
        "focus-visible:focus-ring",
        "disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <X size={size} aria-hidden="true" className={GLYPH_CLASS[size]} />
    </button>
  )
}

export { CloseCross }
export type { CloseCrossProps }
