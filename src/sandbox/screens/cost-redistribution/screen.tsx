import * as React from "react"

import { Search } from "@/icons"
import { Button } from "@/components/ui/button"
import { ButtonMenu } from "@/components/ui/button-menu"
import { Informer } from "@/components/ui/informer"
import { Input } from "@/components/ui/input"
import { ItemInformationField } from "@/components/ui/item-information-field"
import { ProgressBar } from "@/components/ui/progress-bar"
import { RadioGroup } from "@/components/ui/radio"
import { TableBlock } from "@/components/ui/table"
import { TitleCard } from "@/components/ui/title"
import { Toggle } from "@/components/ui/toggle"
import { useToast } from "@/components/ui/toast-message"

import { SandboxBlock, SandboxSection, SandboxPage } from "../../shell"

import { COST_ITEMS, type CostItem } from "./data"
import { CostTable } from "./table"

// D13. «Перераспределение ССР», шаг 1 — секция 70371:36100, кадр
// «Начальное состояние» 70371:36101.
//
// Экрана не было в песочнице вовсе (проверено по группе «Песочница» в
// Storybook), поэтому он собран целиком по эталону.
//
// Состав кадра сверху вниз ровно как в конструкторе:
//
//   title-page («Перераспределение ССР» + адрес объекта)
//   → progress bar варианта `step` («Шаг 1 из 3» / «Перераспределение
//     стоимости»)
//   → блок реквизитов: два information field и информер с двумя пунктами
//   → табличный блок: радиогруппа средств, тумблер «Доп. аналитика», поиск,
//     дерево статей с суммами
//   → button menu: «Далее — к графику строительства», «Сохранить черновик»,
//     «Отменить».
//
// ⚠️ Поиск и радиогруппа — НЕ украшение: они меняют то, что видно. Радио
// убирает лишний столбец средств, поиск отбирает статьи по коду, названию и
// сумме (плейсхолдер эталона так и говорит: «Код, статья или сумма»), причём
// ветка остаётся видимой, если совпал хоть один её лист, — иначе найденная
// «2.2.1.3» показалась бы без своей главы и номер потерял бы смысл.

type Funds = "all" | "borrowed" | "own"

const FUNDS: { value: Funds; label: string }[] = [
  { value: "all", label: "Все средства" },
  { value: "borrowed", label: "Заёмные" },
  { value: "own", label: "Собственные" },
]

function CostRedistributionScreen() {
  const toast = useToast()
  const [funds, setFunds] = React.useState<Funds>("all")
  const [analytics, setAnalytics] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [edits, setEdits] = React.useState<
    Record<string, { borrowed: number; own: number }>
  >({})

  function handleEdit(id: string, patch: { borrowed?: number; own?: number }) {
    setEdits((prev) => {
      const base = prev[id] ?? { borrowed: 0, own: 0 }
      const source = findItem(COST_ITEMS, id)
      return {
        ...prev,
        [id]: {
          borrowed: patch.borrowed ?? prev[id]?.borrowed ?? source?.borrowed ?? base.borrowed,
          own: patch.own ?? prev[id]?.own ?? source?.own ?? base.own,
        },
      }
    })
  }

  const rows = React.useMemo(() => filterTree(COST_ITEMS, search), [search])

  return (
    <SandboxPage
      activeSection="project-financing"
      title={
        <TitleCard
          title="Перераспределение ССР"
          description="Строительство 4-х многоквартирных домов по адресу: Тульская область, г. Новомосковск, ул. Рудничная"
          backLabel="Назад"
          helpLabel={null}
        />
      }
      additional={
        <ProgressBar
          variant="step"
          title="Шаг 1 из 3"
          description="Перераспределение стоимости"
          totalSteps={3}
          currentStep={1}
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
                title: "Переходим к графику строительства",
                behavior: "transient",
              })
            }
          >
            Далее — к графику строительства
          </Button>
          <Button
            variant="secondary-grey"
            onClick={() =>
              toast.add({ type: "checked", title: "Черновик сохранён" })
            }
          >
            Сохранить черновик
          </Button>
          <Button variant="secondary-grey">Отменить</Button>
        </ButtonMenu>
      }
    >
      <SandboxBlock>
        <SandboxSection gap={16}>
          <ItemInformationField
            type="label-left"
            label="Кредитный договор"
            value="90-151/КЛ-23-S01"
          />
          <ItemInformationField
            type="label-left"
            label="Объект строительства"
            value="Строение3 Паркинг"
            subText="Россия, Тульская область, г. Новомосковск, ул. Рудничная, 1с3"
            divider={false}
          />
        </SandboxSection>

        {/* Информер с пунктами — вариант `information`. Пункты в эталоне
            маркированы точкой и стоят под заголовком. */}
        <Informer
          icon="information"
          solid="grey"
          showCross={false}
          title="Скорректируйте сводно-сметный расчёт в статьях расходов"
          description={
            <ul className="flex list-disc flex-col gap-1 pl-4">
              <li>
                Перераспределение доступно из любых статей в любые, но общие
                суммы заёмных и собственных средств должны остаться без
                изменений
              </li>
              <li>
                Вы можете пропустить корректировку стоимости и перейти к
                изменению графика строительства — для этого нажмите «Далее — к
                графику строительства»
              </li>
            </ul>
          }
        />
      </SandboxBlock>

      <TableBlock>
        {/* Шапка шага 1 (нода 70371:36189): радиогруппа слева, тумблер и поиск
            справа. Все три — живые. */}
        <div className="flex flex-wrap items-center gap-6 px-8 pt-8">
          {/* Ряд, а не столбец: у `RadioGroup` умолчание — вертикальная
              раскладка, а в эталоне три варианта стоят в строку. */}
          <RadioGroup
            className="flex-row gap-8"
            items={FUNDS}
            value={funds}
            onValueChange={(next) => setFunds(next as Funds)}
          />
          <div className="ml-auto flex items-center gap-6">
            <Toggle
              checked={analytics}
              onCheckedChange={(next) => setAnalytics(next === true)}
              // Подпись в одну строку: в узкой шапке она переносилась на две
              // и разъезжалась с тумблером по высоте.
              label={<span className="whitespace-nowrap">Доп. аналитика</span>}
            />
            <Input
              size="sm"
              label="Код, статья или сумма"
              iconLeft={<Search aria-hidden="true" className="size-4" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              clearable
              onClear={() => setSearch("")}
              containerClassName="w-[360px]"
            />
          </div>
        </div>

        <CostTable
          items={rows}
          edits={edits}
          onEdit={handleEdit}
          funds={funds}
        />
      </TableBlock>
    </SandboxPage>
  )
}

/** Статья по идентификатору — нужна, чтобы правка одной суммы не обнуляла вторую. */
function findItem(items: CostItem[], id: string): CostItem | undefined {
  for (const item of items) {
    if (item.id === id) return item
    const inner = item.children && findItem(item.children, id)
    if (inner) return inner
  }
  return undefined
}

/**
 * Отбор по строке поиска. Ветка остаётся, если совпала сама или совпал хоть
 * один её потомок: номер статьи имеет смысл только вместе с главой.
 */
function filterTree(items: CostItem[], query: string): CostItem[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return items

  const result: CostItem[] = []
  for (const item of items) {
    const children = item.children ? filterTree(item.children, needle) : undefined
    const own =
      item.number.toLowerCase().includes(needle) ||
      item.title.toLowerCase().includes(needle) ||
      String(item.borrowed ?? "").includes(needle) ||
      String(item.own ?? "").includes(needle)
    if (!own && !children?.length) continue
    result.push({ ...item, children: own ? item.children : children })
  }
  return result
}

export { CostRedistributionScreen }
