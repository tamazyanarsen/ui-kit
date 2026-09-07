import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ButtonMenu } from "@/components/ui/button-menu"
import { Divider } from "@/components/ui/divider"
import { Informer } from "@/components/ui/informer"
import { ItemInformationField } from "@/components/ui/item-information-field"
import { TitleCard, TitleInformationText } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import {
  SandboxBlock,
  SandboxColumns,
  SandboxPage,
  SandboxSection,
} from "../../shell"
import { PLACEMENT_HINTS } from "../section-hints/hints"
import { SectionHintsModal } from "../section-hints/hints-modal"

import { HistoryModal } from "./history-modal"

// D8. «Деталка заявки на размещение средств» — инстанс конструктора
// 70371:25060 плюс модальное окно истории 70371:25061.
//
// Это ОДНА песочница, а не две: по конструкции модалка не отдельная витрина,
// а состояние экрана — она открывается ссылкой «История изменений» в шапке
// страницы и вне её не существует.
//
// Кнопка «Справка» открывает окно подсказок РАЗДЕЛА (D9) — тот же модуль,
// что и на калькуляторе размещения: подсказки принадлежат разделу, а не
// документу.

function PlacementRequestScreen() {
  const toast = useToast()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [hintsOpen, setHintsOpen] = useState(false)

  return (
    <SandboxPage
      activeSection="placement"
      title={
        <TitleCard
          title="Заявка на размещение средств №17215"
          onBack={() => {}}
          onHelp={() => setHintsOpen(true)}
          tag="Исполнена"
          tagColor="green"
          information={
            <TitleInformationText
              type="link"
              onLinkClick={() => setHistoryOpen(true)}
            >
              История изменений
            </TitleInformationText>
          }
        />
      }
      bottomBar={
        <ButtonMenu>
          <Button
            variant="primary"
            onClick={() =>
              toast.add({
                type: "checked",
                title: "Заявка выгружена",
                description: "Заявка на размещение средств №17215",
              })
            }
          >
            Скачать
          </Button>
        </ButtonMenu>
      }
    >
      <SandboxColumns widths={[7, 5]}>
        <SandboxBlock>
          <SandboxSection title="Основные параметры ЕСО">
            <Informer
              solid="grey"
              icon="attention-yellow"
              title="Вы выбрали продукт на индивидуальных условиях"
              description="Предложение действует до 20.05.2026 18:00"
              showCross={false}
            />

            <div className="flex flex-col">
              <ItemInformationField
                label="Индикатив"
                value="Ключевая ставка"
                divider
              />
              <ItemInformationField
                label="Дата начала действия соглашения"
                value="20.04.2026"
                valueInfo="Указана плановая дата. Фактическая дата — это дата обработки заявки Банком и может наступить позже плановой"
                divider
              />
              <ItemInformationField
                label="Выплата процентов"
                value="Ежемесячно"
                divider
              />
            </div>
          </SandboxSection>

          <SandboxSection title="Счета продукта" gap={0}>
            <ItemInformationField
              label="Счёт подключения ЕСО"
              value="40702 810 1 23456789456"
              subText="Расчётный"
              copyable
              divider
            />
            <ItemInformationField
              label="Счёт выплаты процентов"
              value="40702 810 1 23456789456"
              subText="Расчётный"
              copyable
              divider
            />
          </SandboxSection>

          <Informer
            solid="grey"
            icon="information"
            title="Подписание заявки доступно только Единоличному исполнительному органу"
            description="Вы сможете отправить на подпись или сохранить заявку для дальнейшего подписания уполномоченным лицом"
            showCross={false}
          />
        </SandboxBlock>

        <SandboxBlock>
          <SandboxSection title="Ежедневный свободный остаток" gap={16}>
            <p className="text-p2-regular text-[var(--grey-284)]">
              Индикатив — ключевая ставка ЦБ РФ
            </p>
          </SandboxSection>

          <ItemInformationField
            type="large-value"
            label="Ставка*"
            value="20%"
            valueInfo="Справочная ставка на текущую дату. Итоговая определяется при подключении ЕСО"
          />

          <Divider />

          <div className="flex flex-col gap-6 text-p3-regular text-[var(--grey-284)]">
            <p>
              * Указана справочная ставка на текущую дату. Сообщение с итоговой
              ставкой будет направлено в центр уведомлений не позднее, чем через
              1 рабочий день после подключения ЕСО.
            </p>
            <p>
              Последующие уведомления об изменениях ставки будут направляться
              аналогичным способом
            </p>
          </div>
        </SandboxBlock>
      </SandboxColumns>

      <HistoryModal open={historyOpen} onOpenChange={setHistoryOpen} />
      <SectionHintsModal
        title="Заявка на размещение средств"
        hints={PLACEMENT_HINTS}
        open={hintsOpen}
        onOpenChange={setHintsOpen}
      />
    </SandboxPage>
  )
}

export { PlacementRequestScreen }
