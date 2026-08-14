import { Thumbnail } from "@/components/ui/thumbnail"
import type { PaymentSystem, ThumbnailType } from "@/components/ui/thumbnail"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const PAYMENT_SYSTEMS: PaymentSystem[] = ["mir", "mastercard", "unionpay", "visa"]

const CARD_FORM_TYPES: { type: ThumbnailType; label: string }[] = [
  { type: "card", label: "Card" },
  { type: "sticker", label: "Sticker" },
  { type: "sbp-card", label: "SBP Card" },
  { type: "sbp-card-account", label: "SBP Card account" },
]

const STATUS_TYPES: { type: ThumbnailType; label: string }[] = [
  { type: "check", label: "Check" },
  { type: "question", label: "Question" },
  { type: "clock", label: "Clock" },
  { type: "alert", label: "Alert" },
  { type: "alert-red", label: "Alert Red" },
  { type: "picture", label: "Picture" },
]

function ThumbnailDemo() {
  return (
    <AccordionItem value="thumbnail">
      <AccordionTrigger>Thumbnail</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Default / Disabled — Card, Count Dot, Count</RowLabel>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Thumbnail type="card" paymentSystem="mir" />
              <span className="text-p3-regular text-muted-foreground">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Thumbnail type="card" paymentSystem="mir" disabled />
              <span className="text-p3-regular text-muted-foreground">Disabled</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Thumbnail type="card" paymentSystem="mir" showDot />
              <span className="text-p3-regular text-muted-foreground">Count Dot</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Thumbnail type="card" paymentSystem="mir" count={3} />
              <span className="text-p3-regular text-muted-foreground">Count</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Thumbnail type="more" />
              <span className="text-p3-regular text-muted-foreground">More</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Платёжные системы — Card / Sticker / SBP Card / SBP Card account</RowLabel>
          <div className="flex flex-col gap-4">
            {CARD_FORM_TYPES.map(({ type, label }) => (
              <div key={type} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {PAYMENT_SYSTEMS.map((system) => (
                    <Thumbnail
                      key={system}
                      type={type}
                      paymentSystem={system}
                      last4="2545"
                    />
                  ))}
                </div>
                <span className="text-p3-regular text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Статусы — Check / Question / Clock / Alert / Alert Red / Picture
          </RowLabel>
          <div className="flex items-center gap-6">
            {STATUS_TYPES.map(({ type, label }) => (
              <div key={type} className="flex flex-col items-center gap-2">
                <Thumbnail type={type} showDot={type !== "picture"} />
                <span className="text-p3-regular text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Размеры — L (48) / M (40)</RowLabel>
          <div className="flex items-end gap-4">
            <Thumbnail type="card" paymentSystem="visa" size="l" />
            <Thumbnail type="card" paymentSystem="visa" size="m" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Использование в макете — Info block</RowLabel>
          <div className="flex items-center gap-3 rounded-xl bg-[#F8F8F8] p-4">
            <Thumbnail type="card" paymentSystem="mir" />
            <div className="flex flex-col">
              <span className="text-p2-regular text-[#252628]">
                Привязанная карта · 4452
              </span>
              <span className="text-lg font-medium text-[#252628]">
                1 100 000,00 ₽
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Thumbnail включает иконку/изображение и опционально статус — точку
          (<code>showDot</code>) или счётчик (<code>count</code>), переиспользуя{" "}
          <code>Badge</code> тем же способом, что и оверлей на Button.
          Card-типы (Card/Sticker/SBP Card/SBP Card account/More) — тёмная
          плитка с платёжной системой; статусные типы (Check/Question/
          Clock/Alert/Alert Red) — плитка с тинтом соответствующего цвета
          из токенов Tag/Informer. Платёжные логотипы (МИР/MasterCard/
          UnionPay/Visa) — упрощённые аппроксимации, не настоящие бренд-ассеты.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ThumbnailDemo }
