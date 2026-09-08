import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ButtonMenu } from "@/components/ui/button-menu"
import { DataTable } from "@/components/ui/table"
import { Divider } from "@/components/ui/divider"
import {
  ItemInformationField,
  ItemInformationFieldGroup,
} from "@/components/ui/item-information-field"
import { Tabs } from "@/components/ui/tabs"
import { TitleCard } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import {
  SandboxBlock,
  SandboxColumns,
  SandboxCompositionBar,
  SandboxPage,
  SandboxSection,
  money,
} from "../../shell"

import {
  AGREEMENT_FIELDS,
  CONTRACTOR_AGREEMENTS,
  LINE,
  PAYMENTS,
  PAYMENT_FIELDS,
} from "./data"

// D5. «Кредитный договор 01-001/ИЖС» — инстанс конструктора 70371:24574.
//
// Плотная карточка значений: двенадцать информационных полей, полоса состава
// кредитной линии с легендой, тултип поверх содержимого и тег статуса в
// заголовке. Проверяет плотность значений и то, что подсказка не уезжает под
// соседний блок.
//
// Вкладки переключают содержимое по-настоящему. В эталоне нарисована только
// «О договоре», но вкладка, которая ничего не меняет, читается как дефект —
// а песочница стоит ровно для того, чтобы такое ловить.

function CreditAgreementScreen() {
  const toast = useToast()
  const [tab, setTab] = useState("about")

  return (
    <SandboxPage
      activeSection="credit-agreements"
      title={
        <TitleCard
          title="Кредитный договор 01–001/ИЖС"
          helpLabel={null}
          onBack={() => {}}
          tag="Действующий"
          tagColor="green"
        />
      }
      additional={
        <Tabs
          items={[
            { value: "about", label: "О договоре" },
            { value: "contracts", label: "Договоры подряда" },
            { value: "schedule", label: "График платежей" },
          ]}
          showMore={false}
          value={tab}
          onValueChange={setTab}
        />
      }
      bottomBar={
        <ButtonMenu>
          <Button
            variant="primary"
            onClick={() =>
              toast.add({
                type: "information",
                title: "Заявка на транш",
                description: "Переход на шаг 1 из 2",
              })
            }
          >
            Создать заявку на транш
          </Button>
        </ButtonMenu>
      }
    >
      {tab === "about" && (
        <SandboxColumns widths={[7, 5]}>
          <div className="flex flex-col gap-6">
            <SandboxBlock>
              <SandboxSection
                title="Кредитная линия"
                action={
                  <span className="pt-2 text-p2-regular text-[var(--grey-284)]">
                    Лимит {money(LINE.limit)}
                  </span>
                }
                gap={16}
              >
                <p className="text-p2-regular text-[var(--grey-284)]">
                  Возобновляемая
                </p>
                <SandboxCompositionBar
                  className="pt-4"
                  segments={[
                    {
                      label: `Доступно ${money(LINE.available)}`,
                      value: LINE.available,
                    },
                    {
                      label: `Заморожено ${money(LINE.frozen)}`,
                      value: LINE.frozen,
                    },
                    { label: `Выдано ${money(LINE.issued)}`, value: LINE.issued },
                  ]}
                />
              </SandboxSection>
            </SandboxBlock>

            <SandboxBlock>
              <SandboxSection
                title="Ближайший платёж"
                gap={0}
                action={
                  <Button variant="secondary-grey" size="sm">
                    Подробнее
                  </Button>
                }
              >
                <ItemInformationFieldGroup>
                  <ItemInformationField
                    label="Дата"
                    value="17.07.2027"
                    divider
                  />
                  <ItemInformationField
                    label="Сумма"
                    value={money(5_000_000)}
                    divider
                  />
                </ItemInformationFieldGroup>
              </SandboxSection>
            </SandboxBlock>

            <SandboxBlock>
              <SandboxSection title="Параметры договора" gap={0}>
                <ItemInformationFieldGroup>
                  <ItemInformationField
                    label="Кредитный продукт"
                    value="ИЖС-подряд"
                    divider
                  />
                  <ItemInformationField
                    label="Дата заключения договора"
                    value="05.03.2026"
                    divider
                  />
                  <ItemInformationField
                    label="Дата закрытия договора"
                    value="05.03.2028"
                    divider
                  />
                  <ItemInformationField
                    label="Счёт зачисления"
                    value="40702 810 7 00590062547"
                    subText="Расчётный"
                    copyable
                    divider
                  />
                  <ItemInformationField
                    label="Счёт списания процентов"
                    value="40702 810 7 00590062547"
                    subText="Расчётный"
                    copyable
                    divider
                  />
                  <ItemInformationField
                    label="Счёт списания основного долга"
                    value="40702 810 7 00590062548"
                    subText="Залоговый"
                    copyable
                    divider
                  />
                </ItemInformationFieldGroup>
              </SandboxSection>
            </SandboxBlock>
          </div>

          <SandboxBlock>
            <SandboxSection title="Информация о задолженности" gap={16}>
              <ItemInformationField
                type="label-top"
                label="Основной долг"
                value={money(25_000_000)}
              />
              <ItemInformationField
                type="label-top"
                label="Проценты"
                value={money(5_500_000)}
              />
              {/* Тултип поверх содержимого — та самая проверка, ради которой
                  эталон рисует подсказку раскрытой. */}
              <ItemInformationField
                type="label-top"
                label="Комиссия за резервирование"
                value={money(100_000)}
                valueInfo="Полная сумма комиссии за резервирование рассчитывается банком в последний календарный день месяца"
              />
              <Divider className="my-2" />
              <ItemInformationField
                type="label-top"
                label="Общая сумма задолженности"
                value={money(30_600_000)}
              />
            </SandboxSection>
          </SandboxBlock>
        </SandboxColumns>
      )}

      {tab === "contracts" && (
        <SandboxBlock padding={0}>
          <DataTable fields={AGREEMENT_FIELDS} rows={CONTRACTOR_AGREEMENTS} />
        </SandboxBlock>
      )}

      {tab === "schedule" && (
        <SandboxBlock padding={0}>
          <DataTable
            fields={PAYMENT_FIELDS}
            rows={PAYMENTS}
            total={{
              label: "Итого",
              span: 1,
              row: {
                id: "total",
                date: "",
                principal: PAYMENTS.reduce((sum, r) => sum + r.principal, 0),
                interest: PAYMENTS.reduce((sum, r) => sum + r.interest, 0),
                amount: PAYMENTS.reduce((sum, r) => sum + r.amount, 0),
                status: "",
              },
            }}
          />
        </SandboxBlock>
      )}
    </SandboxPage>
  )
}

export { CreditAgreementScreen }
