import { useState } from "react"

import { Plus } from "@/icons"
import { Button } from "@/components/ui/button"
import { ButtonMenu, ButtonMenuOverflow, ButtonMenuOverflowItem } from "@/components/ui/button-menu"
import { DatePicker } from "@/components/ui/date-picker"
import {
  FileUploadDropzone,
  buildFileUploadSubtitle,
} from "@/components/ui/file-upload"
import { Informer } from "@/components/ui/informer"
import { Input } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/progress-bar"
import { RangeInput } from "@/components/ui/range-input"
import { TitleCard } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import {
  SandboxBlock,
  SandboxColumns,
  SandboxFieldRow,
  SandboxPage,
  SandboxSection,
  SandboxSelect,
} from "../../shell"

import { CreditProductSummary } from "./summary"
import { CITIZENSHIPS, DOCUMENT_TYPES, YES_NO } from "./data"

// D4, шаг 3 — «Персональные данные ЕИО», эталон 70371:24755 (высота 2554).
//
// Отдельная страница каталога, а не состояние шага 2: логика между шагами не
// провязана и провязываться не должна.
//
// Числа шага сошлись с эталоном: колонки 1040 + 24 + 736 (пролёты 7 и 5),
// ряд полей 476 + 24 + 476 = 976, ползунок 476, полоса действий 1800 × 88.

const SCAN_SUBTITLE = buildFileUploadSubtitle({
  maxFiles: "unlimited",
  formats: ["DOC", "DOCX", "PDF", "XLS", "XSLSX", "P7", "SGN", "SIG", "SIGN"],
  maxFileSizeMb: 200,
})

function CreditRequestStep3() {
  const toast = useToast()

  const [share, setShare] = useState(50)
  const [founder, setFounder] = useState<string | null>("yes")
  const [livesAtRegistration, setLivesAtRegistration] = useState<string | null>(
    "no"
  )
  const [citizenship, setCitizenship] = useState<string | null>("ru")
  const [documentType, setDocumentType] = useState<string | null>("charter")
  const [guarantors, setGuarantors] = useState<string | null>(null)

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
          title="Шаг 3 из 5"
          description="Участники сделки"
          totalSteps={5}
          currentStep={3}
          showStatus={false}
        />
      }
      bottomBar={
        <ButtonMenu>
          <Button
            variant="primary"
            onClick={() =>
              toast.add({
                type: "checked",
                title: "Шаг 3 пройден",
                description: "Данные ЕИО сохранены",
              })
            }
          >
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
            <SandboxSection title="Персональные данные ЕИО">
              <Informer
                solid="grey"
                icon="information"
                title="Заполните сведения о единоличном исполнительном органе юридического лица"
                showCross={false}
              />
              <SandboxFieldRow>
                <Input label="ФИО" defaultValue="Петров Игорь Сергеевич" clearable />
                <DatePicker label="Дата рождения" value={new Date(2022, 8, 12)} />
              </SandboxFieldRow>
              <SandboxFieldRow>
                <Input
                  label="Место рождения"
                  defaultValue="г. Клин Московской обл."
                  clearable
                />
                <SandboxSelect
                  label="Гражданство"
                  items={CITIZENSHIPS}
                  value={citizenship}
                  onValueChange={setCitizenship}
                />
              </SandboxFieldRow>
              <SandboxFieldRow>
                <Input
                  label="Адрес постоянной регистрации"
                  defaultValue="Московская область, г. Клин, ул. Пролетарская, д. 8, кв. 41"
                  clearable
                />
                <SandboxSelect
                  label="Проживает по адресу регистрации"
                  items={YES_NO}
                  value={livesAtRegistration}
                  onValueChange={setLivesAtRegistration}
                />
              </SandboxFieldRow>
              {/* Адрес проживания спрашивается только тогда, когда он может
                  отличаться от адреса регистрации. */}
              {livesAtRegistration === "no" && (
                <SandboxFieldRow>
                  <Input
                    label="Адрес проживания"
                    defaultValue="Московская область, г. Клин, ул. Советская, д. 10"
                    clearable
                  />
                  <span />
                </SandboxFieldRow>
              )}
              <SandboxFieldRow>
                <Input label="Должность" defaultValue="Генеральный директор" clearable />
                <Input label="ИНН" mask="inn" defaultValue="123456789012" clearable />
              </SandboxFieldRow>
              <SandboxFieldRow>
                <Input label="Мобильный телефон" mask="phone" defaultValue="+7 927 890-32-11" clearable />
                <Input label="Домашний телефон (при наличии)" defaultValue="+7 123 456-78-90" clearable />
              </SandboxFieldRow>
              <SandboxFieldRow>
                <Input label="E-mail" type="email" defaultValue="petrovis@mail.ru" clearable />
                <span />
              </SandboxFieldRow>
            </SandboxSection>
          </SandboxBlock>

          <SandboxBlock>
            <SandboxSection title="Документ-основание">
              <SandboxFieldRow>
                <SandboxSelect
                  label="Тип"
                  items={DOCUMENT_TYPES}
                  value={documentType}
                  onValueChange={setDocumentType}
                />
                <Input label="Номер" />
              </SandboxFieldRow>
              <SandboxFieldRow>
                <DatePicker label="Дата документа" />
                <span />
              </SandboxFieldRow>
            </SandboxSection>

            <SandboxSection title="Сведения о доле участия">
              <SandboxFieldRow>
                <SandboxSelect
                  label="ЕИО является учредителем"
                  items={YES_NO}
                  value={founder}
                  onValueChange={setFounder}
                />
                {founder === "yes" ? (
                  <RangeInput
                    label="Доля ЕИО в уставном капитале"
                    min={0}
                    max={100}
                    value={share}
                    onValueChange={(next) => setShare(next as number)}
                    scaleLabels={["0%", "100%"]}
                    /* `style: "unit"`, а НЕ `style: "percent"`: последний
                       умножает значение на 100, и доля 50 печаталась бы как
                       «5 000 %». Значение здесь уже в процентах. */
                    format={{ style: "unit", unit: "percent" }}
                  />
                ) : (
                  <span />
                )}
              </SandboxFieldRow>
              <SandboxFieldRow>
                <SandboxSelect
                  label="Есть поручители/учредители, отличные от ЕИО"
                  items={YES_NO}
                  value={guarantors}
                  onValueChange={setGuarantors}
                  placeholder=" "
                />
                <span />
              </SandboxFieldRow>
            </SandboxSection>
          </SandboxBlock>

          <SandboxBlock>
            <SandboxSection title="Данные паспорта">
              <SandboxFieldRow>
                <Input label="Серия и номер" mask="passport" />
                <DatePicker label="Дата выдачи" />
              </SandboxFieldRow>
              <SandboxFieldRow columns={1}>
                <Input label="Кем выдан" />
              </SandboxFieldRow>
              <SandboxFieldRow>
                <Input label="Код подразделения" />
                <span />
              </SandboxFieldRow>
            </SandboxSection>

            <SandboxSection title="Скан-копия паспорта">
              <FileUploadDropzone multiple subtitle={SCAN_SUBTITLE} />
            </SandboxSection>

            <SandboxSection title="Ранее выданные паспорта">
              <Informer
                solid="grey"
                icon="information"
                title="Укажите ранее выданные паспорта, сведения о которых содержатся в текущем паспорте (при наличии)"
                showCross={false}
              />
              <div>
                <Button
                  variant="secondary-grey"
                  size="sm"
                  icon={Plus}
                  iconPosition="left"
                >
                  Добавить
                </Button>
              </div>
            </SandboxSection>
          </SandboxBlock>
        </div>

        <CreditProductSummary />
      </SandboxColumns>
    </SandboxPage>
  )
}

export { CreditRequestStep3 }
