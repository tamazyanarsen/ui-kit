import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const VARIANTS = [
  { key: "primary", label: "Primary" },
  { key: "secondary-black", label: "Secondary (Black)" },
  { key: "secondary-grey", label: "Secondary (Grey)" },
  { key: "secondary-white", label: "Secondary (White)" },
  { key: "secondary-outline", label: "Secondary (Outline)" },
  { key: "destructive", label: "Destructive" },
] as const

const SIZES = [
  { key: "sm", label: "S" },
  { key: "default", label: "M" },
  { key: "lg", label: "L" },
] as const

function ButtonDemo() {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <AccordionItem value="button-variants">
        <AccordionTrigger>Button — варианты (L)</AccordionTrigger>
        <AccordionPanel>
          <div className="space-y-4">
            {VARIANTS.map(({ key, label }) => (
              <div key={key} className="flex flex-wrap items-center gap-3">
                <RowLabel>{label}</RowLabel>
                <Button variant={key} size="lg">
                  Button
                </Button>
                <Button
                  variant={key}
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="left"
                >
                  Icon Left
                </Button>
                <Button
                  variant={key}
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Icon Right
                </Button>
                <Button
                  variant={key}
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="only"
                  aria-label={label}
                />
                <Button variant={key} size="lg" disabled>
                  Disabled
                </Button>
              </div>
            ))}
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="button-loading">
        <AccordionTrigger>Button — loading (L)</AccordionTrigger>
        <AccordionPanel>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" isLoading={loading}>
              Submit
            </Button>
            <Button
              variant="secondary-white"
              size="sm"
              onClick={() => setLoading((v) => !v)}
            >
              Toggle loading
            </Button>
            {VARIANTS.map(({ key, label }) => (
              <Button
                key={key}
                variant={key}
                size="lg"
                isLoading
                iconPosition="only"
                aria-label={`Загрузка: ${label}`}
              />
            ))}
          </div>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="button-sizes">
        <AccordionTrigger>Button — размеры (S / M / L)</AccordionTrigger>
        <AccordionPanel>
          <div className="space-y-4">
            {VARIANTS.map(({ key, label }) => (
              <div key={key} className="flex flex-wrap items-center gap-3">
                <RowLabel>{label}</RowLabel>
                {SIZES.map(({ key: sizeKey, label: sizeLabel }) => (
                  <Button key={sizeKey} variant={key} size={sizeKey}>
                    Button {sizeLabel}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Начиная с 768px (<code>md:</code>) M и L дополнительно
            увеличиваются в размерах (mobile-first, десктопная форма
            подключается на md:).
          </p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="button-secondary-logo">
        <AccordionTrigger>Button — Secondary Logo (Госуслуги)</AccordionTrigger>
        <AccordionPanel>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary-logo-black" size="lg">
              Войти через Госуслуги
            </Button>
            <Button variant="secondary-logo-border-white" size="lg">
              Войти через Госуслуги
            </Button>
            <Button variant="secondary-logo-white" size="lg">
              Войти через Госуслуги
            </Button>
            <Button variant="secondary-logo-grey" size="lg">
              Войти через Госуслуги
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Фиксированный значок Госуслуг (упрощённая аппроксимация — см.
            комментарий в <code>gosuslugi-logo.tsx</code>, тот же подход, что
            и у платёжных логотипов в Thumbnail) — не заменяется пропом{" "}
            <code>icon</code>. Black/Border-White/White переиспользуют цвета
            secondary-black/-outline/-white один в один (сверено попиксельно
            со спеком); Grey — единственный новый цвет.
          </p>
        </AccordionPanel>
      </AccordionItem>
    </>
  )
}

export { ButtonDemo }
