import { cva } from "class-variance-authority"

// Design only defines two size tokens for Input: S (32px, both breakpoints)
// and L (48px mobile -> 56px desktop, mobile-first via `desktop:`). There is
// no M.
type InputSize = "sm" | "lg"

const inputBoxVariants = cva(
  "group/input relative flex w-full items-center border border-[var(--input-border)] bg-[var(--input-bg)] transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:border-[var(--input-border-disabled)] has-[:disabled]:bg-[var(--input-bg-disabled)]",
  {
    variants: {
      size: {
        // Round-2 audit: sm was px-3 (12px) — get_design_context on the S
        // Desktop symbols (215:6684 comment variant, 215:6796 empty
        // variant) both give a literal px-[16px], same horizontal padding
        // as lg, not a smaller one.
        sm: "h-8 gap-2 rounded-[8px] px-4",
        lg: "h-12 gap-2 rounded-[16px] px-4 desktop:h-14",
      },
      invalid: {
        true: "border-[var(--input-border-error)]",
        false: "",
      },
      interactive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        invalid: false,
        interactive: true,
        class:
          "hover:border-[var(--input-border-hover)] has-[input:focus]:border-[var(--input-border-hover)]",
      },
      {
        invalid: true,
        interactive: true,
        class:
          "hover:border-[var(--input-border-error-hover)] has-[input:focus]:border-[var(--input-border-error-hover)]",
      },
    ],
    defaultVariants: {
      size: "lg",
      invalid: false,
      interactive: true,
    },
  }
)

/**
 * Размер текста самого поля.
 *
 * Обновление мобильного макета Input (канвас 666:12, компонент-сет
 * «ELK / input» v1.2.0): у размера S текст на мобиле — 12/16 (Mobile.
 * Параграф/P2 Medium Mobile, нода 70303:80530), а на десктопе остаётся 14/20
 * (Desktop. Параграф/P2 Medium, нода 70303:80528). Раньше оба брейкпоинта
 * держали 14/20, из-за чего мобильный S был крупнее макета.
 *
 * ⚠️ Отдельной константой, а не только внутри `inputFieldVariants`: этот же
 * размер обязаны повторить невидимый двойник-измеритель и знак «₽» у маски
 * суммы. Разъедутся они — поле начнёт прокручиваться и обрежет начало числа.
 */
const FIELD_TEXT_SIZE: Record<InputSize, string> = {
  sm: "text-p3-medium desktop:text-p2-medium",
  lg: "text-p2-medium desktop:text-p1-medium",
}

const inputFieldVariants = cva(
  // Weight lives in each size variant's text-pN-medium below, not here.
  "peer min-w-0 flex-1 bg-transparent text-[var(--input-fg)] outline-none placeholder:text-[var(--input-label-fg)] disabled:cursor-not-allowed disabled:text-[var(--input-fg-disabled)]",
  {
    variants: {
      size: FIELD_TEXT_SIZE,
      // Floating label only exists at the L size — at S (32px) there isn't
      // room for a second line, so the design falls back to a plain
      // placeholder that disappears on input (see the S/Desktop reference).
      floating: {
        true: "placeholder:text-transparent [&:not(:placeholder-shown)]:pt-4 focus:pt-4 desktop:[&:not(:placeholder-shown)]:pt-5 desktop:focus:pt-5",
        false: "",
      },
    },
    defaultVariants: {
      size: "lg",
      floating: false,
    },
  }
)

// Empty state matches the field's own text size (placeholder-like); once
// floated up (focused or filled) it shrinks to the kit's usual caption size.
// Design-check #3/#16/#30: was flat text-xs (12px) in both states — too
// small for the empty/unfloated label across every size except S (no
// floating label there at all, see `floating` above).
// get_design_context on the floated/filled "L / Desktop, Focused, Filled"
// symbol (215:6874): both the empty-state placeholder and the floated-up
// small label live inside one font-['Object_Sans:Medium'] wrapper — Medium
// at every size, not just the pre-float P1/P2 state.
const floatingLabelVariants =
  // Floated position is 7px from the box's inner top edge at both L forms —
  // the 48px mobile row is `pt-[7px]` and the 56px desktop row centres a
  // 40px (16 + 24) content block in its 54px interior, i.e. also 7px. It
  // used to sit 3px lower on desktop.
  "pointer-events-none absolute top-1/2 -translate-y-1/2 truncate text-p2-medium text-[var(--input-label-fg)] transition-all desktop:text-p1-medium peer-focus:top-[7px] peer-focus:translate-y-0 peer-focus:text-p3-medium desktop:peer-focus:text-p3-medium peer-[&:not(:placeholder-shown)]:top-[7px] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-p3-medium desktop:peer-[&:not(:placeholder-shown)]:text-p3-medium group-has-[:disabled]/input:text-[var(--input-fg-disabled)]"

// Trailing glyphs (clear cross, eye, lock, spinner) are 16px at every size —
// Figma's `icon / close cross` is `size-[16px]` in the S, L-mobile and
// L-desktop rows alike.
const ICON_SIZE: Record<InputSize, string> = {
  sm: "size-3.5",
  lg: "size-4",
}

// The *leading* icon is the exception: the L row draws it at 24px (the
// filled "Icon Left" row of the 56px input, node 103:14052), while the
// compact row keeps 16px (node 192:4304).
const LEADING_ICON_SIZE: Record<InputSize, string> = {
  sm: "size-4",
  lg: "size-6",
}

export {
  FIELD_TEXT_SIZE,
  ICON_SIZE,
  LEADING_ICON_SIZE,
  floatingLabelVariants,
  inputBoxVariants,
  inputFieldVariants,
}
export type { InputSize }
