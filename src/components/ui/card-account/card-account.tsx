import type * as React from "react"

import { cn } from "@/lib/utils"
import { PaymentLogo, type PaymentSystem } from "@/components/ui/thumbnail"

/**
 * CardAccount — миниатюра банковской карты 48×34: платёжная система
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
 *
 * Дизайн-чек от 07.09, замечания 2 и 7: «переименовать в card account, как
 * в ДС» (был `CardPictogram`) и «сюда нужно централизованно пробрасывать
 * компонент… не хватает иконок платёжных систем» — плашку счёта, собранную
 * по месту, теперь подключают и `Card`, и витрина `Block Widget`, поэтому
 * платёжная система появляется везде одинаково, а не только там, где её
 * не забыли передать.
 */
interface CardAccountProps {
  /** Платёжная система — логотип в левом верхнем углу. */
  paymentSystem?: PaymentSystem
  /**
   * Окончание номера карты, например «4482». Показывается в правом нижнем
   * углу. Именно его не хватало на дизайн-чеке.
   */
  number?: React.ReactNode
  className?: string
}

function CardAccount({
  paymentSystem = "mir",
  number,
  className,
}: CardAccountProps) {
  return (
    <div
      data-slot="card-account"
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
      {/* Дизайн-чек «Storybook 3», замечание 10: окончание номера — P4
          **Regular** (10/12, вес 400), а не Medium. Снято с самого узла
          `IB / card account` (54276:9378): единственный текст в нём —
          `Object_Sans:Regular`, «Desktop. Параграф/P4 Regular». Разница в
          одном шаге веса, на 10 пикселях её видно только рядом с эталоном. */}
      {number && (
        <span className="absolute right-[3px] bottom-[3px] text-p4-regular text-[var(--card-thumb-fg)]">
          {number}
        </span>
      )}
    </div>
  )
}

export { CardAccount }
export type { CardAccountProps }
