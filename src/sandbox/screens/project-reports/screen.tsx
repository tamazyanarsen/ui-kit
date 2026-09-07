import { useState } from "react"

import { ChevronDown } from "@/icons"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { ItemInformationField } from "@/components/ui/item-information-field"
import { Switcher } from "@/components/ui/switcher"
import { TitleRegistry } from "@/components/ui/title"

import {
  SandboxBlock,
  SandboxColumns,
  SandboxFieldRow,
  SandboxPage,
  SandboxSection,
  SandboxSelect,
} from "../../shell"

import { ReportContents } from "./contents"
import { GENERAL_CONTENTS, GeneralTab } from "./general-tab"
import { STAGES_CONTENTS, StagesTab } from "./stages-tab"
import { PROJECT } from "./data"

// D12. «Отчёты по проектам» — эталоны 70371:25361 («Общая информация») и
// 70371:25591 («Очереди строительства»).
//
// ⚠️ Вкладки экрана переключает `cell switcher` (`Switcher` кита), а НЕ
// компонент `Tabs`: в эталоне это 504 × 56 на белом фоне с обводкой Grey
// 166, радиусом 20 и активной ячейкой Dark blue 1412. Нода штатных вкладок
// в эталоне скрыта — их на экране нет.
//
// ⚠️ Полосы массовых действий у экрана нет вовсе: её нода тоже скрыта.
// Скрытые ноды видны только в метаданных, поэтому и то и другое легко было
// бы собрать по ошибке.
//
// Реквизиты отчёта — информационные поля 976 × 24 и 976 × 44, то есть тип
// `Line`: без своего поля и без разделителя, интервал задаёт контейнер.

function ProjectReportsScreen() {
  const [tab, setTab] = useState("general")
  const [project, setProject] = useState<string | null>("paveletskaya")
  const [from, setFrom] = useState<Date | null>(new Date(2025, 4, 1))
  const [to, setTo] = useState<Date | null>(new Date(2026, 4, 1))

  const contents = tab === "general" ? GENERAL_CONTENTS : STAGES_CONTENTS

  return (
    <SandboxPage
      activeSection="deal-monitoring"
      title={<TitleRegistry title="Отчёты по проектам" helpLabel={null} />}
    >
      <SandboxColumns widths={[5, 7]}>
        <SandboxBlock>
          <SandboxSection title="Настройка отчёта" gap={16}>
            <SandboxSelect
              label="Проект"
              items={[
                { value: "paveletskaya", label: PROJECT.name },
                { value: "bolshevichka", label: 'ЖК "Большевичка"' },
              ]}
              value={project}
              onValueChange={setProject}
            />
            <SandboxFieldRow>
              <DatePicker label="Начало периода" value={from} onChange={setFrom} />
              <DatePicker label="Конец периода" value={to} onChange={setTo} />
            </SandboxFieldRow>
          </SandboxSection>
        </SandboxBlock>

        <SandboxBlock>
          <SandboxSection
            title={PROJECT.name}
            gap={16}
            action={
              <Button
                variant="secondary-grey"
                size="sm"
                icon={ChevronDown}
                iconPosition="right"
              >
                Скачать отчёт
              </Button>
            }
          >
            <p className="text-p2-medium text-[var(--grey-1514)]">
              Отчёт за период{" "}
              {from?.toLocaleDateString("ru-RU")} — {to?.toLocaleDateString("ru-RU")}
            </p>
            <ItemInformationField
              label="Организация"
              value={PROJECT.organization}
            />
            <ItemInformationField
              label="Данные обновлены"
              value={PROJECT.updatedAt}
              subText="Данные финансирования проекта обновляются в реальном времени"
            />
          </SandboxSection>
        </SandboxBlock>
      </SandboxColumns>

      {/* `cell switcher` на белом фоне — не `Tabs`. */}
      <Switcher
        className="w-fit"
        items={[
          { value: "general", label: "Общая информация" },
          { value: "stages", label: "Очереди строительства" },
        ]}
        value={tab}
        onValueChange={setTab}
        activeVariant="black"
        showMore={false}
      />

      <SandboxColumns widths={[4, 8]}>
        <ReportContents entries={contents} />
        {tab === "general" ? <GeneralTab /> : <StagesTab />}
      </SandboxColumns>
    </SandboxPage>
  )
}

export { ProjectReportsScreen }
