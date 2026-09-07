import { useMemo, useState } from "react"

import { AccordionList, AccordionListItem } from "@/components/ui/accordion-list"
import { Button } from "@/components/ui/button"
import { ButtonMenu } from "@/components/ui/button-menu"
import {
  ItemInformationField,
  ItemInformationFieldGroup,
} from "@/components/ui/item-information-field"
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
  addDays,
  money,
  nextWorkingDay,
  parseAmount,
} from "../../shell"

import { AGREEMENTS, CONTRACTS, ISSUE_DATE, MAX_FIRST, MAX_LAST } from "./data"
import { TrancheAdditionalBlock } from "./additional-block"
import { TrancheParamsBlock } from "./params-block"
import { TrancheSummary } from "./summary"

// D1. «Подача заявки на транш» — инстанс конструктора 70371:24524.
//
// Самый простой из тринадцати и потому первый: он проверяет каркас (поле 60
// при 1920, две колонки 1040 + 24 + 736 = пролёты 7 и 5) и связку
// «ползунок → дата → сводка справа».
//
// Живьём считается всё, что в эталоне нарисовано согласованным: срок в днях
// двигает дату возврата и сводку, сумма транша — полосу состава и подпись
// «Не более…», а отказ от последнего транша перекладывает его лимит в
// первый. Статикой это была бы витрина из трёх картинок, а смысл песочницы
// в том, чтобы компоненты реагировали друг на друга.

function TrancheRequestScreen() {
  const toast = useToast()

  const [contract, setContract] = useState<string | null>(CONTRACTS[0]!.value)
  const [agreement, setAgreement] = useState<string | null>(
    AGREEMENTS[0]!.value
  )
  const [term, setTerm] = useState(14)
  const [kit, setKit] = useState(false)
  const [declineLast, setDeclineLast] = useState(false)
  // Маска `amount` — целые с разрядным пробелом и знаком «₽» отдельным
  // хвостом (scale: 0), поэтому в состоянии живут только цифры. В эталоне у
  // поля нарисовано «30 000 000,00 ₽», но где эталон расходится с китом —
  // прав кит.
  const [amount, setAmount] = useState(String(MAX_FIRST))

  // Отказ от последнего транша складывает оба лимита в первый — иначе на
  // экране остаётся невыбираемый остаток, а полоса состава рисует ложь.
  const limit = declineLast ? MAX_FIRST + MAX_LAST : MAX_FIRST
  const value = parseAmount(amount)
  const tooMuch = value > limit
  // Перенос на рабочий день — не украшение, а подпись под самим полем:
  // «В выходные/праздники дата возврата переносится на следующий рабочий
  // день». В эталоне при сроке 14 нарисовано 27.09.2026 — это воскресенье,
  // то есть эталон своё же правило не применяет; мы применяем.
  const returnDate = useMemo(
    () => nextWorkingDay(addDays(ISSUE_DATE, term)),
    [term]
  )

  const selectedContract = CONTRACTS.find((item) => item.value === contract)

  return (
    <SandboxPage
      activeSection="credit-tranches"
      title={
        <TitleCard
          title="Заявка на выдачу транша"
          helpLabel={null}
          onBack={() => {}}
        />
      }
      additional={
        <ProgressBar
          title="Шаг 1 из 2"
          description="Детали заявки"
          totalSteps={2}
          currentStep={1}
          showStatus={false}
        />
      }
      bottomBar={
        <ButtonMenu>
          <Button
            variant="primary"
            onClick={() =>
              tooMuch
                ? toast.add({
                    type: "attention",
                    title: "Проверьте сумму транша",
                    description: `Не более ${money(limit)}`,
                  })
                : toast.add({
                    type: "checked",
                    title: "Заявка проверена",
                    description: "Шаг 2 из 2 — подписание",
                  })
            }
          >
            Далее
          </Button>
          <Button variant="secondary-grey">Сохранить</Button>
          <Button variant="secondary-grey">Отмена</Button>
        </ButtonMenu>
      }
    >
      <SandboxColumns widths={[7, 5]}>
        <div className="flex flex-col gap-6">
          <SandboxBlock>
            <SandboxSection title="Общая информация">
              <SandboxFieldRow>
                <Select
                  items={CONTRACTS}
                  value={contract}
                  onValueChange={setContract}
                >
                  <SelectTrigger
                    clearable={false}
                    label="Кредитный договор"
                    comment={
                      selectedContract &&
                      `Дата заключения договора: ${selectedContract.signed}`
                    }
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACTS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  items={AGREEMENTS}
                  value={agreement}
                  onValueChange={setAgreement}
                >
                  <SelectTrigger clearable={false} label="Договор подряда">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGREEMENTS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SandboxFieldRow>
            </SandboxSection>

            {/* `ELK / content accordion` — раскрытие без своей карточки:
                блок у него уже есть, вторая рамка внутри была бы лишней. */}
            <AccordionList>
              <AccordionListItem
                title="Информация о договоре подряда"
                titleAs="h3"
              >
                {/* Дизайн-чек от 07.09, замечание 5: у Label Left зазор
                    нулевой — был `gap-4`. */}
                <ItemInformationFieldGroup>
                  <ItemInformationField
                    type="label-left"
                    label="Подрядчик"
                    value="ООО «Северострой»"
                  />
                  <ItemInformationField
                    type="label-left"
                    label="Стоимость работ по договору"
                    value={money(48_000_000)}
                  />
                  <ItemInformationField
                    type="label-left"
                    label="Срок выполнения работ"
                    value="12.09.2022 — 30.09.2026"
                  />
                </ItemInformationFieldGroup>
              </AccordionListItem>
            </AccordionList>
          </SandboxBlock>

          <TrancheParamsBlock
            term={term}
            onTermChange={setTerm}
            returnDate={returnDate}
            kit={kit}
            onKitChange={setKit}
            declineLast={declineLast}
            onDeclineLastChange={setDeclineLast}
            limit={limit}
            amount={amount}
            onAmountChange={setAmount}
            tooMuch={tooMuch}
          />

          <TrancheAdditionalBlock />
        </div>

        <TrancheSummary
          contractLabel={selectedContract?.label}
          agreementLabel={
            AGREEMENTS.find((item) => item.value === agreement)?.label
          }
          amount={Math.min(value, limit)}
          term={term}
          returnDate={returnDate}
        />
      </SandboxColumns>
    </SandboxPage>
  )
}

export { TrancheRequestScreen }
