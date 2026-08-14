import type * as React from "react"

import { cn } from "@/lib/utils"
import { PaymentLogo, type PaymentSystem } from "@/components/ui/thumbnail"

/**
 * CardPictogram — миниатюра банковской карты 48×34: платёжная система
 * сверху слева, окончание номера снизу справа.
 *
 * Дизайн-чек №15: «некорректное отображение пиктограммы бизнес-карты… не
 * хватает написания конца номера карты… выделить компонент пиктограммы
 * карты в отдельную историю Storybook, потом проложить его сюда как
 * зависимый компонент, не собирать локально пиктограмму карты».
 *
 * Раньше пиктограмма была приватной функцией внутри `card.tsx` — то есть
 * ровно «собрана локально»: своей истории у неё не было, проверить её
 * отдельно было нельзя, а окончание номера в Playground компонента Card не
 * передавалось, поэтому на дизайн-чек она попала пустой. Теперь это
 * самостоятельный компонент со своей историей, а Card подключает его как
 * зависимость.
 */
interface CardPictogramProps {
  /** Платёжная система — логотип в левом верхнем углу. */
  paymentSystem?: PaymentSystem
  /**
   * Окончание номера карты, например «4482». Показывается в правом нижнем
   * углу. Именно его не хватало на дизайн-чеке.
   */
  number?: React.ReactNode
  className?: string
}

function CardPictogram({
  paymentSystem = "mir",
  number,
  className,
}: CardPictogramProps) {
  return (
    <div
      data-slot="card-pictogram"
      aria-hidden="true"
      className={cn(
        "relative h-[34px] w-12 shrink-0 overflow-hidden rounded-[4px] border border-white bg-[var(--card-thumb-bg)]",
        className
      )}
    >
      <PaymentLogo
        system={paymentSystem}
        size="sm"
        className="absolute top-[3px] left-[3px]"
      />
      {number && (
        <span className="absolute right-[3px] bottom-[3px] text-p4-regular text-[var(--card-thumb-fg)]">
          {number}
        </span>
      )}
    </div>
  )
}

export { CardPictogram }
export type { CardPictogramProps }
