import * as React from "react"
// У ползунка свои маленькие стрелки из макета, а не обычные шевроны — см.
// icons/arrow-right-small.tsx о том, почему они не взаимозаменяемы.
import { ArrowLeftSmall, ArrowRightSmall } from "@/icons"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { useComposedRefs } from "@/lib/compose-refs"
import { resolveCaption } from "@/components/ui/input/caption"
import { GROUP_SPACES, formatSignSpacing } from "@/lib/number-format"
import { useCopyWithoutSeparators } from "@/lib/use-copy-without-separators"

interface RangeInputOwnProps {
  label?: React.ReactNode
  comment?: React.ReactNode
  /** Строка — текст ошибки; `true` — только состояние ошибки, без текста. */
  error?: React.ReactNode
  scaleLabels?: React.ReactNode[]
  format?: Intl.NumberFormatOptions
}

type RangeInputProps = Omit<SliderPrimitive.Root.Props<number>, "children" | "ref"> &
  RangeInputOwnProps

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
  disabled,
  ...props
}, ref) {
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
  const captionId = `${React.useId()}-caption`
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
  // Разрядный пробел — отбивка по 3 разряда, а не символ значения: в буфер
  // уходит «5000000», а не «5 000 000».
  const copyWithoutSeparators = useCopyWithoutSeparators(GROUP_SPACES)

  return (
    // Исправление второго прохода: внешний зазор стоял gap-1.5 (6px), а
    // корневой кадр компонента в макете — это flex-col с одинаковым
    // gap-[4px] между Range, Indicators и Comment.
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <SliderPrimitive.Root
        data-slot="range-input"
        disabled={disabled}
        format={format}
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
            "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:!border-[var(--range-input-border-disabled)] has-[[data-disabled]]:!bg-[var(--range-input-bg-disabled)]"
          )}
        >
          {hasNode(label) && (
            <SliderPrimitive.Label
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
          {/* Значение проходит через общий модуль формата чисел, а не
              отдаётся ICU как есть. Две правки, обе сквозные:

              • отбивка знака НЕ одна на все — `%`, `‰`, `°` набираются
                вплотную к числу («50%»), а знак валюты через неразрывный
                пробел («1 200 000 ₽»). ICU для `ru-RU` отбивает пробелом
                всё подряд;
              • разрядный пробел приводится к одному символу: ICU в части
                сборок отдаёт узкий неразрывный, и снятие разрядов при
                копировании по нему промахивается.

              Копирование значения ползунка разряды снимает: «5 000 000» →
              «5000000» (см. `useCopyWithoutSeparators`). */}
          <SliderPrimitive.Value
            data-slot="range-input-value"
            {...copyWithoutSeparators}
            className={cn(
              // Десктопный символ в макете задаёт Label = P3 Medium 12/16
              // и Value = P1 Medium 16/24. Раньше у обоих стоял
              // `leading-tight`, то есть 15px и 17.5px — мимо шкалы вовсе.
              "text-p2-medium text-[var(--range-input-value-fg)] desktop:text-p1-medium",
              disabled && "!text-[var(--range-input-value-fg-disabled)]"
            )}
          >
            {/* `formattedValues` — массив: у диапазона два конца. Склейка та
                же, что у Base UI по умолчанию (тире с пробелами). */}
            {(formattedValues) =>
              formattedValues.map(formatSignSpacing).join(" – ")
            }
          </SliderPrimitive.Value>
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
                <ArrowLeftSmall
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
                <ArrowRightSmall
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
