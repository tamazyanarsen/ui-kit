import * as React from "react"
import { Info } from "@/icons"

import { cn } from "@/lib/utils"
import { NoOrphan } from "@/lib/no-orphan"
import { Tooltip } from "@/components/ui/tooltip"

import { CopyButton } from "./copy-button"

// Item.Information Field — «Текстовое поле»: строка «подпись + значение»
// только для чтения, показывает информацию, с которой пользователь не
// взаимодействует и которую не редактирует (так сказано в самом макете).
// Отличается от ./item, который всегда интерактивная строка.
//
// Четыре раскладки (свойство «Type» в макете):
// - label-left (по умолчанию): подпись слева, значение справа, обе в одну
//   строку. Каждая получает равную долю flex-1, подпись ограничена 384px,
//   чтобы длинная не ужала значение ниже его доли; обе выровнены по левому
//   краю внутри своей половины (дизайн-чек, замечание 33: раньше случайный
//   ml-auto прижимал значение к правому краю строки). Это единственный тип
//   с отступами и разделителем: `pt-16 / pb-15 / линия 1px`, потому что по
//   «Правилу отступов (Label Left)» идущие подряд поля стыкуются вплотную,
//   и разделяет их именно линия.
// - label-line: та же однострочная раскладка, но подпись ограничена 216px,
//   отступов и разделителя нет — идущие подряд поля разводит на 16px сам
//   контейнер («Правило отступов (Line)»).
// - label-top: подпись над значением (компактно, для тесных мест), 4px
//   между тремя строками, контейнер тоже разводит поля на 16px.
// - large-value: та же вертикальная укладка, значение в H2 (32/44) «для
//   вывода фактоида», строки вплотную (0px), значок копирования 24px.
// SubText, если он есть, всегда рисуется под значением.

type FieldType = "label-left" | "label-line" | "label-top" | "large-value"
type FieldStatus = "default" | "success" | "error" | "attention" | "information"

const VALUE_COLOR: Record<FieldStatus, string> = {
  default: "text-[var(--ifield-value-fg)]",
  success: "text-[var(--ifield-success-fg)]",
  error: "text-[var(--ifield-error-fg)]",
  attention: "text-[var(--ifield-attention-fg)]",
  information: "text-[var(--ifield-information-fg)]",
}

const SUBTEXT_COLOR: Record<Exclude<FieldStatus, "information">, string> = {
  default: "text-[var(--ifield-subtext-fg)]",
  success: "text-[var(--ifield-success-fg)]",
  error: "text-[var(--ifield-error-fg)]",
  attention: "text-[var(--ifield-attention-fg)]",
}

interface ItemInformationFieldProps {
  type?: FieldType
  label: React.ReactNode
  value: React.ReactNode
  copyValue?: string
  subText?: React.ReactNode
  valueStatus?: FieldStatus
  subTextStatus?: Exclude<FieldStatus, "information">
  labelInfo?: React.ReactNode
  valueInfo?: React.ReactNode
  copyable?: boolean
  /**
   * Разделитель под строкой (только у типа Label Left).
   *
   * Три состояния: `undefined` — «как в списке» (линии нет у последней
   * строки, правило `:last-child` в styles/base.css), `true`/`false` —
   * явное решение вызывающего, оно сильнее правила списка. Причина та же,
   * что у `Item.divider` (дизайн-чек от 07.09, замечание 20).
   */
  divider?: boolean
  className?: string
}

// Дизайн-чек №31: иконка информации рендерится ВНУТРИ текстового потока, а
// не отдельной flex-колонкой рядом с ним. «Текст не должен уходить в
// многоточие после одной строки… вместо этого иконка информации должна
// ставиться после последнего символа в последней строке с пробелом 8
// пикселей от неё. Соответственно, иконка должна располагаться inline».
//
// В мастере иконка лежит в строке `Label` (`flex gap-[8px] items-end`) —
// те самые 8px и выравнивание по низу строки. Для
// однострочного случая inline-элемент по baseline даёт тот же результат
// (Figma держит глиф в боксе с 2px сверху и 6px снизу внутри 24px-строки,
// а baseline 16px-текста как раз проходит в 16px от верха строки — отсюда
// поправка в 2px). Разница только в многострочном случае, который в
// документации не нарисован: flex-колонка прижала бы иконку к правому краю
// текстового блока, а inline честно едет за последним символом.
//
// Крупная строка (H2, 44px) в макете имеет `pb-[18px]`, то есть глиф стоит
// на 4px выше baseline — отсюда отрицательный сдвиг.
function InfoIcon({
  content,
  large = false,
}: {
  content: React.ReactNode
  large?: boolean
}) {
  return (
    // ⚠️ Значок-подсказка стоит ИНЛАЙНОМ внутри переносимого текста, поэтому
    // на узких ширинах он уезжал на новую строку один: у подписи это
    // случалось на 45 ширинах из 301, у значения — на 36.
    //
    // `NoOrphan` — ОТДЕЛЬНАЯ обёртка вокруг коробки значка, а не её замена:
    // сам значок `inline-flex`, то есть атомарный инлайновый бокс, и перед
    // таким боксом у браузера своя точка переноса. Слить их в один узел —
    // значит оставить эту точку снаружи, и приём перестаёт работать
    // (замерено: 24 одиноких значка из 271 ширины вместо нуля).
    <NoOrphan>
      <span
        className={cn(
          // Зазор 8 складывается из неразрывного пробела спейсера (~4) и
          // этих 4.
          "relative ml-1 inline-flex shrink-0 align-baseline",
          large ? "top-[-4px]" : "top-[2px]"
        )}
      >
        <Tooltip content={content}>
          <button
            type="button"
            aria-label="Информация"
            // Дизайн-чек от 07.09, замечание 19: значок отзывается на
            // наведение сам, а не только всплывающей через 400 мс
            // подсказкой — иначе он читается как нарисованный.
            className="flex size-4 shrink-0 cursor-help items-center justify-center text-[var(--ifield-icon-fg)] outline-none transition-colors hover:text-[var(--ifield-icon-fg-hover)] focus-visible:focus-ring"
          >
            <Info aria-hidden="true" className="size-4" />
          </button>
        </Tooltip>
      </span>
    </NoOrphan>
  )
}

function ItemInformationField({
  type = "label-left",
  label,
  value,
  copyValue,
  subText,
  valueStatus = "default",
  subTextStatus = "default",
  labelInfo,
  valueInfo,
  copyable = false,
  divider,
  className,
}: ItemInformationFieldProps) {
  const large = type === "large-value"
  // Строку и число можно копировать как есть; разметку — только по её
  // видимому тексту (см. `CopyButton`).
  const plainValue =
    typeof value === "string" || typeof value === "number" ? String(value) : undefined
  // Только Label Left и Line ставят подпись рядом со значением, и только
  // от `desktop:` и выше: при Size=Mobile все типы укладываются
  // вертикально.
  const sideBySide = type === "label-left" || type === "label-line"

  // Подпись идёт в Medium, как и значение, — различаются они только цветом,
  // — и вместе с ним опускается до 14/20 на мобильном.
  // `break-words` — это `[word-break:break-word]` мастера: и Label, и Value
  // там переносятся, а не обрезаются.
  // Заодно это чинит вторую половину дизайн-чека №31 — длинное значение
  // (например ИНН из семидесяти цифр одной строкой) больше не уезжает в
  // правый край и не перекрывает иконку копирования: сплошной «слово» без
  // пробелов теперь переносится.
  //
  // `[overflow-wrap:anywhere]`, а не `break-words`: колонка значения —
  // `items-start`, строка в ней берёт ширину по содержимому, а `break-word`
  // не уменьшает минимальную ширину. В узкой десктопной колонке слово
  // «корпоративного» не переносилось и выталкивало строку за поле (аудит 21).
  // `anywhere` рвёт слово, только когда оно одно не помещается в строку.
  const labelRow = (
    <span className="block min-w-0 [overflow-wrap:anywhere] text-p2-medium text-[var(--ifield-label-fg)] desktop:text-p1-medium">
      {label}
      {labelInfo && <InfoIcon content={labelInfo} />}
    </span>
  )

  const valueRow = (
    <span
      className={cn(
        // text-h2 (32/44) уже несёт в себе насыщенность 500, поэтому
        // отдельный font-medium ему не нужен — в отличие от ветки text-p1,
        // которой он нужен. На мобильном: 22/30 у большого значения и
        // 14/20 у остальных.
        "block min-w-0 [overflow-wrap:anywhere]",
        large ? "text-h2-mobile desktop:text-h2" : "text-p2-medium desktop:text-p1-medium",
        VALUE_COLOR[valueStatus]
      )}
    >
      {/* Обёртка — источник текста для копирования, если `copyValue` нет. */}
      <span data-slot="item-information-field-value">{value}</span>
      {valueInfo && <InfoIcon content={valueInfo} large={large} />}
    </span>
  )

  // Не `subText && …`: 0 — значение (комиссия, остаток), а так он выводился
  // голой цифрой без своей строки и цвета.
  const subTextRow = subText != null && subText !== false && subText !== "" && (
    <span
      className={cn(
        "text-p3-medium desktop:text-p2-medium",
        SUBTEXT_COLOR[subTextStatus]
      )}
    >
      {subText}
    </span>
  )

  return (
    <div
      data-slot="item-information-field"
      data-type={type}
      data-divider={divider === undefined ? undefined : divider ? "on" : "off"}
      className={cn(
        // Зазор нужен только стопочным типам: у них значок копирования —
        // сосед всего блока. У «Label Left»/«Line» он внутри колонки значения
        // и свой зазор берёт оттуда.
        "flex items-start",
        !sideBySide && "gap-4",
        // Отступы и разделительную линию имеет только строка Label Left;
        // остальные три — голое содержимое, которое контейнер сам разводит
        // на 16px.
        type === "label-left" && "border-b pt-4 pb-[15px]",
        type === "label-left" &&
          (divider === false
            ? "border-transparent"
            : "border-[var(--ifield-divider)]"),
        className
      )}
    >
      {/* Один DOM на оба брейкпоинта: подпись всегда первый потомок этой
          группы — на мобильном она стоит над значением, а от `desktop:` и
          выше у двух «рядоположенных» типов превращается в левую
          колонку. */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-1",
          sideBySide && "desktop:flex-row desktop:items-start desktop:gap-6",
          type === "label-top" && "desktop:gap-1",
          large && "desktop:gap-0"
        )}
      >
        {/* Коробка подписи: равная доля строки, но не шире 384px (Label
            Left) или 216px (Line) и не уже 100px. Эти ширины начинают
            действовать только тогда, когда подпись *становится* колонкой. */}
        <span
          className={cn(
            "min-w-0",
            sideBySide && "desktop:min-w-25 desktop:flex-1",
            type === "label-left" && "desktop:max-w-96",
            type === "label-line" && "desktop:max-w-54"
          )}
        >
          {labelRow}
        </span>
        {/* Колонка значения. У типов «Label Left» и «Line» значок копирования
            живёт ВНУТРИ неё, а не рядом со всей строкой.

            ⚠️ Это и есть правка по дизайн-чеку от 08.09, замечание 1
            («Смещение левого края значений в information field из-за правого
            элемента. Левый край значений постоянный»). Пока значок был
            соседом группы «подпись + значение», он забирал ширину у ВСЕЙ
            группы: колонка значения (`flex-1`) сжималась, и её левый край
            уезжал — строки с копированием и без него не выстраивались в одну
            вертикаль. В мастере структура другая:
            `Content = [Label, Value]`, а `Value = [Text, Copy]`, то есть
            значок отъедает место только у самого значения.

            У «Label Top» и «Large Value» значок в мастере, наоборот, сосед
            всего текстового блока (`pt-30`) — там подпись
            стоит НАД значением, и колонок нет вовсе, смещать нечего. */}
        <div
          className={cn(
            "flex min-w-0 items-start gap-4",
            sideBySide && "desktop:flex-1"
          )}
        >
          <div
            className={cn(
              // Значение и Sub Text разведены на 4px на мобильном (2px под
              // большим значением) и стоят вплотную на десктопе — кроме
              // Label Top, который и там держит 4px.
              "flex min-w-0 flex-1 flex-col items-start gap-1",
              large && "gap-0.5 desktop:gap-0",
              sideBySide && "desktop:gap-0",
              type === "label-top" && "desktop:gap-1"
            )}
          >
            {valueRow}
            {subTextRow}
          </div>

          {copyable && sideBySide && (
            <CopyButton
              copyValue={copyValue ?? plainValue}
              type={type}
            />
          )}
        </div>
      </div>

      {copyable && !sideBySide && (
        <CopyButton
          copyValue={copyValue ?? plainValue}
          type={type}
        />
      )}
    </div>
  )
}

export { ItemInformationField }
export type { ItemInformationFieldProps, FieldType, FieldStatus }
