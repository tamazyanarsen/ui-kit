/**
 * Палитра старого бренда («Старые цвета», `data-product="odl-elk"`) для
 * витрины `.Colors/Palette`.
 *
 * Источник — левые колонки «Было: …» таблиц перехода на странице палитры
 * Figma («Переходный этап ребрендинга»): имена и hex взяты из текста макета,
 * а не подобраны. `cssVar` — переменная кита, которая держит этот цвет
 * (если держит): по ней свотч читает живое значение, как и в новой теме.
 * У цвета без переменной кит его просто не использует — свотч рисуется по
 * hex из макета и так и подписан.
 *
 * Имена переменных `odl-*` выведены раньше правилом контраста и с Figma
 * совпали не везде (`odl-red-410` — в макете Red 241, `odl-red-488` — Red
 * 211, `odl-dark-blue-117` — Blue 117). Переменные не переименованы: на них
 * ссылается тема и монохромная проверочная палитра, а подпись свотча
 * показывает имя из Figma.
 */
export interface OdlColor {
  /** Имя в Figma (лист «Было»). */
  figma: string
  hex: string
  /** Переменная кита без `--`, если цвет в ките используется. */
  cssVar: string | null
}

export interface OdlFamily {
  /** Заголовок таблицы в Figma. */
  title: string
  note: string
  colors: OdlColor[]
}

export const ODL_FAMILIES: OdlFamily[] = [
  {
    title: "Green colors",
    note: "Бренд старой темы: место Blue colors (Банк) новой палитры.",
    colors: [
      { figma: "Green 333", hex: "#699B12", cssVar: "odl-green-333" },
      { figma: "Green 289", hex: "#72A716", cssVar: "odl-green-289" },
      { figma: "Green 223", hex: "#82BF00", cssVar: "odl-green-223" },
      { figma: "Green 171", hex: "#A3D562", cssVar: "odl-green-171" },
      { figma: "Green 137", hex: "#C4E88B", cssVar: "odl-green-137" },
      { figma: "Green 123", hex: "#D9F0AB", cssVar: "odl-green-123" },
      { figma: "Green 107", hex: "#F3F9E6", cssVar: "odl-green-107" },
    ],
  },
  {
    title: "Grey colors",
    note: "Нейтральные: те же, что в новой палитре (там добавлен только Grey 1723).",
    colors: [
      { figma: "Grey 1514", hex: "#252628", cssVar: "grey-1514" },
      { figma: "Grey 868", hex: "#494C4B", cssVar: "grey-868" },
      { figma: "Grey 517", hex: "#6D6D6D", cssVar: "grey-517" },
      { figma: "Grey 284", hex: "#999999", cssVar: "grey-284" },
      { figma: "Grey 166", hex: "#C8C8CB", cssVar: "grey-166" },
      { figma: "Grey 134", hex: "#DEDEDE", cssVar: "grey-134" },
      { figma: "Grey 124", hex: "#E6E6E6", cssVar: "grey-124" },
      { figma: "Grey 114", hex: "#EFEFEF", cssVar: "grey-114" },
      { figma: "Grey 106", hex: "#F8F8F8", cssVar: "grey-106" },
      { figma: "White 101", hex: "#FFFFFF", cssVar: "white-101" },
    ],
  },
  {
    title: "Red colors",
    note: "Ошибка и удаление: в новой палитре заменены целиком.",
    colors: [
      { figma: "Red 603", hex: "#B92F10", cssVar: "odl-red-603" },
      { figma: "Red 211", hex: "#CB4022", cssVar: "odl-red-488" },
      { figma: "Red 241", hex: "#DE4A2A", cssVar: "odl-red-410" },
      { figma: "Red 182", hex: "#FFAB99", cssVar: "odl-red-182" },
      { figma: "Red 147", hex: "#FFC9B5", cssVar: "odl-red-147" },
      { figma: "Red 117", hex: "#FFE8E3", cssVar: "red-117" },
      { figma: "Red 109", hex: "#FFF2F0", cssVar: null },
    ],
  },
  {
    title: "Yellow colors",
    note: "Внимание: при ребрендинге не менялись.",
    colors: [
      { figma: "Yellow 214", hex: "#EEA20F", cssVar: "yellow-214" },
      { figma: "Yellow 167", hex: "#F8C000", cssVar: "yellow-167" },
      { figma: "Yellow 146", hex: "#FAD248", cssVar: null },
      { figma: "Yellow 134", hex: "#FADC89", cssVar: "yellow-134" },
      { figma: "Yellow 114", hex: "#FDF0C1", cssVar: "yellow-114" },
      { figma: "Yellow 104", hex: "#FFFAE0", cssVar: "yellow-104" },
    ],
  },
  {
    title: "Blue colors",
    note: "Старые голубые; в новой палитре их место заняли Dark blue colors.",
    colors: [
      { figma: "Blue 322", hex: "#5B90E0", cssVar: "dark-blue-322" },
      { figma: "Blue 216", hex: "#8DB2EB", cssVar: null },
      { figma: "Blue 182", hex: "#9AC2FF", cssVar: "odl-blue-182" },
      { figma: "Blue 141", hex: "#C3DBFF", cssVar: null },
      { figma: "Blue 117", hex: "#E3EEFF", cssVar: "odl-dark-blue-117" },
    ],
  },
  {
    title: "Violet colors",
    note: "В новой палитре заменены на Mint colors.",
    colors: [
      { figma: "Violet 297", hex: "#A08BCC", cssVar: null },
      { figma: "Violet 190", hex: "#C3B5E1", cssVar: null },
    ],
  },
  {
    title: "Lavender colors",
    note: "Старые лавандовые; новая линейка — другие оттенки.",
    colors: [
      { figma: "Lavender 403", hex: "#7B6AF4", cssVar: null },
      { figma: "Lavender 281", hex: "#998DF6", cssVar: null },
      { figma: "Lavender 231", hex: "#AAA0F8", cssVar: null },
      { figma: "Lavender 161", hex: "#CCC6FB", cssVar: null },
      { figma: "Lavender 116", hex: "#EEECFE", cssVar: null },
    ],
  },
  {
    title: "Brown colors",
    note: "Не менялись; в новой палитре добавлен Brown 307.",
    colors: [
      { figma: "Brown 191", hex: "#C2BAB5", cssVar: null },
      { figma: "Brown 156", hex: "#D6CDC7", cssVar: null },
      { figma: "Brown 122", hex: "#EBE7E4", cssVar: null },
      { figma: "Brown 115", hex: "#F0EEEC", cssVar: null },
    ],
  },
]

/** Переменные кита, которых нет на листах «Было»: оттенки наведения и
 * нажатия, выведенные китом для старой темы (в макете их нет). */
export const ODL_DERIVED = ["odl-grey-1156", "odl-grey-873"]
