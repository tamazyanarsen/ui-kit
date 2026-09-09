import { Flashlight, Info } from "@/icons"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { Tooltip } from "@/components/ui/tooltip"

import { SandboxCard, integer, money, percent } from "../../shell"

import { estimateIncome, type Offer } from "./data"

// Карточка витрины продуктов.
//
// ⚠️ Это НЕ компонент `Card` кита. `Card` в ките — карта или счёт в списке
// продуктов (миниатюра, номер, владелец, кнопка-многоточие), совсем другая
// сущность. Карточка витрины — композиция экрана, поэтому и живёт рядом с
// экраном, а не в `components/ui`.
//
// Радиус 12 — сведённое значение: в эталонах он не один (8 у «Типа
// подписи», 16 у «Способа подписания», 12 на витрине), приведён к 12 на
// всех песочницах решением дизайнера.

interface OfferCardProps {
  offer: Offer
  /** Сумма и срок из левой колонки — доход считается по ним. */
  amount: number
  days: number
  onSelect: (offer: Offer) => void
}

function OfferCard({ offer, amount, days, onSelect }: OfferCardProps) {
  const approved = offer.approved
  // У одобренного предложения сумма и срок СВОИ, а не из ползунков: это
  // условия, которые банк уже утвердил, и двигать их калькулятором нельзя.
  const income =
    approved && approved.amount > 0
      ? estimateIncome(approved.amount, offer.rate, approved.days)
      : estimateIncome(amount, offer.rate, days)

  return (
    <SandboxCard bordered className="gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {approved && (
            <Tag color="orange" icon={<Flashlight aria-hidden="true" />}>
              Одобрено
            </Tag>
          )}
          {approved && approved.amount > 0 && (
            <span className="text-p2-medium text-[var(--grey-1514)]">
              {money(approved.amount)} на {approved.days} дней
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Tooltip content={offer.info}>
            <button
              type="button"
              aria-label="О продукте"
              className="cursor-pointer text-[var(--grey-284)] outline-none focus-visible:focus-ring"
            >
              <Info aria-hidden="true" className="size-4" />
            </button>
          </Tooltip>
          <Button variant="primary" size="sm" onClick={() => onSelect(offer)}>
            Выбрать
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-h4 text-[var(--grey-1514)]">{offer.title}</h4>
        {offer.subtitle && (
          <p className="text-p2-medium text-[var(--grey-284)]">
            {offer.subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-16">
        <div className="flex flex-col gap-1">
          <span className="text-p2-medium text-[var(--grey-284)]">Ставка</span>
          <span className="flex items-center gap-2 text-h2 text-[var(--grey-1514)]">
            {percent(offer.rate, Number.isInteger(offer.rate) ? 0 : 2)}
            {offer.rateInfo && (
              <Tooltip content={offer.rateInfo}>
                <button
                  type="button"
                  aria-label="О ставке"
                  className="cursor-pointer text-[var(--grey-284)] outline-none focus-visible:focus-ring"
                >
                  <Info aria-hidden="true" className="size-4" />
                </button>
              </Tooltip>
            )}
          </span>
        </div>

        {!offer.incomeless && (
          <div className="flex flex-col gap-1">
            <span className="text-p2-medium text-[var(--grey-284)]">
              Предполагаемый доход
            </span>
            <span className="text-h2 text-[var(--grey-1514)]">
              {integer(Math.round(income))} ₽
            </span>
          </div>
        )}
      </div>

      {approved && (
        <p className="text-p2-medium text-[var(--grey-284)]">
          Предложение действует до {approved.until}
        </p>
      )}
    </SandboxCard>
  )
}

export { OfferCard }
export type { OfferCardProps }
