import { useState } from "react"

import { Button } from "@/components/ui/button"
import { CardAccount } from "@/components/ui/card-account"
import { Checkbox } from "@/components/ui/checkbox"
import { Radio, RadioGroup } from "@/components/ui/radio"
import { Tag } from "@/components/ui/tag"

import {
  BlockWidget,
  BlockWidgetColumn,
  BlockWidgetHead,
  BlockWidgetSlot,
  type BlockWidgetTitleType,
  type BlockWidgetType,
  type BlockWidgetVariant,
} from "@/components/ui/block-widget"

import { StatesMatrix } from "./matrix"

// Подписи и заглушки для витрины Block Widget. Вынесены из файла историй:
// тот вырос до 456 строк, из которых 396 кода, и правило проекта «не больше
// 300 строк на файл» нарушал единственным в ките способом — не логикой, а
// перечислениями.
//
// Лежат в `src/stories`, а не рядом с компонентом: каталог `components/ui`
// попадает в сборку деклараций (`include` у dts в vite.config.ts), а
// `src/stories` — нет. Файл рядом с компонентом уехал бы в пакет как .d.ts
// со ссылкой на `@/stories/matrix`, которого в пакете не существует.

const VARIANT_LABELS: Record<BlockWidgetVariant, string> = {
  solid: "Solid",
  border: "Border",
}

const TYPE_LABELS: Record<BlockWidgetType, string> = {
  default: "Default",
  label: "Label",
  double: "Double",
}

const TITLE_LABELS: Record<BlockWidgetTitleType, string> = {
  large: "Large Text",
  small: "Small Text",
}

const LEADING_OPTIONS = ["Radio", "Checkbox", "Card", "None"] as const
type LeadingOption = (typeof LEADING_OPTIONS)[number]

/** `Block Element (ELK)`: перечисление говорит, ЧТО кладут в левый слот. */
function leadingNode(option: LeadingOption) {
  if (option === "Radio") {
    return (
      <RadioGroup value="one">
        <Radio value="one" />
      </RadioGroup>
    )
  }
  if (option === "Checkbox") return <Checkbox checked />
  if (option === "Card") {
    // `IB / card account` — мини-плашка счёта 48 × 34 с радиусом 4.
    //
    // Дизайн-чек от 07.09, замечание 2: «сюда нужно централизованно
    // пробрасывать компонент Card Pictogram… не хватает иконок платёжных
    // систем». Плашка была собрана прямо здесь и поэтому приходила без
    // логотипа платёжной системы — теперь это `CardAccount` кита.
    return <CardAccount paymentSystem="mir" number="4135" />
  }
  return undefined
}

/** Заглушка содержимого — в мастерах слот нарисован пустым прямоугольником. */
function SlotStub({ height }: { height: number }) {
  return (
    <div
      className="flex w-full items-center justify-center rounded-[8px] border border-dashed border-[var(--block-widget-border)] text-p3-medium text-[var(--block-widget-muted-fg)]"
      style={{ height }}
    >
      Slot
    </div>
  )
}

/** Живой блок: нажатие переключает выбор, как в реестре виджетов. */
function SelectableWidget({ value }: { value: string }) {
  const [selected, setSelected] = useState(false)
  return (
    <BlockWidget onClick={() => setSelected((prev) => !prev)}>
      <BlockWidgetHead
        leading={<Checkbox checked={selected} onCheckedChange={setSelected} />}
        title={value}
        subtitle="Subtitle"
        description="Нажатие по блоку переключает выбор, по кнопке — нет"
        info="Пояснение к заголовку блока"
        tag={<Tag color="green">Label</Tag>}
        status="Description"
        action={
          <Button variant="primary" size="sm">
            Button
          </Button>
        }
      />
      <BlockWidgetSlot>
        <SlotStub height={152} />
      </BlockWidgetSlot>
    </BlockWidget>
  )
}

/** Матрица всех состояний Block Widget — 145 строк перечислений, поэтому она
 * живёт здесь, а сама история остаётся обёрткой. */
function BlockWidgetMatrix() {
  return (
    <div className="flex flex-col gap-2">
      {/* Ось Variant × ось State. У обводки строки Hover нет намеренно:
          состояния Hover у её сета не существует. */}
      <StatesMatrix<{ variant: BlockWidgetVariant; clickable?: boolean }>
        responsive
        columns={[
          { label: "Solid", props: { variant: "solid" } },
          { label: "Border", props: { variant: "border" } },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: { clickable: true }, pseudo: "hover" },
        ]}
        render={({ variant, clickable }) => (
          <div className="w-[420px]">
            <BlockWidget
              variant={variant}
              onClick={clickable ? () => {} : undefined}
            >
              <BlockWidgetHead
                leading={<Checkbox checked />}
                title="Title"
                subtitle="Subtitle"
                description="Description"
                status="Description"
              />
            </BlockWidget>
          </div>
        )}
      />

      {/* Ось Type — три раскладки шапки. */}
      <StatesMatrix<{ type: BlockWidgetType }>
        responsive
        columns={[
          { label: "Default", props: { type: "default" } },
          { label: "Label", props: { type: "label" } },
          { label: "Double", props: { type: "double" } },
        ]}
        rows={[{ label: "Solid", props: {} }]}
        render={({ type }) => (
          <div className="w-[560px]">
            <BlockWidget type={type}>
              {type === "double" ? (
                <>
                  <BlockWidgetColumn>
                    <BlockWidgetHead title="Title" description="Description" />
                    <BlockWidgetSlot>
                      <SlotStub height={80} />
                    </BlockWidgetSlot>
                  </BlockWidgetColumn>
                  <BlockWidgetColumn>
                    <BlockWidgetHead title="Title" description="Description" />
                    <BlockWidgetSlot>
                      <SlotStub height={80} />
                    </BlockWidgetSlot>
                  </BlockWidgetColumn>
                  <BlockWidgetSlot>
                    <SlotStub height={64} />
                  </BlockWidgetSlot>
                </>
              ) : (
                <>
                  <BlockWidgetHead
                    leading={type === "default" ? <Checkbox checked /> : undefined}
                    title="Title"
                    subtitle="Subtitle"
                    description="Description"
                    tag={<Tag color="green">Label</Tag>}
                    labelFirst={type === "label"}
                  />
                  <BlockWidgetSlot>
                    <SlotStub height={80} />
                  </BlockWidgetSlot>
                </>
              )}
            </BlockWidget>
          </div>
        )}
      />

      {/* Ось Title Block / Type — две ступени типографики заголовка. */}
      <StatesMatrix<{ titleType: BlockWidgetTitleType }>
        responsive
        columns={[
          { label: "Large Text", props: { titleType: "large" } },
          { label: "Small Text", props: { titleType: "small" } },
        ]}
        rows={[{ label: "Solid", props: {} }]}
        render={({ titleType }) => (
          <div className="w-[420px]">
            <BlockWidget>
              <BlockWidgetHead
                leading={<Checkbox checked />}
                title="Title"
                subtitle="Subtitle"
                description="Description"
                titleType={titleType}
              />
            </BlockWidget>
          </div>
        )}
      />

      {/* Левый слот: перечисление сета `Block Element (ELK)`. */}
      <StatesMatrix<{ leadingType: LeadingOption }>
        responsive
        columns={LEADING_OPTIONS.map((leadingType) => ({
          label: leadingType,
          props: { leadingType },
        }))}
        rows={[{ label: "Block Element", props: {} }]}
        render={({ leadingType }) => (
          <div className="w-[360px]">
            <BlockWidget>
              <BlockWidgetHead
                leading={leadingNode(leadingType)}
                leadingAlign={leadingType === "Card" ? "center" : "start"}
                title="Title"
                description="Description"
              />
            </BlockWidget>
          </div>
        )}
      />

      {/* Живьём: нажатие по блоку переключает выбор, по кнопке внутри — нет. */}
      <StatesMatrix<Record<string, never>>
        responsive
        columns={[{ label: "Нажимается", props: {} }]}
        rows={[{ label: "Solid", props: {} }]}
        render={() => (
          <div className="w-[640px]">
            <SelectableWidget value="Виджет реестра" />
          </div>
        )}
      />
    </div>
  )
}

export {
  BlockWidgetMatrix,
  LEADING_OPTIONS,
  SelectableWidget,
  SlotStub,
  TITLE_LABELS,
  TYPE_LABELS,
  VARIANT_LABELS,
  leadingNode,
}
export type { LeadingOption }
