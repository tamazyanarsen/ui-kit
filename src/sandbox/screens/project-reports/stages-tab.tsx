import { useState } from "react"

import { Item } from "@/components/ui/item"
import {
  ItemInformationField,
  ItemInformationFieldGroup,
} from "@/components/ui/item-information-field"

import { BarChart, LineChart, THEME_COLORS } from "../../charts"
import {
  SandboxBlock,
  SandboxSection,
  SandboxSelect,
  millions,
} from "../../shell"

import { ReportSection } from "./contents"
import {
  ADVANCES,
  QUEUES,
  READINESS,
  RECOMMENDATIONS,
  RESERVES,
  TOP_CONTRACTORS,
} from "./data"

// Вкладка «Очереди строительства» экрана D12 — эталон 70371:25591.
//
// Графики настоящие — `@charts/echarts` (обёртки скопированы в
// `src/sandbox/charts`), а не картинки и не вёрстка: у «Платежей топ-10»
// есть ось, подписи столбцов и стек из двух источников средств, у
// «Стройготовности» — три ряда, ось месяцев и легенда. Всё это канвас
// рисует сам, а вёрстка повторяла бы его руками и разъезжалась на любой
// другой ширине.
//
// Полосы «Авансирования», наоборот, вёрстка: это доли одной строки таблицы,
// а не график, и они обязаны совпадать по сетке с колонками шапки.

const CONTENTS = [
  { id: "report-queue", label: "Выбор очереди строительства" },
  { id: "report-advances", label: "Авансирование" },
  { id: "report-payments", label: "Платежи топ-10 контрагентам" },
  { id: "report-reserves", label: "Резервы" },
  { id: "report-readiness", label: "Стройготовность" },
  { id: "report-recommendations", label: "Рекомендации комиссии" },
]

function StagesTab() {
  const [queue, setQueue] = useState<string | null>(QUEUES[0]!.value)

  const advanceMax = Math.max(...ADVANCES.map((row) => row.total))
  const totals = ADVANCES.reduce(
    (sum, row) => ({
      total: sum.total + row.total,
      worked: sum.worked + row.worked,
      unworked: sum.unworked + row.unworked,
    }),
    { total: 0, worked: 0, unworked: 0 }
  )

  return (
    <div className="flex flex-col gap-6">
      <ReportSection id="report-queue">
        <SandboxBlock>
          <SandboxSection title="Выбор очереди строительства" gap={16}>
            <div className="max-w-[520px]">
              <SandboxSelect
                label="Очередь"
                items={QUEUES}
                value={queue}
                onValueChange={setQueue}
                comment="Вся информация раздела — по выбранной очереди"
              />
            </div>
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-advances">
        <SandboxBlock>
          <SandboxSection title="Авансирование" gap={16}>
            <p className="text-p3-medium text-[var(--grey-284)]">
              На текущую дату
            </p>
            <table className="w-full text-left">
              <thead>
                <tr className="text-p3-medium text-[var(--grey-284)]">
                  <th className="w-[240px] py-2 font-medium">Тип контрагента</th>
                  <th className="py-2 font-medium">Всего  авансы</th>
                  <th className="py-2 font-medium">Отработанные</th>
                  <th className="py-2 font-medium">Неотработанные</th>
                </tr>
              </thead>
              <tbody>
                {ADVANCES.map((row) => (
                  <tr key={row.id} className="border-t border-[var(--divider)]">
                    <td className="py-4 text-p2-medium text-[var(--grey-1514)]">
                      {row.kind}
                    </td>
                    <AdvanceCell value={row.total} max={advanceMax} />
                    <AdvanceCell value={row.worked} max={advanceMax} />
                    <AdvanceCell value={row.unworked} max={advanceMax} />
                  </tr>
                ))}
                <tr className="border-t border-[var(--divider)]">
                  <td className="py-4 text-p2-medium text-[var(--grey-1514)]">
                    Всего
                  </td>
                  <td className="py-4 text-p2-medium text-[var(--grey-1514)]">
                    {millions(totals.total)}
                  </td>
                  <td className="py-4 text-p2-medium text-[var(--grey-1514)]">
                    {millions(totals.worked)}
                  </td>
                  <td className="py-4 text-p2-medium text-[var(--grey-1514)]">
                    {millions(totals.unworked)}
                  </td>
                </tr>
              </tbody>
            </table>
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-payments">
        <SandboxBlock>
          <SandboxSection title="Платежи топ-10 контрагентам, млн ₽" gap={16}>
            <p className="text-p3-medium text-[var(--grey-284)]">
              На текущую дату
            </p>
            <BarChart
              horizontal
              height={360}
              xData={TOP_CONTRACTORS.names}
              series={[
                {
                  name: "Собственные средства, млн ₽",
                  data: TOP_CONTRACTORS.own,
                  stack: "payments",
                },
                {
                  name: "Заёмные средства, млн ₽",
                  data: TOP_CONTRACTORS.borrowed,
                  stack: "payments",
                },
              ]}
            />
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-reserves">
        <SandboxBlock>
          <SandboxSection title="Резервы" gap={16}>
            <p className="text-p3-medium text-[var(--grey-284)]">
              На текущую дату
            </p>
            <ItemInformationFieldGroup>
              {RESERVES.map((reserve) => (
                <ItemInformationField
                  key={reserve.label}
                  label={reserve.label}
                  value={reserve.value}
                  divider
                />
              ))}
            </ItemInformationFieldGroup>
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-readiness">
        <SandboxBlock>
          <SandboxSection title="Стройготовность" gap={16}>
            <LineChart
              height={360}
              xData={READINESS.months}
              series={[
                { name: "План, %", data: READINESS.plan, smooth: false },
                { name: "Выездная проверка, %", data: READINESS.survey, smooth: false },
                { name: "По актам, %", data: READINESS.acts, smooth: false },
              ]}
            />
            <ItemInformationFieldGroup>
              {READINESS.totals.map((row) => (
                <ItemInformationField
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  subText={row.percent}
                  divider
                />
              ))}
            </ItemInformationFieldGroup>
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>

      <ReportSection id="report-recommendations">
        <SandboxBlock>
          <SandboxSection title="Рекомендации комиссии" gap={0}>
            {RECOMMENDATIONS.map((row) => (
              <Item
                key={row.id}
                value={row.value}
                text={row.text}
                rightElement="navigation"
                divider
                onClick={() => {}}
              />
            ))}
          </SandboxSection>
        </SandboxBlock>
      </ReportSection>
    </div>
  )
}

/** Ячейка «Авансирования»: полоса доли плюс число под ней. */
function AdvanceCell({ value, max }: { value: number; max: number }) {
  return (
    <td className="py-4">
      <div className="flex flex-col gap-1">
        <div className="h-4 w-full">
          {value > 0 && (
            <div
              className="flex h-full items-center justify-center rounded-[2px] px-2 text-p3-medium text-[var(--grey-1514)]"
              style={{
                width: `${Math.max((value / max) * 100, 12)}%`,
                backgroundColor: THEME_COLORS.blue,
              }}
            >
              {millions(value)}
            </div>
          )}
        </div>
        {value === 0 && (
          <span className="text-p2-medium text-[var(--grey-1514)]">
            {millions(value)}
          </span>
        )}
      </div>
    </td>
  )
}

export { CONTENTS as STAGES_CONTENTS, StagesTab }
