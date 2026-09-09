import { ExternalLink } from "@/icons"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { ItemInformationField } from "@/components/ui/item-information-field"

import { THEME_COLORS } from "../../charts"
import {
  SandboxBlock,
  SandboxCompositionBar,
  SandboxFieldRow,
  SandboxSection,
  integer,
  millions,
  money,
  percent,
} from "../../shell"

import { ReportSection } from "./contents"
import { ReportMetric } from "./metric"
import {
  ADVANCE_METRIC,
  ESCROW_METRIC,
  EXECUTION_METRIC,
  FINANCING,
  PROJECT,
  SALES,
  STAGE_METRICS,
} from "./data"

// Вкладка «Общая информация» экрана D12 — эталон 70371:25361.
//
// ⚠️ Цвет источников средств сведён к ОДНОМУ на весь экран: в эталоне один
// блок рисует голубым заёмные, а другой тем же голубым — собственные.
// Расхождение эталона с самим собой, разрешённое на сборке в пользу
// единого правила: заёмные — голубые, собственные — лавандовые.

// Цвета берём из темы графиков (`domrf`), а не заводим свои токены: полосы
// состава и настоящие графики соседней вкладки обязаны говорить одним
// языком, иначе «заёмные» будут разного цвета на двух вкладках одного
// отчёта.
const BORROWED = THEME_COLORS.blue
const OWN = THEME_COLORS.lavender
const PROCESSING = THEME_COLORS.grey

const CONTENTS = [
  { id: "report-project", label: "Сведения о проекте" },
  { id: "report-financing", label: "Финансирование проекта" },
  { id: "report-stage", label: "Текущая стадия реализации проекта" },
  { id: "report-sales", label: "Продажи" },
]

function GeneralTab() {
  return (
    <div className="flex flex-col gap-6">
      <ReportSection id="report-project">
        <SandboxBlock>
          <SandboxSection title="Сведения о проекте" gap={16}>
            <SandboxFieldRow>
              <div className="flex flex-col gap-4">
                <ItemInformationField type="label-top" label="Регион" value={PROJECT.region} />
                <ItemInformationField type="label-top" label="Город" value={PROJECT.city} />
                <ItemInformationField type="label-top" label="Очередей строительства" value={String(PROJECT.queues)} />
                <ItemInformationField type="label-top" label="Бюджет проекта" value={millions(PROJECT.budget)} />
                <ItemInformationField type="label-top" label="Стоимость строительства" value={millions(PROJECT.buildCost)} />
                <ItemInformationField type="label-top" label="Период строительства" value={PROJECT.buildPeriod} />
              </div>
              <div className="flex flex-col gap-4">
                <ItemInformationField type="label-top" label="Ввод в эксплуатацию" value={PROJECT.commissioning} />
                <ItemInformationField type="label-top" label="Общая площадь" value={`${integer(PROJECT.totalArea)} м²`} />
                <ItemInformationField type="label-top" label="Жилая площадь" value={`${integer(PROJECT.livingArea)} м²`} />
                <ItemInformationField type="label-top" label="Нежилая площадь" value={`${integer(PROJECT.nonLivingArea)} м²`} />
                <ItemInformationField type="label-top" label="Количество машиномест" value={String(PROJECT.parkingSpaces)} />
              </div>
            </SandboxFieldRow>
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-financing">
        <SandboxBlock>
          <SandboxSection
            title="Финансирование проекта"
            gap={16}
            action={
              <Button
                variant="secondary-grey"
                size="sm"
                icon={ExternalLink}
                iconPosition="right"
              >
                Подробнее в ССР
              </Button>
            }
          >
            <p className="text-p3-medium text-[var(--grey-284)]">
              Блок обновляется в реальном времени
            </p>
            <ItemInformationField
              type="label-top"
              label="Застройщик"
              value={FINANCING.developer}
            />
            <SandboxFieldRow>
              <ItemInformationField
                type="label-top"
                label="Аванс от кредитной линии"
                value={percent(FINANCING.advanceRate)}
              />
              <ItemInformationField
                type="label-top"
                label="Лимит авансирования"
                value={money(FINANCING.advanceLimit)}
              />
            </SandboxFieldRow>

            <Divider />
            <FinancingBar
              title={`Сметная стоимость — ${money(FINANCING.estimate.total)}`}
              total={FINANCING.estimate.total}
              parts={[
                { label: "Заёмные", value: FINANCING.estimate.borrowed, color: BORROWED },
                { label: "Собственные", value: FINANCING.estimate.own, color: OWN },
              ]}
            />

            <Divider />
            <FinancingBar
              title={`Оплачено — ${money(FINANCING.paid.total)}`}
              total={FINANCING.paid.total}
              parts={[
                { label: "Заёмные", value: FINANCING.paid.borrowed, color: BORROWED },
                { label: "Собственные", value: FINANCING.paid.own, color: OWN },
                { label: "В обработке", value: FINANCING.paid.processing, color: PROCESSING },
              ]}
            />

            <Divider />
            <FinancingBar
              title={`Доступный лимит — ${money(FINANCING.available.total)}`}
              total={FINANCING.available.total}
              parts={[
                { label: "Заёмные", value: FINANCING.available.borrowed, color: BORROWED },
                { label: "Собственные", value: FINANCING.available.own, color: OWN },
              ]}
            />
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-stage">
        <SandboxBlock>
          <SandboxSection title="Текущая стадия реализации проекта" gap={16}>
            <SandboxFieldRow>
              <div className="flex flex-col gap-4">
                {STAGE_METRICS.map((metric) => (
                  <ReportMetric key={metric.title} {...metric} />
                ))}
              </div>
              <ReportMetric {...ESCROW_METRIC} />
            </SandboxFieldRow>
          </SandboxSection>

          <Divider />

          <SandboxSection title="Выполнение" gap={16}>
            <ReportMetric {...EXECUTION_METRIC} />
          </SandboxSection>

          <Divider />

          <SandboxSection title="Неотработанные авансы" gap={16}>
            <ReportMetric {...ADVANCE_METRIC} />
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-sales">
        <SandboxBlock>
          <SandboxSection title="Продажи" gap={16}>
            <table className="w-full text-left">
              <thead>
                <tr className="text-p3-medium text-[var(--grey-284)]">
                  <th className="py-2 font-medium">Показатель</th>
                  <th className="py-2 font-medium">Продано</th>
                  <th className="py-2 font-medium">На сумму</th>
                  <th className="py-2 font-medium">Средняя цена</th>
                </tr>
              </thead>
              <tbody>
                {SALES.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-[var(--divider)] align-top"
                  >
                    <td className="py-4 text-p2-medium text-[var(--grey-1514)]">
                      {row.metric}
                    </td>
                    <td className="py-4">
                      <span className="block text-p2-medium text-[var(--grey-1514)]">
                        {row.sold}
                      </span>
                      <span className="block text-p3-medium text-[var(--grey-284)]">
                        {row.soldPlan}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="block text-p2-medium text-[var(--grey-1514)]">
                        {row.amount}
                      </span>
                      <span className="block text-p3-medium text-[var(--grey-284)]">
                        {row.amountPlan}
                      </span>
                    </td>
                    <td className="py-4 text-p2-medium text-[var(--grey-1514)]">
                      {row.averagePrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>
    </div>
  )
}

function FinancingBar({
  title,
  total,
  parts,
}: {
  title: string
  total: number
  parts: { label: string; value: number; color: string }[]
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <span className="text-p2-medium text-[var(--grey-1514)]">{title}</span>
      <SandboxCompositionBar
        segments={parts.map((part) => ({
          label: `${part.label} ${Math.round((part.value / total) * 100)}% (${money(part.value)})`,
          value: part.value,
          color: part.color,
        }))}
      />
    </div>
  )
}

export { CONTENTS as GENERAL_CONTENTS, GeneralTab }
