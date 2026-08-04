import { OtpInput, ResendCode, OtpConfirmCard } from "@/components/ui/otp"
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-1.5">
              <RowLabel>Default</RowLabel>
              <div className="rounded-3xl bg-[#F8F8F8] p-4">
                <OtpConfirmCard
                  phone="+7 (912) 345-67-89"
                  onClose={() => {}}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <RowLabel>Filled</RowLabel>
              <div className="rounded-3xl bg-[#F8F8F8] p-4">
                <OtpConfirmCard
                  phone="+7 (912) 345-67-89"
                  defaultValue="882372"
                  onClose={() => {}}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <RowLabel>Error</RowLabel>
              <div className="rounded-3xl bg-[#F8F8F8] p-4">
                <OtpConfirmCard
                  phone="+7 (912) 345-67-89"
                  defaultValue="882372"
                  error="Неверный код, превышено количество попыток"
                  onClose={() => {}}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <RowLabel>Send Password (resend активна)</RowLabel>
              <div className="rounded-3xl bg-[#F8F8F8] p-4">
                <OtpConfirmCard
                  phone="+7 (912) 345-67-89"
                  resendSeconds={0}
                  onClose={() => {}}
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-p3-regular text-muted-foreground">
            Карточка рендерит только контент (как Calendar) — модалку/bottom
            sheet вокруг неё оборачивает страница. Валидация запускается
            только по клику «Подтвердить» — кнопка блокируется лишь пока код
            не введён полностью, а не пока он не проверен; при ошибке цифры
            становятся красными, но подчёркивание остаётся серым (в отличие
            от Input/Textarea, где при ошибке краснеет именно рамка).
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
