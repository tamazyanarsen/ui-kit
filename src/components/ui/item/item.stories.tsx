import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  PseudoBox,
  StatesMatrix,
  StorySection,
  optionsArgType,
  sizeArgType,
  stateArgTypeOf,
  toggleArgType,
  type PlaygroundState,
} from "@/stories/matrix";
import { ViewportScope, type Viewport } from "@/lib/viewport";

import {
  Item,
  type CommentColor,
  type ItemProps,
  type RightElementType,
} from "./item";
import { ItemGroup } from "./item-group";

/* Контролы — по таблице «Свойства компонента» мастера `ELK / item` v1.0.1
   (Release 69.36, документация на канвасе Item, дизайн-чек от 08.10,
   замечание 14):

     State               Default, Hover, Disabled
     Category            Default, Sub                → `subCategory`
     Show Right Element  True, False
     Show Thumbnail      True, False                 → `thumbnail`
     Show Divider        True, False                 → `divider`
     Right Element
       Type              Navigation, Information, Select (Accordion),
                         Check, Text, Toggle, Checkbox
     Content
       Type              Default, Label              → строка `text`
       Show Comment      True, False
     Comment
       Text Color        Success, Error, Attention, Information

   Size — ось самого сета (Desktop / Mobile). Наш `accordion` давно назван
   `select`: в сете правого элемента значение так и подписано (`Type=Select`),
   а в таблице свойств документации — Accordion. */
const RIGHT_ELEMENT_LABELS: Record<
  Exclude<RightElementType, "none">,
  string
> = {
  navigation: "Navigation",
  information: "Information",
  select: "Select (Accordion)",
  check: "Check",
  text: "Text",
  toggle: "Toggle",
  checkbox: "Checkbox",
};

const RIGHT_ELEMENTS = Object.keys(RIGHT_ELEMENT_LABELS) as Exclude<
  RightElementType,
  "none"
>[];

const COMMENT_COLOR_LABELS: Record<CommentColor, string> = {
  green: "Success",
  red: "Error",
  yellow: "Attention",
  grey: "Information",
};

type Category = "default" | "sub";
type ContentType = "default" | "label";

type PlaygroundArgs = ItemProps & {
  category?: Category;
  showThumbnail?: boolean;
  contentType?: ContentType;
  showComment?: boolean;
  showRightElement?: boolean;
  state?: PlaygroundState;
  viewport?: Viewport;
};

const meta = {
  title: "Компоненты/Item",
  component: Item,
  parameters: { layout: "padded" },
  argTypes: {
    viewport: sizeArgType,
    // Active — Правки UI-Kit от 25.10: нажатие Grey 124, на десктопе строка
    // сжимается до 0,98, в мобильном виде — только содержимое до 0,97.
    state: stateArgTypeOf(["default", "hover", "active", "disabled"]),
    category: optionsArgType<Category>(
      "Category",
      { default: "Default", sub: "Sub" },
      "inline-radio",
    ),
    showRightElement: toggleArgType("Show Right Element"),
    showThumbnail: toggleArgType("Show Thumbnail"),
    divider: toggleArgType("Show Divider"),
    rightElement: {
      ...optionsArgType("Type", RIGHT_ELEMENT_LABELS),
      table: { category: "Right Element (ELK)" },
    },
    open: {
      name: "Раскрыта",
      control: "boolean",
      description:
        "Панель, которую раскрывает строка, сейчас открыта (Right Element = Select): шеврон смотрит вверх и выставляется aria-expanded",
      table: { category: "Right Element (ELK)" },
    },
    // Имеют смысл только при Toggle и Checkbox. Playground оставляет их
    // кликабельными через собственное состояние, но заданный контрол
    // закрепляет значение.
    toggleChecked: {
      control: "boolean",
      table: { category: "Right Element (ELK)" },
    },
    checkboxChecked: {
      control: "boolean",
      table: { category: "Right Element (ELK)" },
    },
    rightText: { control: "text", table: { category: "Right Element (ELK)" } },
    contentType: {
      ...optionsArgType<ContentType>(
        "Type",
        { default: "Default", label: "Label" },
        "inline-radio",
      ),
      table: { category: "Content Item (ELK)" },
    },
    showComment: {
      ...toggleArgType("Show Comment"),
      table: { category: "Content Item (ELK)" },
    },
    commentColor: {
      ...optionsArgType("Text Color", COMMENT_COLOR_LABELS, "inline-radio"),
      table: { category: "Comment Item (ELK)" },
    },
    // `text`, `comment`, `informationText` и `rightText` объявлены как
    // `React.ReactNode`, но везде используются обычными строками. Без этого
    // незаданное значение откатывается на универсальный JSON-редактор.
    text: { control: "text", table: { category: "Контент" } },
    value: { control: "text", table: { category: "Контент" } },
    comment: { control: "text", table: { category: "Контент" } },
    informationText: { control: "text", table: { category: "Контент" } },
    informationTitle: {
      name: "Заголовок шторы «i» (мобайл)",
      description: "Правки UI-Kit от 25.10: в мобильном виде «i» открывает штору; пусто — «Информация»",
      control: "text",
      table: { category: "Контент" },
    },
    // Значения осей State / Category / Show Thumbnail — своих контролов нет.
    disabled: { table: { disable: true } },
    subCategory: { table: { disable: true } },
    thumbnail: { table: { disable: true } },
  },
  /* Порядок ключей здесь задаёт порядок строк в панели Storybook (argTypes
     на него не влияет), поэтому он повторяет порядок таблицы свойств. */
  args: {
    viewport: "desktop",
    state: "default" as PlaygroundState,
    category: "default",
    showRightElement: true,
    showThumbnail: true,
    divider: true,
    rightElement: "navigation",
    open: false,
    rightText: "+1,5%",
    contentType: "label",
    showComment: true,
    commentColor: "grey",
    text: "Тип операции",
    value: "Перевод между счетами",
    comment: "Comment",
    informationText: "Дополнительная информация об операции",
    informationTitle: "",
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  render: ({
    category,
    showThumbnail,
    contentType,
    showComment,
    showRightElement,
    text,
    comment,
    rightElement,
    viewport,
    state,
    ...args
  }) => (
    <PseudoBox
      viewport={viewport}
      state={state === "disabled" ? "default" : state}
      className="w-full"
    >
      <InteractiveItem
        {...args}
        disabled={state === "disabled"}
        subCategory={category === "sub"}
        thumbnail={showThumbnail ? true : undefined}
        text={contentType === "label" ? text : undefined}
        comment={showComment ? comment : undefined}
        rightElement={showRightElement ? rightElement : "none"}
      />
    </PseudoBox>
  ),
};

// Оставляет правые элементы toggle и checkbox кликабельными, но при этом
// позволяет контролам `toggleChecked` и `checkboxChecked` закрепить
// значение, когда они заданы.
function InteractiveItem({
  toggleChecked,
  checkboxChecked,
  ...props
}: ItemProps) {
  const [toggle, setToggle] = useState(true);
  const [checkbox, setCheckbox] = useState(false);
  return (
    <Item
      {...props}
      toggleChecked={toggleChecked ?? toggle}
      onToggleChange={setToggle}
      checkboxChecked={checkboxChecked ?? checkbox}
      onCheckboxChange={setCheckbox}
    />
  );
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {/* Right Element — собственная ось вариантов в макете. */}
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[280px]"
        responsive
        baseProps={{
          text: "Title",
          value: "Value",
          informationText: "Дополнительная информация",
          rightText: "+1,5%",
        }}
        columnGroups={[
          {
            label: "Right Element",
            columns: (["none", ...RIGHT_ELEMENTS] as RightElementType[]).map(
              (rightElement) => ({
                label:
                  rightElement === "none"
                    ? "None"
                    : RIGHT_ELEMENT_LABELS[rightElement],
                props: { rightElement },
              }),
            ),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          // У Toggle, Checkbox и Information нажатие строки эмулируется так
          // же: правило «нажат вложенный контрол» аддон не включает.
          { label: "Active", props: {}, pseudo: "active" },
          { label: "С миниатюрой", props: { thumbnail: true } },
          { label: "Sub category", props: { subCategory: true } },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <InteractiveItem {...props} />}
      />

      {/* Цвет комментария и форма «только значение» не зависят от правого
          элемента. */}
      <StatesMatrix<ItemProps>
        stretch
        cellClassName="min-w-[320px]"
        baseProps={{ text: "Title", value: "Value" }}
        columns={[
          ...(Object.keys(COMMENT_COLOR_LABELS) as CommentColor[]).map(
            (commentColor) => ({
              label: `Text Color: ${COMMENT_COLOR_LABELS[commentColor]}`,
              props: { comment: "Comment", commentColor },
            }),
          ),
        ]}
        rows={[
          { label: "С заголовком", props: {} },
          // Только значение: строка схлопывается в одну.
          { label: "Только значение", props: { text: undefined } },
          {
            // Правило «Максимальное количество строк» из макета: значение
            // переносится максимум на 3 строки, комментарий — на 5, дальше
            // оба обрезаются многоточием.
            label: "Длинный текст\n(3 / 5 строк)",
            props: {
              value:
                "Пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов, пример подзаголовка с большим количеством символов",
              comment:
                "Пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов, пример комментария с большим количеством символов",
            },
          },
        ]}
        render={(props) => <Item {...props} />}
      />

      {/* Механика группы (замечания 14 и 46 дизайн-чека от 08.10): у
          последней строки линии нет даже при явном `divider`, а при
          наведении/нажатии гаснут линии, прилегающие к залитой зоне. Живая —
          наведите курсор на строку. Правки UI-Kit от 25.10: список —
          `ItemGroup`, каждая строка обёрнута в свой `div`, и линии на месте. */}
      <div className="p-8">
        <StorySection
          title="Группа"
          description="ItemGroup, каждая строка в своём div. Наведите или нажмите на строку: прилегающие к заливке разделители гаснут. У последней строки разделителя нет. В мобильном виде группа во всю ширину блока (bleed)."
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {(["desktop", "mobile"] as Viewport[]).map((viewport) => (
              <ViewportScope key={viewport} viewport={viewport}>
                <div className="flex flex-col rounded-2xl bg-white p-4 desktop:p-2">
                  <ItemGroup bleed>
                    {GROUP_ROWS.map((value, index) => (
                      <div key={value}>
                        <Item
                          value={value}
                          comment="Comment"
                          thumbnail={index % 2 === 0 ? true : undefined}
                          rightElement={index === 1 ? "toggle" : "navigation"}
                          divider
                          onClick={() => {}}
                        />
                      </div>
                    ))}
                  </ItemGroup>
                </div>
              </ViewportScope>
            ))}
          </div>
        </StorySection>
      </div>
    </div>
  ),
};

const GROUP_ROWS = [
  "Перевод между счетами",
  "Оплата по реквизитам",
  "Платёж по СБП",
  "Автоплатёж",
];

type GroupArgs = {
  viewport?: Viewport;
  bleed?: boolean;
  wrapped?: boolean;
};

/* ItemGroup — список строк в блоке (Правки UI-Kit от 25.10). Группа решает,
   какая строка последняя, — и когда строки обёрнуты каждая в свой `div`
   (контрол «Строки в обёртках»). `bleed` — правило мобильного каркаса:
   в мобильном виде список во всю ширину блока, без внешних полей, с обрезкой
   по скруглению блока. */
export const Group: StoryObj<GroupArgs> = {
  name: "ItemGroup",
  parameters: {
    layout: "padded",
    // Контролы строки из meta здесь не к месту — только свои.
    controls: { include: ["viewport", "bleed", "wrapped"] },
  },
  argTypes: {
    viewport: sizeArgType,
    bleed: {
      name: "bleed",
      control: "boolean",
      description:
        "В мобильном виде выйти на боковые и нижнее поля блока (16): строки от края до края, обрезка по скруглению",
    },
    wrapped: {
      name: "Строки в обёртках",
      control: "boolean",
      description:
        "Каждая строка в своём div (как при анимации появления) — разделители не пропадают",
    },
  },
  args: { viewport: "mobile", bleed: true, wrapped: true },
  render: ({ viewport, bleed, wrapped }) => (
    <ViewportScope viewport={viewport}>
      <div className="max-w-[400px] rounded-2xl bg-white p-4 desktop:max-w-[640px] desktop:p-2">
        <ItemGroup bleed={bleed}>
          {GROUP_ROWS.map((value, index) => {
            const row = (
              <Item
                key={value}
                value={value}
                comment="Comment"
                thumbnail
                rightElement={index === 1 ? "toggle" : "navigation"}
                onClick={() => {}}
              />
            );
            return wrapped ? <div key={value}>{row}</div> : row;
          })}
        </ItemGroup>
      </div>
    </ViewportScope>
  ),
};
