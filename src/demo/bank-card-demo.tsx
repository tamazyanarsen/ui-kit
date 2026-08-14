import { BankCard, SKIN_LABELS } from "@/components/ui/bank-card"
import type { BankCardSkin } from "@/components/ui/bank-card"
import type { PaymentSystem } from "@/components/ui/thumbnail"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const SKINS = Object.keys(SKIN_LABELS) as BankCardSkin[]

function BankCardDemo() {
  return (
    <AccordionItem value="bank-card">
      <AccordionTrigger>Cards — банковская карта</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Типы карт — 10 скинов (клик по карте переворачивает)</RowLabel>
          <div className="flex flex-wrap gap-6">
            {SKINS.map((skin) => (
              <div key={skin} className="flex flex-col items-start gap-2">
                <BankCard skin={skin} />
                <span className="max-w-[332px] text-p3-regular text-muted-foreground">
                  {SKIN_LABELS[skin]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Платёжные системы</RowLabel>
          <div className="flex flex-wrap gap-6">
            {(["mir", "mastercard", "visa", "unionpay"] as PaymentSystem[]).map((system) => (
              <BankCard key={system} skin="black-classic" paymentSystem={system} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Отображение баланса / номера / платёжной системы</RowLabel>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-start gap-2">
              <BankCard skin="mono" />
              <span className="text-p3-regular text-muted-foreground">Баланс открыт</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <BankCard skin="mono" showRequisites={false} />
              <span className="text-p3-regular text-muted-foreground">
                Скрыта ссылка «Показать реквизиты»
              </span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <BankCard skin="mono" showBalance={false} />
              <span className="text-p3-regular text-muted-foreground">Баланс скрыт</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <BankCard skin="mono" showCardNumber={false} />
              <span className="text-p3-regular text-muted-foreground">Без номера карты</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <BankCard skin="mono" showPaymentSystem={false} showCardNumber={false} />
              <span className="text-p3-regular text-muted-foreground">Без платёжной системы</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <BankCard
                skin="mono"
                showPaymentSystem={false}
                showCardNumber={false}
                showRequisites={false}
              />
              <span className="text-p3-regular text-muted-foreground">Без информации</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Обратная сторона — раскрытие номера/CVC (копирует значение и
            показывает тост)
          </RowLabel>
          <BankCard skin="black-classic" />
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Скины — CSS-аппроксимация (в Фигме фон каждой карты — растровый
          ассет без извлекаемых цветовых данных), в духе тех же упрощений, что
          у платёжных лого в Thumbnail/Card. Клик по лицевой стороне или по
          «Показать реквизиты» переворачивает карту на 180° (250ms ease-out) к
          реквизитам; клик по иконке глаза раскрывает номер карты или CVC/CVV
          (взаимоисключающе — открытие одного скрывает другое) и одновременно
          копирует значение в буфер обмена, показывая тост.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { BankCardDemo }
