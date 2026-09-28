import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Information, Lock } from "@/icons"

import { cn } from "@/lib/utils"
import { useComposedRefs } from "@/lib/compose-refs"
import { resolveCaption } from "@/components/ui/input/caption"
import { Hint } from "@/components/ui/tooltip"
import { FieldTooltip } from "@/components/ui/input/hover-tooltip"

// Размеры сверены с вектором макета (точные прямоугольники, а не только
// пипетка по растру): радиус 16px (а не rounded-2xl из темы, который здесь
// даёт 18px), и — в отличие от прежнего прочтения по растру — десктопная и
// мобильная формы действительно различаются по высоте (111px против 97px в
// эталоне, обе с учётом обводки), сначала мобильная, как у размера L у
// Input. Высоту коробки по-прежнему задают атрибут `rows` и отступы, а не
// жёстко прописанное число, и внутри одного брейкпоинта она не меняется
// между состояниями Empty, Filled и Lock. Отступы — равномерные 16px на
// обоих брейкпоинтах (сверено с живым компонентом макета), на мобильном
// они не уменьшаются.
//
// Высота задана явно: мастер `ELK / text-area` в состояниях Empty и Filled
// — это `h-[112px]` на Desktop и 98 на Mobile, с `min-h-[56px]` и текстом
// `flex-[1_0_0]`, т.е. рамка НЕ меняет высоту при заполнении. Раньше высота
// была чисто контентной (rows=3), что давало 110px на десктопе — на 2px
// меньше мастера; мобильная при этом совпадала случайно. `min-h-*`, а не
// `h-*`, чтобы поле по-прежнему могло вырасти под большее число строк и
// переопределяться через className.
const textareaBoxVariants = cva(
  // `transition-all`, а не `transition-colors`: вместе с подписью едет и
  // вертикальный отступ коробки (16px → 8px), иначе текст прыгал бы под
  // плавно уезжающей подписью (дизайн-чек №3 №2).
  "group/textarea relative flex min-h-[98px] w-full flex-col rounded-[16px] border border-[var(--input-border)] bg-[var(--input-bg)] p-4 transition-all has-[[aria-disabled=true]]:cursor-not-allowed has-[[aria-disabled=true]]:border-[var(--input-border-disabled)] has-[[aria-disabled=true]]:bg-[var(--input-bg-disabled)] desktop:min-h-[112px]",
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
   * заблокированного поля». В спеке рядом с этим состоянием
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
   * . Дизайн-чек 3/3 №19: её не было ни в компоненте, ни в
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

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
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
}, ref) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const invalid = Boolean(error)
  const { caption } = resolveCaption(error, comment)
  const captionId = caption ? `${textareaId}-caption` : undefined

  // Плавающая подпись, как у Input: пока поле пусто и не в фокусе, подпись
  // играет роль его placeholder (крупная, серая); как только появляется
  // значение или фокус, её место над текстом занимает маленькая подпись
  // 12px. В том же состоянии вертикальные отступы коробки уменьшаются с
  // 16px до 8px — в точности как отступы Empty против Filled у живого
  // компонента макета.
  //
  // Дизайн-чек №3 №2: «Нет анимации текстов как у input. Нужно добавить».
  // Раньше подпись просто переключалась `hidden` → `block`: рывок вместо
  // перехода. Теперь она, как у Input, позиционируется абсолютно и едет
  // между двумя точками (`transition-all`), а место под текст освобождает
  // не раскладка, а верхний отступ самой textarea. Родной placeholder при
  // этом делается прозрачным — иначе он дублировал бы подпись.
  const hasFloatingLabel = Boolean(label)
  // У нестроковой подписи без `placeholder` плейсхолдер всё равно нужен —
  // пробел: без атрибута `:placeholder-shown` не срабатывает никогда, и
  // подпись навсегда оставалась «поднятой» над пустым полем.
  const resolvedPlaceholder = hasFloatingLabel
    ? typeof label === "string"
      ? label
      : (placeholder ?? " ")
    : placeholder

  const fieldRef = React.useRef<HTMLTextAreaElement>(null)
  const composedRef = useComposedRefs(fieldRef, ref)

  // Нажатие в любую точку коробки ставит каретку в конец поля. Место под
  // поднятую подпись — внешний отступ поля (см. `mt-5` ниже), а не часть
  // самой textarea, как раньше `pt-5`, поэтому щелчок в эту полосу (и по
  // подписи — у неё `pointer-events-none`) попадал в коробку и фокуса не
  // давал. Нажатие в самом поле не трогается: выделение текста работает
  // как обычно.
  function focusFromBox(event: React.MouseEvent<HTMLDivElement>) {
    const field = fieldRef.current
    // Выключенное поле тоже фокусируется, как и раньше: выключение в ките —
    // `readOnly` + `aria-disabled`, поле остаётся в обходе и под щелчком.
    if (!field || event.button !== 0 || event.target === field) return
    event.preventDefault()
    field.focus()
    const end = field.value.length
    field.setSelectionRange(end, end)
  }

  return (
    // Исправление второго прохода: зазор стоял gap-1.5 (6px), а корневой
    // кадр макета для вариантов Comment и Error — это flex-col с
    // gap-[4px] между коробкой и строкой подписи.
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
        onMouseDown={focusFromBox}
      >
        <textarea
          id={textareaId}
          ref={composedRef}
          data-slot="textarea"
          rows={rows}
          // ⚠️ Заблокированная область ПРИНИМАЕТ TAB — блокировка это пара
          // `readOnly` + `aria-disabled`, а не нативный `disabled`, который
          // убрал бы её из обхода клавиатурой целиком (см. тот же разбор у
          // Input). Кольцо фокуса при этом обязательно: у заблокированной
          // области рамка своя и на фокус не реагирует.
          aria-disabled={disabled || undefined}
          readOnly={locked || disabled}
          placeholder={resolvedPlaceholder}
          aria-invalid={invalid || undefined}
          aria-describedby={captionId}
          aria-readonly={locked || undefined}
          className={cn(
            // Исправление второго прохода: цвет текста в выключенном
            // состоянии был --input-fg-disabled (#C8C8CB), а живые символы
            // Disabled/Filled и Disabled+Locked оба показывают введённое
            // значение цветом #6D6D6D, а не более светлым серым Input.
            // Заодно добавлено затемнение placeholder при наведении: символ
            // Empty+Hover (и его вариант с ошибкой) показывает, что текст
            // placeholder-подписи при наведении уходит с #999 на #6D6D6D —
            // тот же тон, что и --textarea-border-hover, — чего этот
            // компонент раньше не делал вовсе.
            "themed-scrollbar order-2 min-w-0 flex-1 resize-none bg-transparent text-p2-medium text-[var(--input-fg)] outline-none transition-all placeholder:text-[var(--input-label-fg)] hover:placeholder:text-[var(--textarea-border-hover)] aria-disabled:cursor-not-allowed aria-disabled:text-[var(--textarea-fg-disabled)] aria-disabled:focus-visible:focus-ring desktop:text-p1-medium",
            // Плавающая подпись перекрывает первую строку, поэтому в
            // «поднятом» состоянии текст уходит вниз ровно на её высоту
            // (16px строка + 4px зазор): 8px внутреннего отступа коробки
            // + 20px = 28px, как в мастере Filled.
            //
            // ⚠️ Внешний отступ, а не внутренний: `padding` входит в
            // прокручиваемую область, и при прокрутке длинного текста строки
            // проезжали через место подписи и рисовались поверх неё (аудит
            // 11). `margin` лежит вне прокрутки, а геометрия та же: высота
            // поля по `rows` без отступа плюс те же 20px сверху.
            hasFloatingLabel &&
              "placeholder:text-transparent focus:mt-5 [&:not(:placeholder-shown)]:mt-5",
            // Замок стоит в правом верхнем углу коробки. Без подписи текст
            // начинается на его высоте, и конец первой строки рисовался
            // прямо под значком — место под него (16 + зазор 8) держит
            // правый отступ. С подписью первая строка ниже замка.
            locked && !hasFloatingLabel && "pr-6",
            className
          )}
          {...props}
        />
        {label && (
          // Исправление второго прохода: убрано переопределение цвета по
          // group-has-disabled — у символов Disabled/Filled и
          // Disabled+Locked маленькая подпись 12px в выключенном состоянии
          // остаётся --input-label-fg (#999), как и во всех остальных
          // состояниях: она не перекрашивается никогда.
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
            // Исправление второго прохода: цвет в выключенном состоянии
            // был --input-fg-disabled (#C8C8CB), а у SVG значка замка в
            // Disabled+Locked стоит fill="#999999", что в точности
            // совпадает с --input-label-fg, а не с более светлым серым
            // Input.
            className="absolute top-4 right-4 order-1 size-4 shrink-0 text-[var(--input-icon-fg)] group-has-[[aria-disabled=true]]/textarea:text-[var(--textarea-icon-fg-disabled)]"
          />
        )}
      </div>
      </FieldTooltip>
      {caption && (
        // Исправление второго прохода: не хватало px-4 и font-medium — ряды
        // Comment и Error в макете оба используют px-[16px] (встают по
        // внутреннему отступу самой коробки) и font-['Object_Sans:Medium'],
        // а у этой подписи не было ни того, ни другого.
        //
        // Дизайн-чек 3/3 №19: строка комментария в макете — flex-ряд с
        // gap-[4px], где текст занимает всё свободное место, а иконка «i»
        // 16×16 прижата к правому краю.
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
            {caption}
          </p>
          {showCommentIcon &&
            (commentHint ? (
              <Hint content={commentHint} direction="down-center">
                <button
                  type="button"
                  aria-label="Дополнительная информация"
                  className="shrink-0 text-[var(--input-caption-fg)] outline-none focus-visible:focus-ring"
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
})

export { Textarea, textareaBoxVariants }
export type { TextareaProps }
