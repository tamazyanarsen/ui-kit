import { OtpInput, ResendCode, OtpConfirmCard } from "@/components/ui/otp"
import { Button } from "@/components/ui/button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function OtpDemo() {
  return (
    <>
      <AccordionItem value="otp-card-states">
        <AccordionTrigger>OTP code — состояния карточки</AccordionTrigger>
        <AccordionPanel>
          <div className="flex flex-wrap gap-4">
            <OtpConfirmCard
              phone="+7 (912) 345-67-89"
              trigger={<Button variant="secondary-grey">Default</Button>}
            />
            <OtpConfirmCard
              phone="+7 (912) 345-67-89"
              defaultValue="882372"
              trigger={<Button variant="secondary-grey">Filled</Button>}
            />
            <OtpConfirmCard
              phone="+7 (912) 345-67-89"
              defaultValue="882372"
              error="Неверный код, превышено количество попыток"
              trigger={<Button variant="secondary-grey">Error</Button>}
            />
            <OtpConfirmCard
              phone="+7 (912) 345-67-89"
              resendSeconds={0}
              trigger={
                <Button variant="secondary-grey">Send Password</Button>
              }
            />
          </div>
          <p className="mt-4 text-p3-regular text-muted-foreground">
            Компонент — это модальное окно: Figma собирает{" "}
            <code>ELK / otp-code</code> как инстанс <code>ELK / Modal</code>,
            поэтому карточка рендерится через настоящий <code>Modal</code>{" "}
            (портал, затемнение, Esc, фокус-трап и крестик — его). Валидация
            запускается только по клику «Подтвердить» — кнопка блокируется
            лишь пока код не введён полностью, а не пока он не проверен; при
            ошибке цифры становятся красными, но подчёркивание остаётся серым
            (в отличие от Input/Textarea, где при ошибке краснеет именно
            рамка).
          </p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="otp-elements">
        <AccordionTrigger>OTP code — элементы (Input / Resend)</AccordionTrigger>
        <AccordionPanel>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <RowLabel>Пусто</RowLabel>
                <OtpInput containerClassName="mx-0 md:w-full" />
              </div>
              <div className="space-y-1.5">
                <RowLabel>Заполнено</RowLabel>
                <OtpInput
                  containerClassName="mx-0 md:w-full"
                  defaultValue="882372"
                />
              </div>
              <div className="space-y-1.5">
                <RowLabel>Ошибка</RowLabel>
                <OtpInput
                  containerClassName="mx-0 md:w-full"
                  defaultValue="882372"
                  error="Неверный код, превышено количество попыток"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <RowLabel>Resend — обратный отсчёт</RowLabel>
                <ResendCode seconds={59} />
              </div>
              <div className="space-y-1.5">
                <RowLabel>Resend — активна</RowLabel>
                <ResendCode seconds={0} />
              </div>
            </div>
          </div>
        </AccordionPanel>
      </AccordionItem>
    </>
  )
}

export { OtpDemo }
