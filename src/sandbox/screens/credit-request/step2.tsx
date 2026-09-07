import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ButtonMenu, ButtonMenuOverflow, ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import {
  FileListItem,
  FileUploadDropzone,
  buildFileUploadSubtitle,
} from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/progress-bar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TitleCard } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import {
  SandboxBlock,
  SandboxColumns,
  SandboxFieldRow,
  SandboxPage,
  SandboxSection,
} from "../../shell"

import { PredecessorsSection } from "./predecessors"
import { CreditProductSummary } from "./summary"
import { SEEDED_FILES, SEEDED_PREDECESSOR, type Predecessor } from "./data"

// D4. «Подача заявки на кредит», шаг 2 — эталоны 70371:24608 (пусто),
// 70371:24650 (файлы приложены), 70371:24684 (ошибки).
//
// Это ОДИН экран в трёх состояниях, поэтому и история одна, с переключателем
// (`state` в контролах). Шаг 3 — отдельная страница каталога, а не состояние
// этой: «переход через контрол даёт ложное ощущение взаимосвязи экранов,
// хотя логика между ними не провязана и не должна быть».
//
// Состояния при этом достижимы и руками, а не только контролом: раздел
// «Правопредшественники» появляется, когда в селекте выбрано «Да», файлы —
// когда их загрузили, ошибки — когда нажали «Далее» с незаполненными
// обязательными полями. Контрол только задаёт стартовую точку.
//
// «Далее» проверяет форму и никуда не уводит, «Назад» нарисована, но не
// нажимается — обе так и заданы документом.

type Step2State = "empty" | "files" | "errors"

interface CreditRequestStep2Props {
  /** Стартовое состояние экрана — три эталонных кадра. */
  state?: Step2State
}

const SUBTITLE = buildFileUploadSubtitle({
  maxFiles: "unlimited",
  formats: ["TXT"],
  maxFileSizeMb: 200,
})

function CreditRequestStep2({ state = "files" }: CreditRequestStep2Props) {
  const toast = useToast()

  // В состоянии «ошибки» обязательные поля ПУСТЫ — иначе подсвечивать было
  // бы нечего, и кадр эталона с красными полями не воспроизводился бы. В
  // «пусто» они тоже пусты, но там ошибки ещё не показаны: пользователь
  // просто не нажимал «Далее».
  const seeded = state === "files"
  const [site, setSite] = useState(seeded ? "https://kpgreenwood.ru/" : "")
  const [portalId, setPortalId] = useState(seeded ? "432156" : "")
  const [successor, setSuccessor] = useState<string | null>(
    state === "empty" ? null : "yes"
  )
  const [predecessors, setPredecessors] = useState<Predecessor[]>(
    state === "empty" ? [] : [SEEDED_PREDECESSOR]
  )
  const [files, setFiles] = useState(state === "files" ? SEEDED_FILES : [])
  const [showErrors, setShowErrors] = useState(state === "errors")

  const missingSite = showErrors && !site.trim()
  const missingPortalId = showErrors && !portalId.trim()
  const missingFiles = showErrors && files.length === 0

  function updatePredecessor(id: string, patch: Partial<Predecessor>) {
    setPredecessors((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  function submit() {
    const invalid = !site.trim() || !portalId.trim() || files.length === 0
    setShowErrors(invalid)
    toast.add(
      invalid
        ? {
            type: "error",
            title: "Заполните обязательные поля",
            description: "Шаг 2 из 5 — информация о деятельности заёмщика",
          }
        : {
            type: "checked",
            title: "Шаг 2 пройден",
            description: "Данные сохранены",
          }
    )
  }

  return (
    <SandboxPage
      activeSection="credit-agreements"
      title={
        <TitleCard
          title="Заявка на кредит №2781"
          helpLabel={null}
          onBack={() => {}}
          tag="Черновик"
          tagColor="grey"
        />
      }
      additional={
        <ProgressBar
          title="Шаг 2 из 5"
          description="Информация о деятельности заёмщика"
          totalSteps={5}
          currentStep={2}
          showStatus={false}
        />
      }
      bottomBar={
        <ButtonMenu>
          <Button variant="primary" onClick={submit}>
            Далее
          </Button>
          <Button variant="secondary-grey">Сохранить</Button>
          <Button variant="secondary-grey">Отмена</Button>
          <ButtonMenuOverflow>
            <ButtonMenuOverflowItem text="Удалить заявку" />
            <ButtonMenuOverflowItem text="Скачать черновик" />
          </ButtonMenuOverflow>
        </ButtonMenu>
      }
    >
      <SandboxColumns widths={[7, 5]}>
        <div className="flex flex-col gap-6">
          <SandboxBlock>
            <SandboxSection title="Информация о деятельности заёмщика">
              <SandboxFieldRow>
                <Input
                  label="Сайт организации"
                  value={site}
                  onChange={(event) => setSite(event.target.value)}
                  clearable
                  onClear={() => setSite("")}
                  error={missingSite ? "Укажите сайт организации" : undefined}
                />
                <Input
                  label="ID на портале строим.дом.рф"
                  value={portalId}
                  onChange={(event) => setPortalId(event.target.value)}
                  clearable
                  onClear={() => setPortalId("")}
                  error={missingPortalId ? "Укажите ID на портале" : undefined}
                />
              </SandboxFieldRow>

              <SandboxFieldRow>
                <Select
                  items={[
                    { value: "yes", label: "Да" },
                    { value: "no", label: "Нет" },
                  ]}
                  value={successor}
                  onValueChange={(next) => {
                    setSuccessor(next)
                    // Раздел появляется и исчезает вместе с ответом — иначе
                    // «Нет» оставляло бы на экране заполненных
                    // правопредшественников, которых по данным нет.
                    setPredecessors(next === "yes" ? [SEEDED_PREDECESSOR] : [])
                  }}
                >
                  <SelectTrigger
                    clearable={false}
                    label="Заёмщик является правопреемником"
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Да</SelectItem>
                    <SelectItem value="no">Нет</SelectItem>
                  </SelectContent>
                </Select>
                <span />
              </SandboxFieldRow>
            </SandboxSection>

            {successor === "yes" && (
              <PredecessorsSection
                items={predecessors}
                onChange={updatePredecessor}
                onRemove={(id) =>
                  setPredecessors((prev) => prev.filter((row) => row.id !== id))
                }
                onAdd={() =>
                  setPredecessors((prev) => [
                    ...prev,
                    {
                      id: `p${prev.length + 1}`,
                      fullName: "",
                      shortName: "",
                      ogrn: "",
                    },
                  ])
                }
              />
            )}

            <SandboxSection title="Расширенная выписка по расчётному счёту">
              <FileUploadDropzone
                multiple
                accept=".txt"
                subtitle={SUBTITLE}
                error={missingFiles}
                onFilesSelected={(selected) =>
                  setFiles((prev) => [
                    ...prev,
                    ...Array.from(selected).map((file) => ({
                      id: `${file.name}-${prev.length}`,
                      name: file.name,
                      meta: `${new Date().toLocaleDateString("ru-RU")} - ${Math.round(file.size / 1024)} Кб`,
                    })),
                  ])
                }
              />
              {files.map((file) => (
                <FileListItem
                  key={file.id}
                  name={file.name}
                  meta={file.meta}
                  showCross
                  onRemove={() =>
                    setFiles((prev) => prev.filter((row) => row.id !== file.id))
                  }
                />
              ))}
            </SandboxSection>
          </SandboxBlock>
        </div>

        <CreditProductSummary />
      </SandboxColumns>
    </SandboxPage>
  )
}

export { CreditRequestStep2 }
export type { CreditRequestStep2Props, Step2State }
