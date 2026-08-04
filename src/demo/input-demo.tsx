import { CalendarDays, Check, Wallet, Search, CircleAlert } from "@/icons"

import { Input } from "@/components/ui/input"
import type { MaskName } from "@/components/ui/input"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const DIGIT_MASKS: { mask: MaskName; label: string }[] = [
  { mask: "phone", label: "Телефон" },
  { mask: "passport", label: "Серия и номер паспорта" },
  { mask: "foreign-passport", label: "Загранпаспорт" },
  { mask: "card", label: "Номер карты" },
  { mask: "account", label: "Счёт получателя" },
  { mask: "amount", label: "Сумма" },
  { mask: "inn", label: "ИНН" },
  { mask: "kpp", label: "КПП" },
  { mask: "kbk", label: "Код бюджетной классификации" },
]

// Input only has two size tokens (no M) — L is mobile-first responsive
// (48px -> 56px at md:), S is fixed at 32px on both breakpoints.
const INPUT_SIZES = [
  { key: "sm", label: "S" },
  { key: "lg", label: "L" },
] as const

function InputDemo() {
  return (
    <>
      <AccordionItem value="input-states">
        <AccordionTrigger>Input — состояния (L)</AccordionTrigger>
        <AccordionPanel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input size="lg" label="Label" />
            <Input size="lg" label="Label" defaultValue="Placeholder" />
            <Input
              size="lg"
              label="Label"
              comment="Comment"
              defaultValue="Placeholder"
            />
            <Input size="lg" label="Label" comment="Comment без значения" />
            <Input size="lg" label="Label" locked defaultValue="Placeholder" />
            <Input size="lg" label="Label" error="Text about error here" />
            <Input
              size="lg"
              label="Label"
              error="Text about error here"
              defaultValue="Placeholder"
            />
            <Input
              size="lg"
              label="Label"
              error="Text about error here"
              locked
              defaultValue="Placeholder"
            />
            <Input size="lg" label="Label" disabled />
            <Input
              size="lg"
              label="Label"
              disabled
              defaultValue="Placeholder"
            />
            <Input
              size="lg"
              label="E-mail"
              placeholder="you@example.com"
              clearable={false}
            />
            <Input size="lg" label="Без кнопки очистки" clearable={false} />
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="input-sizes">
        <AccordionTrigger>Input — размеры (S / L)</AccordionTrigger>
        <AccordionPanel>
          <div className="space-y-4">
            {INPUT_SIZES.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <RowLabel>{label}</RowLabel>
                <Input
                  size={key}
                  label="Label"
                  defaultValue="Placeholder"
                  containerClassName="max-w-xs"
                />
                <Input size={key} label="Label" containerClassName="max-w-xs" />
              </div>
            ))}
          </div>
          <p className="mt-4 text-p3-regular text-muted-foreground">
            У Input только два размера — M отсутствует. S (32px, radius 8px)
            не меняется между брейкпоинтами и не показывает floating label
            (нет места под вторую строку) — плейсхолдер просто выступает
            статичным лейблом. L — mobile-first (48px → 56px на md:, radius
            16px), с floating label как на L/Desktop.
          </p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="input-masks">
        <AccordionTrigger>Input — маски</AccordionTrigger>
        <AccordionPanel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DIGIT_MASKS.map(({ mask, label }) => (
              <Input
                key={mask}
                size="lg"
                label={label}
                mask={mask}
                defaultValue={mask === "card" ? "1234567890123456" : undefined}
                iconLeft={
                  mask === "card" ? (
                    <Wallet className="text-[#EB001B]" />
                  ) : undefined
                }
              />
            ))}
            <Input
              size="lg"
              label="Дата"
              mask="date"
              iconLeft={<CalendarDays />}
            />
            <Input size="lg" label="Пароль" type="password" defaultValue="1234567890" />
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <RowLabel>Поиск — Icon Left + Loading</RowLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input size="lg" label="Поиск" iconLeft={<Search />} />
              <Input
                size="lg"
                label="Поиск"
                iconLeft={<Search />}
                defaultValue="Поиск"
                loading
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <RowLabel>Icon Left / Trailing Icon — универсальные слоты</RowLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                size="lg"
                label="Label"
                iconLeft={<CircleAlert className="text-[var(--input-border-error)]" />}
              />
              <Input
                size="lg"
                label="Промокод"
                defaultValue="93YDM"
                trailingIcon={<Check className="text-[var(--progress-green)]" />}
              />
            </div>
          </div>

          <p className="mt-4 text-p3-regular text-muted-foreground">
            <code>mask</code> форматирует значение на каждое нажатие и
            сообщает итоговую строку обратно через <code>onChange</code>{" "}
            (<code>e.target.value</code>). <code>iconLeft</code> — статичная
            иконка слева (не зависит от маски). Слот справа — приоритет{" "}
            <code>locked</code> → <code>loading</code> →{" "}
            <code>type="password"</code> (глаз) → <code>trailingIcon</code>{" "}
            → кнопка очистки. Список масок:{" "}
            <code>phone / date / passport / foreign-passport / card /
            account / amount / inn / kpp / kbk</code>.
          </p>
        </AccordionPanel>
      </AccordionItem>
    </>
  )
}

export { InputDemo }
