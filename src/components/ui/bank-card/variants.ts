import blackClassicArt from "./backgrounds/black-classic.svg"
import darkGreenArt from "./backgrounds/dark-green.svg"
import digitalCardArt from "./backgrounds/digital-card.svg"
import greyArt from "./backgrounds/grey.svg"
import metalArt from "./backgrounds/metal.svg"
import monoArt from "./backgrounds/mono.svg"
import multiArt from "./backgrounds/multi.svg"
import stickerArt from "./backgrounds/sticker.svg"
import ultraGreyArt from "./backgrounds/ultra-grey.svg"
import violetArt from "./backgrounds/violet.svg"


export type BankCardSkin =
  | "mono"
  | "multi"
  | "black-classic"
  | "metal"
  | "ultra-grey"
  | "sticker"
  | "dark-green"
  | "grey"
  | "violet"
  | "digital-card"

export type BankCardSide = "face" | "back"

/**
 * Дизайн-чек №16: «дизайн карты не соответствует макету Figma. Есть
 * принципиальные различия, которые необходимо устранить, полностью
 * унаследовав дизайн из Figma».
 *
 * Различия брались не из воздуха: раньше каждая карта рисовалась
 * CSS-градиентом «на глаз по скриншоту сетки вариантов» — отсюда и
 * «принципиальные различия». Настоящий артворк у Figma есть и отдаётся
 * векторным ассетом (слой `Card Image` внутри каждого символа, например
 * `Size=Desktop, Type=Face, Style=Mono` — нода 52969:11715), причём файлы
 * уже лежали в `./backgrounds`, но компонент их не использовал.
 *
 * Теперь используются они. Заодно ушли водяные знаки: здание ДОМ.РФ,
 * стикер и облако нарисованы внутри самого артворка, отдельным слоем их
 * подкладывать больше не нужно.
 */
interface SkinStyle {
  /** Векторный артворк карты из Figma (332×208, слой `Card Image`). */
  art: string
}

export const SKIN_STYLES: Record<BankCardSkin, SkinStyle> = {
  mono: { art: monoArt },
  multi: { art: multiArt },
  "black-classic": { art: blackClassicArt },
  metal: { art: metalArt },
  "ultra-grey": { art: ultraGreyArt },
  sticker: { art: stickerArt },
  "dark-green": { art: darkGreenArt },
  grey: { art: greyArt },
  violet: { art: violetArt },
  "digital-card": { art: digitalCardArt },
}

export const SKIN_LABELS: Record<BankCardSkin, string> = {
  mono: "Зелёная ДОМ.РФ (Mono)",
  multi: "Чёрная ДОМ.РФ (Multi)",
  "black-classic": "Чёрная классическая (Black Classic)",
  metal: "Металлическая (Metal)",
  "ultra-grey": "Серая ультра (Ultra Grey)",
  sticker: "Стикер (Sticker)",
  "dark-green": "Тёмно-зелёная (Dark Green)",
  grey: "Серая (Grey)",
  violet: "Фиолетовая (Violet)",
  "digital-card": "Цифровая карта (Digital Card)",
}
