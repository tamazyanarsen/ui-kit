import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  StatesMatrix,
  optionsArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Radio, RadioGroup } from "@/components/ui/radio"
import { Tag } from "@/components/ui/tag"

import {
  BlockWidget,
  BlockWidgetColumn,
  BlockWidgetSlot,
  type BlockWidgetProps,
  type BlockWidgetType,
  type BlockWidgetVariant,
} from "./block-widget"
import { BlockWidgetHead, type BlockWidgetTitleType } from "./head"

/**
 * Block Widget — карточка с шапкой и слотом содержимого, из которой
 * собираются виджеты дашборда.
 *
 * Панель «Свойства компонента» двух сетов кита:
 *
 *     ELK / block-widget (solid)    Size, State (Default, Hover), Type,
 *                                   Show Conteiner, Slot 1
 *     ELK / block-widget (border)   Size, Type, Show Conteiner, Slot 1
 *
 * ⚠️ Сетов ДВА, и состояния `Hover` у обводки нет вовсе — то есть
 * кликабельным бывает только сплошной блок. Здесь это `Variant` плюс запрет
 * на нажатие у обводки: коробка, отступы и начинка у них совпадают до
 * пикселя, а вот поведение — нет.
 *
 * ⚠️ `Show Conteiner` — опечатка самого кита («Conteiner» вместо
 * «Container»). Имя контрола оставлено как в панели свойств, чтобы сверка
 * шла посимвольно; чинить это надо в Figma, а не у себя.
 */
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
    return (
      <span
        aria-hidden="true"
        className="flex h-[34px] w-12 items-end justify-end rounded-[4px] bg-[var(--card-thumb-bg)] px-1 pb-1 text-p4-regular text-[var(--card-thumb-fg)]"
      >
        4135
      </span>
    )
  }
  return undefined
}

/** Заглушка содержимого — в мастерах слот нарисован пустым прямоугольником. */
function SlotStub({ height }: { height: number }) {
  return (
    <div
      className="flex w-full items-center justify-center rounded-[8px] border border-dashed border-[var(--block-widget-border)] text-p3-regular text-[var(--block-widget-muted-fg)]"
      style={{ height }}
    >
      Slot
    </div>
  )
}

type PlaygroundArgs = Omit<BlockWidgetProps, "children" | "onClick"> & {
  state?: PlaygroundState
  viewport?: Viewport
  titleType?: BlockWidgetTitleType
  leadingType?: LeadingOption
  title?: string
  subtitle?: string
  description?: string
  status?: string
  showSubtitle?: boolean
  showDescription?: boolean
  showIcon?: boolean
  showTag?: boolean
  showStatus?: boolean
  showButton?: boolean
  showConteiner?: boolean
  showBottomContainer?: boolean
  clickable?: boolean
}

const CONTENT = { table: { category: "Контент" } }

const meta = {
  title: "Компоненты/Block Widget",
  component: BlockWidget,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    // Ховер пропом не выставить — его даёт PseudoBox, как у остальных
    // наводимых компонентов кита.
    state: stateArgTypeOf(["default", "hover"]),
    variant: optionsArgType("Variant", VARIANT_LABELS),
    type: optionsArgType("Type", TYPE_LABELS),
    titleType: {
      ...optionsArgType("Title Block / Type", TITLE_LABELS),
      description:
        "Свойство Type вложенного сета Title Block: две ступени типографики заголовка, а не размер коробки",
    },
    leadingType: {
      name: "Block Element / Type",
      description:
        "Левый слот. В сете перечислены Card / Checkbox / Radio — это то, ЧТО туда кладут; у типа Label слота нет вовсе",
      control: "inline-radio",
      options: LEADING_OPTIONS,
    },
    showSubtitle: toggleArgType("Show Subtitle"),
    showDescription: toggleArgType("Show Description"),
    showIcon: toggleArgType("Show Icon", "Значок `icon / information` с подсказкой"),
    showTag: toggleArgType("Show Tag"),
    showStatus: toggleArgType("Show Value Status", "Приписка справа от заголовка"),
    showButton: toggleArgType("Show Button"),
    showConteiner: toggleArgType(
      "Show Conteiner",
      "Слот содержимого. «Conteiner» — опечатка самого кита, имя оставлено как в панели свойств"
    ),
    showBottomContainer: toggleArgType(
      "Show Bottom Container",
      "Общий нижний слот — только у типа Double"
    ),
    clickable: {
      name: "Нажимается",
      description:
        "Состояние Hover есть только у сплошного блока: у сета обводки его нет вовсе, поэтому здесь оно игнорируется",
      control: "boolean",
    },
    title: { control: "text", ...CONTENT },
    subtitle: { control: "text", ...CONTENT },
    description: { control: "text", ...CONTENT },
    status: { control: "text", ...CONTENT },
  },
  args: {
    viewport: "desktop" as Viewport,
    state: "default" as PlaygroundState,
    variant: "solid" as BlockWidgetVariant,
    type: "default" as BlockWidgetType,
    titleType: "large" as BlockWidgetTitleType,
    leadingType: "Radio" as LeadingOption,
    showSubtitle: true,
    showDescription: true,
    showIcon: true,
    showTag: true,
    showStatus: true,
    showButton: true,
    showConteiner: true,
    showBottomContainer: true,
    clickable: false,
    title: "Title",
    subtitle: "Subtitle",
    description: "Description",
    status: "Description",
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

function headProps(args: PlaygroundArgs) {
  return {
    title: args.title,
    subtitle: args.showSubtitle ? args.subtitle : undefined,
    description: args.showDescription ? args.description : undefined,
    status: args.showStatus ? args.status : undefined,
    info: args.showIcon ? "Пояснение к заголовку блока" : undefined,
    tag: args.showTag ? <Tag color="green">Label</Tag> : undefined,
    action: args.showButton ? (
      <Button variant="primary" size="sm">
        Button
      </Button>
    ) : undefined,
    titleType: args.titleType,
    labelFirst: args.type === "label",
  }
}

export const Playground: Story = {
  render: ({ state, viewport, clickable, ...args }) => {
    const head = headProps(args)
    const leading =
      args.type === "label" ? undefined : leadingNode(args.leadingType ?? "Radio")
    const leadingAlign = args.leadingType === "Card" ? "center" : "start"

    return (
      <PseudoBox state={state} viewport={viewport}>
        <div className="w-full max-w-[880px]">
          <BlockWidget
            variant={args.variant}
            type={args.type}
            onClick={clickable ? () => {} : undefined}
          >
            {args.type === "double" ? (
              <>
                {/* В мастере `Type=Double` шапка колонки короче: без левого
                    слота и без приписки — на две колонки места меньше. */}
                <BlockWidgetColumn>
                  <BlockWidgetHead
                    {...head}
                    status={undefined}
                    labelFirst={false}
                  />
                  {args.showConteiner && (
                    <BlockWidgetSlot>
                      <SlotStub height={152} />
                    </BlockWidgetSlot>
                  )}
                </BlockWidgetColumn>
                <BlockWidgetColumn>
                  <BlockWidgetHead
                    {...head}
                    status={undefined}
                    labelFirst={false}
                  />
                  {args.showConteiner && (
                    <BlockWidgetSlot>
                      <SlotStub height={152} />
                    </BlockWidgetSlot>
                  )}
                </BlockWidgetColumn>
                {args.showBottomContainer && (
                  <BlockWidgetSlot>
                    <SlotStub height={64} />
                  </BlockWidgetSlot>
                )}
              </>
            ) : (
              <>
                <BlockWidgetHead
                  {...head}
                  leading={leading}
                  leadingAlign={leadingAlign}
                />
                {args.showConteiner && (
                  <BlockWidgetSlot>
                    <SlotStub height={152} />
                  </BlockWidgetSlot>
                )}
              </>
            )}
          </BlockWidget>
        </div>
      </PseudoBox>
    )
  },
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

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
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
  ),
}
