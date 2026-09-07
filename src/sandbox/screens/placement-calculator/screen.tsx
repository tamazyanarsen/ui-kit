import { useMemo, useState } from "react"

import { EmptySearchResults } from "@/components/ui/empty-search"
import { ProgressBar } from "@/components/ui/progress-bar"
import { RangeInput } from "@/components/ui/range-input"
import { TitleCard } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import {
  SandboxBlock,
  SandboxChipsToggle,
  SandboxColumns,
  SandboxPage,
  SandboxSection,
  SandboxSelect,
  money,
} from "../../shell"
import { PLACEMENT_HINTS } from "../section-hints/hints"
import { SectionHintsModal } from "../section-hints/hints-modal"

import { OfferCard } from "./offer-card"
import {
  INDIVIDUAL_OFFERS,
  INTEREST_PAYOUTS,
  MAIN_OFFERS,
  type ProductKind,
} from "./data"

// D3. «Калькулятор размещения средств» — эталоны 70371:25033 («Основные
// предложения») и 70371:25240 («Индивидуальные предложения»).
//
// Одна песочница на две вкладки: это один экран, а не два — вкладка меняет
// НАБОР предложений, а левая колонка условий у них общая.
//
// Кнопка «Справка» открывает окно подсказок РАЗДЕЛА (D9) — тот же модуль,
// что и на деталке заявки: подсказки принадлежат разделу, а не документу, и
// своей копии у экрана нет.
//
// Ползунки считают доход по-настоящему: сумма × ставка × срок / 365. У
// одобренных предложений сумма и срок свои — банк их уже утвердил, и
// калькулятор их не двигает.

const MIN_AMOUNT = 50_000
const MAX_AMOUNT = 100_000_000

function PlacementCalculatorScreen() {
  const toast = useToast()

  const [scope, setScope] = useState<"individual" | "main">("main")
  const [kind, setKind] = useState<ProductKind | "all">("all")
  const [amount, setAmount] = useState(1_000_000)
  const [days, setDays] = useState(365)
  const [payout, setPayout] = useState<string | null>("end")
  const [hintsOpen, setHintsOpen] = useState(false)

  const offers = useMemo(() => {
    const list = scope === "main" ? MAIN_OFFERS : INDIVIDUAL_OFFERS
    return kind === "all" ? list : list.filter((offer) => offer.kind === kind)
  }, [kind, scope])

  return (
    <SandboxPage
      activeSection="placement"
      title={
        <TitleCard
          title="Размещение средств"
          onBack={() => {}}
          onHelp={() => setHintsOpen(true)}
        />
      }
      additional={
        <ProgressBar
          title="Шаг 1 из 2"
          description="Подбор продукта"
          totalSteps={2}
          currentStep={1}
          showStatus={false}
        />
      }
    >
      <SandboxColumns widths={[4, 8]}>
        <SandboxBlock>
          <SandboxSection title="Выбор условий" gap={16}>
            <div className="flex flex-wrap gap-2">
              <SandboxChipsToggle
                selected={scope === "individual"}
                onSelect={() => setScope("individual")}
              >
                Индивидуальные предложения
              </SandboxChipsToggle>
              <SandboxChipsToggle
                selected={scope === "main"}
                onSelect={() => setScope("main")}
              >
                Основные предложения
              </SandboxChipsToggle>
            </div>
          </SandboxSection>

          <SandboxSection title="Тип продукта" gap={16}>
            <div className="flex flex-wrap gap-2">
              <SandboxChipsToggle
                selected={kind === "all"}
                onSelect={() => setKind("all")}
              >
                Все
              </SandboxChipsToggle>
              <SandboxChipsToggle
                selected={kind === "nso"}
                onSelect={() => setKind("nso")}
              >
                НСО
              </SandboxChipsToggle>
              <SandboxChipsToggle
                selected={kind === "deposit"}
                onSelect={() => setKind("deposit")}
              >
                Депозит
              </SandboxChipsToggle>
            </div>
          </SandboxSection>

          <SandboxSection title="Параметры продукта" gap={16}>
            <RangeInput
              label="Сумма"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={50_000}
              value={amount}
              onValueChange={(next) => setAmount(next as number)}
              /* Правая подпись шкалы «∞» — с эталона: верхняя граница суммы
                 продуктом не ограничена, а ползунку конец всё равно нужен. */
              scaleLabels={["50 000", "∞"]}
              format={{ maximumFractionDigits: 0 }}
            />
            <RangeInput
              label="Срок, дней"
              min={1}
              max={1095}
              value={days}
              onValueChange={(next) => setDays(next as number)}
              scaleLabels={["1", "1 095"]}
            />
            <SandboxSelect
              label="Выплата процентов"
              items={INTEREST_PAYOUTS}
              value={payout}
              onValueChange={setPayout}
            />
          </SandboxSection>
        </SandboxBlock>

        <SandboxBlock>
          {offers.length === 0 ? (
            <EmptySearchResults
              title="Предложений нет"
              description="Измените тип продукта или посмотрите основные предложения"
              showButton
              buttonLabel="Основные предложения"
              onButtonClick={() => {
                setScope("main")
                setKind("all")
              }}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  amount={amount}
                  days={days}
                  onSelect={(selected) =>
                    toast.add({
                      type: "checked",
                      title: `Выбран продукт «${selected.title}»`,
                      description: `${money(amount)} на ${days} дней`,
                    })
                  }
                />
              ))}
            </div>
          )}
        </SandboxBlock>
      </SandboxColumns>

      <SectionHintsModal
        title="Заявка на размещение средств"
        hints={PLACEMENT_HINTS}
        open={hintsOpen}
        onOpenChange={setHintsOpen}
      />
    </SandboxPage>
  )
}

export { PlacementCalculatorScreen }
