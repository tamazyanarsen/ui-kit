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

interface SkinStyle {
  background: string
  // "mark" skins swap the ДОМ.РФ building watermark for a different glyph
  // (Sticker → NFC sticker icon, Digital Card → cloud) — see BankCard's own
  // Watermark component for the actual glyphs.
  watermark: "building" | "sticker" | "cloud"
}

// Every skin's actual artwork in Figma is a pre-rendered image asset (no
// inline gradient/color data available via the design-context API) — these
// are CSS approximations sampled from a screenshot of the full 10-skin
// variant grid, in the same "simplified, not a literal asset trace" spirit
// as PaymentLogo's brand marks. Two skins ("mono", "ultra-grey") are a hard
// diagonal split rather than a smooth blend — reproduced with a
// same-position double color-stop.
export const SKIN_STYLES: Record<BankCardSkin, SkinStyle> = {
  mono: {
    background: "linear-gradient(115deg, #252628 46%, #3FA535 46%)",
    watermark: "building",
  },
  multi: {
    background: "#3A3B3D",
    watermark: "building",
  },
  "black-classic": {
    background: "#1C1C1E",
    watermark: "building",
  },
  metal: {
    background: "linear-gradient(135deg, #E4E5E7 0%, #A6A8AC 100%)",
    watermark: "building",
  },
  "ultra-grey": {
    background: "linear-gradient(115deg, #48586A 46%, #A9C3CF 46%)",
    watermark: "building",
  },
  sticker: {
    background: "#1C1C1E",
    watermark: "sticker",
  },
  "dark-green": {
    background: "linear-gradient(135deg, #1F3D2E 0%, #6E8F79 100%)",
    watermark: "building",
  },
  grey: {
    background: "linear-gradient(135deg, #C7C2B8 0%, #8D8477 100%)",
    watermark: "building",
  },
  violet: {
    background: "linear-gradient(135deg, #241F3A 0%, #8A84A0 100%)",
    watermark: "building",
  },
  "digital-card": {
    background: "#16211D",
    watermark: "cloud",
  },
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
