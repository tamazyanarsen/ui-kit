import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  PseudoBox,
  optionsArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix"
import { type Viewport } from "@/lib/viewport"
import { Button } from "@/components/ui/button"
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
import {
  LEADING_OPTIONS,
  BlockWidgetMatrix,
  SlotStub,
  TITLE_LABELS,
  TYPE_LABELS,
  VARIANT_LABELS,
  leadingNode,
  type LeadingOption,
} from "@/stories/block-widget-fixtures"

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

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => <BlockWidgetMatrix />,
}
