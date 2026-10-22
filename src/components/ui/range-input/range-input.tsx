import * as React from "react"
import { useStableId } from "@/lib/use-stable-id"
// У ползунка свои стрелки из макета (тоньше символов набора) — см.
// thumb-arrow.tsx.
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"
import { ThumbArrow } from "./thumb-arrow"
import { hasNode } from "@/lib/has-node"
import { useComposedRefs } from "@/lib/compose-refs"
import { resolveCaption } from "@/components/ui/input/caption"
import { RangeValueField } from "./value-field"
import { formatRangeValue, rangeValueSpec } from "./value-mask"
import { manualChangeDetails } from "@/lib/change-details"

interface RangeInputOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  /** Строка — текст ошибки; `true` — только состояние ошибки, без текста. */
  error?: React.ReactNode
  scaleLabels?: React.ReactNode[]
  /**
   * Формат значения (Intl). Из него берутся знак единицы (₽, %, км) и число
   * знаков после запятой; разряды и запятая — всегда по-русски.
   */
  format?: Intl.NumberFormatOptions
  /** Маска суммы: рубли без копеек, «400 000 ₽» — как `mask="amount"` у Input. */
  mask?: "amount"
  /** Своя единица после числа («дн.», «мес.»), поверх `format` и `mask`. */
  unit?: string
}

type RangeInputProps = Omit<
  SliderPrimitive.Root.Props<number>,
  "children" | "ref" | "value" | "defaultValue" | "onValueChange"
> &
  RangeInputOwnProps & {
    value?: number
    defaultValue?: number
    onValueChange?: (value: number, eventDetails: SliderPrimitive.Root.ChangeEventDetails) => void
  }

/** Подробности события для изменения с клавиатуры в поле значения. */
function typedChangeDetails(event: Event) {
  return manualChangeDetails("input-change", event, {
    activeThumbIndex: 0,
  }) as unknown as SliderPrimitive.Root.ChangeEventDetails
}

// Ползунок с одной ручкой, оформленный как поле в рамке по образцу Input:
// сверху подпись и отформатированное значение, снизу дорожка. В отличие от
// Checkbox и Radio, состояние ошибки НЕ перекрашивает рамку коробки (она
// остаётся --range-input-border, по конвенции Input) — краснеют только
// акцент дорожки с ползунком и текст подписи.
// `ref` — на нативный `input` ползунка, а не на корень: `Controller` из
// react-hook-form ставит фокус на поле с ошибкой через `field.ref.focus()`,
// а у корня-`div` фокуса нет. Так же устроены Input, Checkbox и Radio.
const RangeInput = React.forwardRef<HTMLInputElement, RangeInputProps>(function RangeInput({
  className,
  label,
  comment,
  error,
  scaleLabels,
  format,
  mask,
  unit,
  disabled,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = 0,
  max = 100,
  step = 1,
  ...props
}, ref) {
  // Значение держится здесь, а не только в Base UI: его двигает и ползунок,
  // и набор в поле (дизайн-чек 08.10, замечание 31), и обоим нужен один
  // источник. Управляемый `value` по-прежнему главнее.
  const [internalValue, setInternalValue] = React.useState(
    typeof defaultValue === "number" ? defaultValue : min
  )
  const value = typeof valueProp === "number" ? valueProp : internalValue
  // Потребитель вправе отменить изменение (`details.cancel()`): и у
  // перетаскивания, и у набранного в поле — один контракт.
  function change(next: number, details: SliderPrimitive.Root.ChangeEventDetails) {
    onValueChange?.(next, details)
    if (details.isCanceled) return false
    if (valueProp === undefined) setInternalValue(next)
    return true
  }
  const spec = rangeValueSpec({ mask, format, unit, min })
  const valueFieldRef = React.useRef<HTMLInputElement>(null)
  // Поле значения подписано той же подписью, что и ползунок. `id` подписи
  // выдаёт Base UI (свой `id` Label не принимает), поэтому связь ставится
  // после монтирования.
  const labelRef = React.useRef<HTMLDivElement>(null)
  /** Каретка — в конец поля значения. */
  function focusValueField() {
    const field = valueFieldRef.current
    if (!field || disabled) return
    field.focus()
    const end = field.value.length
    field.setSelectionRange(end, end)
  }
  React.useLayoutEffect(() => {
    const field = valueFieldRef.current
    const labelId = labelRef.current?.id
    if (!field) return
    if (labelId) field.setAttribute("aria-labelledby", labelId)
    else field.removeAttribute("aria-labelledby")
  })
  // Дизайн-чек 3/3 №3: состояние ошибки и её текст переключаются отдельно,
  // поэтому `error` принимает и `true` — красная шкала без подписи.
  const invalid = Boolean(error)
  const { caption } = resolveCaption(error, comment)
  const hasCaption = hasNode(caption)
  // `scaleLabels={["0", cond && "50", "100"]}`: пустые метки (`null`, `false`) не
  // рисуются пустыми `<span>`, иначе `justify-between` оставлял под ними дыру.
  const scale = (scaleLabels ?? []).filter((label) => label != null && typeof label !== "boolean")
  // Подпись связана с ползунком: без `aria-describedby` скринридер не
  // зачитывал ни комментарий, ни текст ошибки.
  const captionId = `${useStableId()}-caption`
  // Ошибку видно не только глазами: без `aria-invalid` скринридер объявляет
  // ползунок обычным, сколько бы красного вокруг ни нарисовали. Ставится на
  // сам `input role=slider`: корень — `role=group`, у которого атрибут не
  // поддерживается, а Thumb переносит на input лишь фиксированный набор
  // aria-атрибутов, поэтому — через его `inputRef`.
  const sliderInputRef = React.useRef<HTMLInputElement>(null)
  const setSliderInputRef = useComposedRefs(sliderInputRef, ref)
  React.useLayoutEffect(() => {
    const input = sliderInputRef.current
    if (!input) return
    if (invalid) input.setAttribute("aria-invalid", "true")
    else input.removeAttribute("aria-invalid")
  }, [invalid])

  return (
    // Исправление второго прохода: внешний зазор стоял gap-1.5 (6px), а
    // корневой кадр компонента в макете — это flex-col с одинаковым
    // gap-[4px] между Range, Indicators и Comment.
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <SliderPrimitive.Root
        data-slot="range-input"
        disabled={disabled}
        // `format` в Base UI НЕ передаётся: тот печатает им aria-valuetext
        // через `Intl`, и `style: "percent"` умножал значение на 100 —
        // ползунок на 50 звучал «5 000 %», а поле показывало «50 %» (ревью
        // 10.10, п. 17). Текст для скринридера собирает Thumb из той же
        // маски, что и поле значения (см. `getAriaValueText` ниже).
        // Разряды и запятая — по-русски при любой локали браузера.
        locale="ru-RU"
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(next, details) => change(next as number, details)}
        onValueCommitted={onValueCommitted}
        {...props}
      >
        <div
          data-slot="range-input-box"
          className={cn(
            // Фиксированная высота коробки (55px на десктопе и 47px на
            // мобильном, снято с прямоугольника в векторе макета) —
            // практически совпадает с собственной конвенцией L у Input
            // (h-12 и desktop:h-14). В прежней версии высоту определяли
            // отступы плюс завышенный кегль Value, и коробка раздувалась до
            // ~86px; повторять это не надо.
            // Исправление второго прохода: горизонтальный и верхний отступы
            // стояли desktop:px-5 desktop:pt-2.5 (20px и 10px) на десктопе,
            // а у символов Default и на Desktop, и на Mobile стоит
            // px-[16px] на обоих брейкпоинтах.
            //
            // Дизайн-чек №3 №19: «Наезд полосы на текст… в узком
            // представлении активизируется вариант mobile, и он собран не
            // pixel-perfect». Причин было две, обе в вертикали мобильной
            // коробки: (1) `pt-2` без нижнего отступа — Value доходил ровно
            // до нижней границы, по которой идёт полоса; в мастере отступы
            // асимметричные, pt-[7px]/pb-[5px] (7 + 16 + 20 + 5 = 48).
            // (2) `gap-1` между Label и Value — в обоих мастерах блок
            // Label/Value идёт без зазора, а 4px лишней высоты и выдавливали
            // текст на полосу. Десктоп: py-[8px] (8 + 16 + 24 + 8 = 56).
            "relative flex h-12 w-full flex-col justify-center rounded-[16px] border px-4 pt-[7px] pb-[5px] transition-colors desktop:h-14 desktop:py-2",
            "border-[var(--range-input-border)] bg-[var(--range-input-bg)]",
            "not-has-[[data-disabled]]:hover:border-[var(--range-input-border-hover)]",
            "not-has-[[data-disabled]]:has-[:focus-visible]:border-[var(--range-input-border-hover)]",
            "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:!border-[var(--range-input-border-disabled)] has-[[data-disabled]]:!bg-[var(--range-input-bg-disabled)]",
            // Коробка — поле ввода: курсор текста по всей площади, кроме
            // ползунка и дорожки (там свой).
            "not-has-[[data-disabled]]:cursor-text"
          )}
          // Клик по любому месту коробки (подпись, пустое поле справа от
          // числа) ставит каретку в поле значения — как у Input. Ползунок и
          // дорожка остаются за Base UI.
          onMouseDown={(event) => {
            const target = event.target as HTMLElement
            const field = valueFieldRef.current
            if (disabled || !field || target === field) return
            if (target.closest('[data-slot="range-input-control"]')) return
            event.preventDefault()
            focusValueField()
          }}
        >
          {hasNode(label) && (
            <SliderPrimitive.Label
              ref={labelRef}
              // Своя реакция Base UI на клик по подписи — фокус на ползунок.
              // Подпись поля ведёт в поле значения, как у Input.
              onClick={(event) => {
                event.preventBaseUIHandler()
                focusValueField()
              }}
              data-slot="range-input-label"
              // Одна строка с многоточием, как подпись Input: у коробки
              // фиксированная высота, и перенос длинной подписи ложился
              // поверх значения, а третья строка вылезала за рамку
              // (аудит 18). `overflow-clip` с запасом 4px, а не `truncate`:
              // тот срезает выступы глифов у края.
              className="min-w-0 overflow-clip text-ellipsis whitespace-nowrap text-p3-medium text-[var(--range-input-label-fg)] [overflow-clip-margin:4px]"
            >
              {label}
            </SliderPrimitive.Label>
          )}
          {/* Значение — поле ввода с маской (value-field.tsx): число
              набирается с клавиатуры, ползунок едет вслед. Разряды и знак —
              по правилам кита (value-mask.ts); копирование снимает разрядные
              пробелы, как и прежде. */}
          <RangeValueField
            value={value}
            min={min}
            max={max}
            step={step}
            spec={spec}
            disabled={disabled}
            describedBy={hasCaption ? captionId : undefined}
            inputRef={valueFieldRef}
            onType={(next, event) => change(next, typedChangeDetails(event))}
            onCommit={(next, event) => {
              // Отменённое изменение не фиксируется.
              if (change(next, typedChangeDetails(event))) {
                onValueCommitted?.(next, typedChangeDetails(event))
              }
            }}
          />
          {/* Дорожка лежит НА нижней рамке коробки, а не внутри отступов —
              подтверждено вырезкой из растра анатомии: таблетка ползунка
              заметно сидит верхом на рамке, половина внутри, половина
              снаружи. Control спозиционирован абсолютно по bottom-0 и
              сдвинут вниз на половину собственной высоты, чтобы линия
              дорожки пришлась ровно по центру рамки. */}
          <SliderPrimitive.Control
            data-slot="range-input-control"
            className="absolute inset-x-4 bottom-0 flex h-4 translate-y-1/2 items-center desktop:h-5"
          >
            <SliderPrimitive.Track
              data-slot="range-input-track"
              className={cn(
                // Исправление второго прохода: толщина дорожки стояла h-1
                // (4px), а ассет Line во всех состояниях — литеральный
                // прямоугольник высотой 3px.
                //
                // ⚠️ У дорожки НЕТ собственной заливки. Дизайн-чек
                // «Storybook 3», замечание 17: «скорректируй вид незаполненной
                // части, согласно компоненту». Профиль пикселей по мастеру
                // (состояние Default): под ползунком слева идёт полоса 3px
                // #2FCEEF, а справа от ползунка — чистый белый, и
                // единственная линия там это НИЖНЯЯ ГРАНИЦА самой коробки,
                // 1px #C8C8CB. То есть незаполненная часть не рисуется вовсе:
                // её роль играет граница поля, на которой дорожка и лежит.
                // Раньше здесь стояла заливка `--range-input-track-bg` —
                // серая полоса 3px поверх границы, вдвое толще нужного.
                "relative h-[3px] w-full rounded-full"
              )}
            >
              <SliderPrimitive.Indicator
                data-slot="range-input-indicator"
                className={cn(
                  // Исправление второго прохода: пипетка по скриншотам
                  // Default, Hover и Focused показывает, что заполненная
                  // часть дорожки (этот Indicator) неизменно #2FCEEF и
                  // отличается от #80E3FF у ползунка. Раньше она делила с
                  // ползунком --range-input-accent, и замер это
                  // опровергает. См. --range-input-indicator-bg.
                  "absolute h-full rounded-full bg-[var(--range-input-indicator-bg)]",
                  disabled && "!bg-[var(--range-input-accent-disabled)]",
                  invalid && "!bg-[var(--range-input-accent-error)]"
                )}
              />
              <SliderPrimitive.Thumb
                data-slot="range-input-thumb"
                aria-describedby={hasCaption ? captionId : undefined}
                // Скринридер слышит ровно то, что видно в поле: число по маске
                // и знак единицы («400 000 ₽», «50 %», «12 дн.»).
                getAriaValueText={(_formatted, current) =>
                  `${formatRangeValue(spec, current)}${spec.suffix}`
                }
                inputRef={setSliderInputRef}
                className={cn(
                  // Между двумя стрелками зазора нет, а радиус — литеральные
                  // 12px; и то и другое снято прямо со слоя Box у символов
                  // Range Line (мобильный — 32×16 без отступов, десктопный —
                  // px-4/py-2, что даёт 40×20). `gap-0.5` сжимал коробки
                  // значков по 16px, а `rounded-full` разрешался в 8px на
                  // мобильном и 10px на десктопе вместо 12px.
                  "top-1/2 flex h-4 w-8 -translate-y-1/2 items-center justify-center rounded-[12px] bg-[var(--range-input-accent)] outline-none transition-colors select-none desktop:h-5 desktop:w-10",
                  // Исправление второго прохода: убрана перекраска по
                  // наведению в --range-input-accent-hover. Пипетка по
                  // скриншоту состояния Hover всей коробки показывает, что
                  // ползунок остаётся #80E3FF; более тёмный синий постоянно
                  // принадлежит индикатору, а не ползунку при наведении
                  // (см. Indicator выше).
                  "focus-visible:focus-ring",
                  disabled && "!bg-[var(--range-input-accent-disabled)]",
                  invalid && "!bg-[var(--range-input-accent-error)]"
                )}
              >
                {/* size-4: в макете каждая маленькая стрелка лежит в своей
                    коробке 16px (сам глиф внутри неё 5.5×9). Прежний
                    size-2.5 ужимал обычный шеврон до 10px, и он выходил и
                    уже, и ниже, чем в макете. */}
                <ThumbArrow
                  direction="left"
                  className={cn(
                    "size-4 text-[var(--range-input-thumb-icon-fg)]",
                    // Исправление второго прохода: у символа Disabled в SVG
                    // стрелок стоит fill="white", а выключенное состояние
                    // раньше проваливалось в тёмный цвет значка по
                    // умолчанию.
                    disabled && "text-[var(--range-input-thumb-icon-fg-disabled)]",
                    invalid && "text-[var(--range-input-thumb-icon-fg-error)]"
                  )}
                />
                <ThumbArrow
                  direction="right"
                  className={cn(
                    "size-4 text-[var(--range-input-thumb-icon-fg)]",
                    disabled && "text-[var(--range-input-thumb-icon-fg-disabled)]",
                    invalid && "text-[var(--range-input-thumb-icon-fg-error)]"
                  )}
                />
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Track>
          </SliderPrimitive.Control>
        </div>
      </SliderPrimitive.Root>

      {/* Исправление второго прохода: раньше это была одна обёртка div с
          px-1 (4px). В макете ряды «Indicators» и «Comment» оба используют
          px-[16px], чтобы встать по внутренним отступам самой коробки, а у
          Indicators вдобавок есть собственный pt-[8px] поверх родительского
          gap-4, которого у Comment нет. Разделено на два соседних узла,
          чтобы отступы каждого ряда совпадали со своим оригиналом
          независимо. */}
      {scale.length > 0 && (
        <div className="flex items-center justify-between px-4 pt-2 text-p3-medium text-[var(--range-input-scale-fg)]">
          {scale.map((scaleLabel, index) => (
            <span key={index}>{scaleLabel}</span>
          ))}
        </div>
      )}
      {hasCaption && (
        <p
          id={captionId}
          className={cn(
            // `break-words`: неразрывное слово (номер договора, имя файла)
            // переносится внутри подписи, а не выходит за поле (аудит 18).
            "px-4 text-p3-medium break-words",
            invalid
              ? "text-[var(--range-input-caption-error-fg)]"
              : "text-[var(--range-input-caption-fg)]"
          )}
        >
          {caption}
        </p>
      )}
    </div>
  )
})

export { RangeInput }
export type { RangeInputProps }
