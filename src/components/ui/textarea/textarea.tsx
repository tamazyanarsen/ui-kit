import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Information, Lock } from "@/icons"

import { cn } from "@/lib/utils"
import { Hint } from "@/components/ui/tooltip"
import { FieldTooltip } from "@/components/ui/input/hover-tooltip"

// Sizing verified against ui/textarea/*.svg (exact vector rects, not just
// pixel-sampled PNGs): radius is 16px (not the theme's rounded-2xl, which
// computes to 18px here) and — unlike the earlier PNG-based read — desktop
// and mobile genuinely differ in height (111px vs 97px in the reference,
// both stroke-inclusive), mobile-first like Input's L size. Box height is
// still driven by the `rows` attribute + padding, not a hardcoded height,
// and stays constant across Empty/Filled/Lock states within a breakpoint.
// Padding is a uniform 16px on both breakpoints (confirmed against the live
// Figma component) — not reduced on mobile.
//
// Высота задана явно: мастер `ELK / text-area` (137:2610 Empty и 137:2617
// Filled) в обоих состояниях — `h-[112px]` на Desktop и 98 на Mobile, с
// `min-h-[56px]` и текстом `flex-[1_0_0]`, т.е. рамка НЕ меняет высоту при
// заполнении. Раньше высота была чисто контентной (rows=3), что давало
// 110px на десктопе — на 2px меньше мастера; мобильная при этом совпадала
// случайно. `min-h-*`, а не `h-*`, чтобы поле по-прежнему могло вырасти
// под большее число строк и переопределяться через className.
const textareaBoxVariants = cva(
  // `transition-all`, а не `transition-colors`: вместе с подписью едет и
  // вертикальный отступ коробки (16px → 8px), иначе текст прыгал бы под
  // плавно уезжающей подписью (дизайн-чек №3 №2).
  "group/textarea relative flex min-h-[98px] w-full flex-col rounded-[16px] border border-[var(--input-border)] bg-[var(--input-bg)] p-4 transition-all has-[:disabled]:cursor-not-allowed has-[:disabled]:border-[var(--input-border-disabled)] has-[:disabled]:bg-[var(--input-bg-disabled)] desktop:min-h-[112px]",
  {
    variants: {
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
          "hover:border-[var(--textarea-border-hover)] has-[textarea:focus]:border-[var(--textarea-border-hover)]",
      },
      {
        invalid: true,
        interactive: true,
        class:
          "hover:border-[var(--input-border-error-hover)] has-[textarea:focus]:border-[var(--input-border-error-hover)]",
      },
    ],
    defaultVariants: {
      invalid: false,
      interactive: true,
    },
  }
)

interface TextareaOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  error?: React.ReactNode
  /**
   * Lock Input — поле заблокировано для редактирования.
   *
   * Дизайн-чек 3/3 №18: «неверное поведение компонента при настройке
   * заблокированного поля». В спеке рядом с этим состоянием (52140:162555)
   * написано буквально: «Состояние поля ввода заблокировано. Всегда
   * заполнено. При наведении отображается Tooltip с информацией о причине
   * невозможности редактирования поля». Из трёх требований выполнялось одно:
   * поле становилось `readOnly` и получало замок, но подсказки при наведении
   * не было вообще — ровно та же связка, что у Input, просто сюда её не
   * донесли. Теперь Textarea тоже оборачивается в `FieldTooltip`.
   */
  locked?: boolean
  /** Причина блокировки — показывается в Tooltip при наведении. */
  lockedHint?: React.ReactNode
  /**
   * Comment & Icon — иконка «i» в правом краю строки комментария
   * (52140:162590). Дизайн-чек 3/3 №19: её не было ни в компоненте, ни в
   * контролах. По спеке «иконка предназначена для возможности отобразить
   * дополнительную информацию», поэтому она не декоративная: текст подсказки
   * приходит в `commentHint` и раскрывается по клику через Hint.
   */
  showCommentIcon?: boolean
  commentHint?: React.ReactNode
  containerClassName?: string
}

type TextareaProps = Omit<React.ComponentProps<"textarea">, "size"> &
  Omit<VariantProps<typeof textareaBoxVariants>, "invalid" | "interactive"> &
  TextareaOwnProps

function Textarea({
  className,
  containerClassName,
  label,
  comment,
  error,
  locked = false,
  lockedHint,
  showCommentIcon = false,
  commentHint,
  disabled,
  id,
  rows = 3,
  placeholder,
  ...props
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const invalid = Boolean(error)
  const captionId = comment || error ? `${textareaId}-caption` : undefined

  // Floating label, matching Input: empty + unfocused shows the label as the
  // field's own placeholder (large, grey); once there's a value or focus, a
  // small 12px caption takes its place above the text instead. The box's own
  // vertical padding shrinks from 16px to 8px in that same state, matching
  // the live Figma component's Empty-vs-Filled padding exactly.
  //
  // Дизайн-чек №3 №2: «Нет анимации текстов как у input. Нужно добавить».
  // Раньше подпись просто переключалась `hidden` → `block`: рывок вместо
  // перехода. Теперь она, как у Input, позиционируется абсолютно и едет
  // между двумя точками (`transition-all`), а место под текст освобождает
  // не раскладка, а верхний отступ самой textarea. Родной placeholder при
  // этом делается прозрачным — иначе он дублировал бы подпись.
  const hasFloatingLabel = Boolean(label)
  const resolvedPlaceholder = hasFloatingLabel
    ? typeof label === "string"
      ? label
      : placeholder
    : placeholder

  return (
    // Round-2 audit fix: gap was gap-1.5 (6px); the Figma root frame for
    // the Comment/Error variants (7426:2047, 158:3743) is a flex-col with
    // gap-[4px] between the box and the caption row.
    <div className="flex w-full flex-col gap-1">
      {/* Дизайн-чек 3/3 №18: подсказка о причине блокировки — та же обёртка,
          что и у Input (input/hover-tooltip.tsx). Она монтируется всегда и
          просто держится закрытой, когда объяснять нечего. */}
      <FieldTooltip content={locked ? lockedHint : null}>
      <div
        className={cn(
          textareaBoxVariants({ invalid, interactive: !locked }),
          hasFloatingLabel &&
            "has-[textarea:not(:placeholder-shown)]:py-2 has-[textarea:focus]:py-2",
          containerClassName
        )}
      >
        <textarea
          id={textareaId}
          data-slot="textarea"
          rows={rows}
          disabled={disabled}
          readOnly={locked}
          placeholder={resolvedPlaceholder}
          aria-invalid={invalid || undefined}
          aria-describedby={captionId}
          aria-readonly={locked || undefined}
          className={cn(
            // Round-2 audit fix: disabled text color was --input-fg-disabled
            // (#C8C8CB) — get_design_context on the live Disabled/Filled and
            // Disabled+Locked symbols (137:2616, 11282:15677) both show the
            // typed value text as #6D6D6D, not the lighter Input grey.
            // Also added hover:placeholder darkening: the Empty+Hover symbol
            // (137:2607, and its Error variant 158:3743) shows the
            // placeholder-as-label text going from #999 to #6D6D6D on
            // hover — same tone as --textarea-border-hover — which this
            // component previously never did.
            "order-2 min-w-0 flex-1 resize-none bg-transparent text-p2-medium text-[var(--input-fg)] outline-none transition-all placeholder:text-[var(--input-label-fg)] hover:placeholder:text-[var(--textarea-border-hover)] disabled:cursor-not-allowed disabled:text-[var(--textarea-fg-disabled)] desktop:text-p1-medium",
            // Плавающая подпись перекрывает первую строку, поэтому в
            // «поднятом» состоянии текст уходит вниз ровно на её высоту
            // (16px строка + 4px зазор): 8px внутреннего отступа коробки
            // + 20px = 28px, как в мастере Filled.
            hasFloatingLabel &&
              "placeholder:text-transparent focus:pt-5 [&:not(:placeholder-shown)]:pt-5",
            className
          )}
          {...props}
        />
        {label && (
          // Round-2 audit fix: dropped the group-has-disabled color
          // override — get_design_context on the Disabled/Filled and
          // Disabled+Locked symbols (137:2616, 11282:15677) both show
          // the small 12px label staying --input-label-fg (#999) when
          // disabled, same as every other state; it never recolors.
          //
          // Покоящееся положение совпадает с первой строкой текста (тот же
          // кегль и та же координата), поэтому переход читается как рост
          // самой подписи, а не как подмена одного элемента другим.
          <label
            htmlFor={textareaId}
            className={cn(
              "pointer-events-none absolute top-4 left-4 truncate text-p2-medium text-[var(--input-label-fg)] transition-all desktop:text-p1-medium",
              // Место под замок справа, чтобы длинная подпись под него не
              // подлезала.
              locked ? "right-10" : "right-4",
              "group-focus-within/textarea:top-2 group-focus-within/textarea:text-p3-medium desktop:group-focus-within/textarea:text-p3-medium",
              "group-has-[textarea:not(:placeholder-shown)]/textarea:top-2 group-has-[textarea:not(:placeholder-shown)]/textarea:text-p3-medium desktop:group-has-[textarea:not(:placeholder-shown)]/textarea:text-p3-medium"
            )}
          >
            {label}
          </label>
        )}
        {locked && (
          <Lock
            aria-hidden="true"
            // Round-2 audit fix: disabled color was --input-fg-disabled
            // (#C8C8CB) — the Disabled+Locked lock icon SVG
            // (11282:15677) is fill="#999999", matching --input-label-fg
            // exactly rather than the lighter Input grey.
            className="absolute top-4 right-4 order-1 size-4 shrink-0 text-[var(--input-icon-fg)] group-has-[:disabled]/textarea:text-[var(--textarea-icon-fg-disabled)]"
          />
        )}
      </div>
      </FieldTooltip>
      {(comment || error) && (
        // Round-2 audit fix: missing px-4 and font-medium — the Figma
        // Comment/Error rows (52140:162226, 52140:162391) both use
        // px-[16px] (aligning with the box's own inner padding) and
        // font-['Object_Sans:Medium'], neither of which this caption had.
        //
        // Дизайн-чек 3/3 №19: строка комментария в макете — flex-ряд с
        // gap-[4px], где текст занимает всё свободное место, а иконка «i»
        // 16×16 прижата к правому краю (52140:162590).
        <div className="flex w-full items-start gap-1 px-4">
          <p
            id={captionId}
            className={cn(
              "min-w-0 flex-1 text-p3-medium",
              error
                ? "text-[var(--input-caption-error-fg)]"
                : "text-[var(--input-caption-fg)]"
            )}
          >
            {error ?? comment}
          </p>
          {showCommentIcon &&
            (commentHint ? (
              <Hint content={commentHint} direction="down-center">
                <button
                  type="button"
                  aria-label="Дополнительная информация"
                  className="shrink-0 text-[var(--input-caption-fg)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Information aria-hidden="true" className="size-4" />
                </button>
              </Hint>
            ) : (
              <Information
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--input-caption-fg)]"
              />
            ))}
        </div>
      )}
    </div>
  )
}

export { Textarea, textareaBoxVariants }
export type { TextareaProps }
