import * as React from "react"
import { CircleCheck, CircleX, Clock, FileIcon } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"

import { SIGNATORY_STATUS_COLOR, STATUS_TAG_COLOR, type EventStatus } from "./variants"

// Event — «Событие»: одна строка ленты истории изменений документа или
// статуса (по замечанию об использовании в самом макете она рисуется
// списком внутри готового `Modal`, а этот компонент — только строка).
// Фиксирует одно действие пользователя или перемещение документа *внутри*
// одного статуса, не меняя общего этапа. `type="tag"` рисует заголовок
// цветной таблеткой статуса (по макету только для ЕЛК: логика истории
// статусов к другим продуктам не применяется), `type="text"` — обычное
// умолчание. Каждый раздел под заголовком (автор, подписанты, сведения,
// комментарий, документы, кнопка) необязателен и просто не рисуется, если
// данных нет, — та же схема, что у переключателей «Show X» в Card и
// Banner.
interface EventSignatory {
  /**
   * Свойство `Type` вложенного `Signatories (ELK)`: Done — подписано,
   * Partial — ждёт подписи, Cancel — отказ.
   *
   * Дизайн-чек Storybook (Аня Багрова) №31: третьего значения в коде не
   * было вовсе, из панели его было не достать.
   */
  status: "success" | "attention" | "error"
  name: React.ReactNode
  // Дизайн-чек, замечание 21: в собственном примере подписанта из макета
  // после имени идёт второй, более светлый признак (например, «Петров П.П.
  // – Первая подпись»). Раньше он был запечён в один обычный узел `text`,
  // и задать ему цвет, отличный от имени, было нечем.
  attribute?: React.ReactNode
}

interface EventInfoRow {
  label: React.ReactNode
  value: React.ReactNode
}

interface EventDocument {
  name: React.ReactNode
  meta: React.ReactNode
  onClick?: () => void
}

/**
 * Свойство `Type` вложенного `Step Event (ELK)` — где строка стоит в
 * цепочке: First (только линия вниз), Middle (линии вверх и вниз), End
 * (только линия вверх).
 */
type EventStepType = "first" | "middle" | "end"

/** Есть что показать: 0 — значение, а `null`, `false` и `""` — нет. */
const hasValue = (node: React.ReactNode) =>
  node != null && node !== false && node !== ""

/** Без пустых элементов: массив собирают условиями, и `null` в нём — обычное дело. */
const present = <T,>(items: (T | null | undefined | false)[] | undefined): T[] =>
  (items ?? []).filter((item): item is T => item != null && item !== false)

interface EventProps {
  type?: "text" | "tag"
  stepType?: EventStepType
  title: React.ReactNode
  status?: EventStatus
  timestamp?: React.ReactNode
  author?: React.ReactNode
  signatories?: (EventSignatory | null | false)[]
  info?: (EventInfoRow | null | false)[]
  commentLabel?: React.ReactNode
  comment?: React.ReactNode
  documents?: (EventDocument | null | false)[]
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  showConnector?: boolean
  className?: string
}

function Event({
  type = "text",
  stepType,
  title,
  status = "attention",
  timestamp,
  author,
  signatories,
  info,
  commentLabel = "Комментарий:",
  comment,
  documents,
  buttonLabel,
  onButtonClick,
  showConnector = true,
  className,
}: EventProps) {
  // `stepType` — свойство макета, `showConnector` — прежний булев проп той же
  // оси. Задан явный тип шага — он и решает.
  const signatoryList = present(signatories)
  const infoRows = present(info)
  const documentList = present(documents)
  const step: EventStepType = stepType ?? (showConnector ? "first" : "end")
  const lineAbove = step !== "first"
  const lineBelow = step !== "end"

  return (
    <div data-slot="event" data-step={step} className={cn("flex gap-2", className)}>
      <div className="flex w-2 shrink-0 flex-col items-center">
        {lineAbove && (
          // Дизайн-чек от 13.09, замечание 8: «Event — слишком низко стоит
          // круг в версии без коннектора». Отрезок был `h-2` (8px), и вместе
          // со своим зазором 5px он опускал круг на 13px, тогда как без
          // отрезка круг стоит на 8px. То есть «слишком низко» было у всех
          // шагов, КРОМЕ First, — а заметно это на строке «Без коннектора»
          // (`Type=End`), где сверху отрезок есть, а снизу нет.
          //
          // Отрезок = 3px: столько и написано в «Step Event (ELK)» (обрубок
          // коннектора), и ровно с ним 3 + 5 сходятся в те же 8px. Теперь
          // круг стоит на середине строки заголовка при любом шаге: тег 22 →
          // (22 − 8) / 2 = 7, текст 24 → (24 − 8) / 2 = 8.
          <span
            aria-hidden="true"
            className="h-[3px] w-px shrink-0 rounded-b-[4px] bg-[var(--event-connector)]"
          />
        )}
        <span
          aria-hidden="true"
          // Круг опущен на 8px от верха строки — это середина высоты текста
          // заголовка (24) и практически середина тега (22). Стоящий выше
          // обрубок коннектора занимает 3 из этих 8, поэтому собственный
          // отступ круга там 5.
          className={cn(
            "size-2 shrink-0 rounded-full bg-[var(--event-connector)]",
            lineAbove ? "mt-[5px]" : "mt-2"
          )}
        />
        {lineBelow && (
          <span
            aria-hidden="true"
            className="mt-[5px] w-px flex-1 rounded-t-[4px] bg-[var(--event-connector)]"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            {/* Дизайн-чек №29: тег здесь desktop-размера (22px), а не
                mobile-огрызок. В мастере `Head Event (ELK)`, вариант
                `Type=Status` инстанс `ELK / tag`
                замеряется как min/max-h 22px с текстом P2 Medium 14/20 —
                это ровно Size=Desktop. Раньше это форсировалось пропом
                `size="l"`; после дизайн-чека №3 №1 размера как пропа нет,
                и тег берёт форму из общего скоупа вместе с самим Event. */}
            {type === "tag" ? (
              <Tag color={STATUS_TAG_COLOR[status]}>
                {title}
              </Tag>
            ) : (
              <span className="min-w-0 text-p1-medium [overflow-wrap:anywhere] text-[var(--event-title-fg)]">
                {title}
              </span>
            )}
            {hasValue(timestamp) && (
              <span className="shrink-0 text-p2-medium text-[var(--event-meta-fg)]">
                {timestamp}
              </span>
            )}
          </div>

          {hasValue(author) && (
            // В мастере строка автора — `whitespace-nowrap` + ellipsis, а не
            // перенос: длинное «ФИО • должность» обрезается многоточием.
            <p className="truncate text-p1-medium text-[var(--event-author-fg)]">
              {author}
            </p>
          )}
        </div>

        {signatoryList.length > 0 && (
          <div className="flex flex-col gap-2">
            {signatoryList.map((signatory, index) => {
              const Icon =
                signatory.status === "success"
                  ? CircleCheck
                  : signatory.status === "error"
                    ? CircleX
                    : Clock
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-p1-medium"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    style={{ color: SIGNATORY_STATUS_COLOR[signatory.status] }}
                  />
                  {/* Мастер `Signatory`: `whitespace-nowrap`, имя и подпись в
                      одну строку, хвост обрезается многоточием. */}
                  <span className="min-w-0 flex-1 truncate text-[var(--event-title-fg)]">
                    {signatory.name}
                    {hasValue(signatory.attribute) && (
                      <span className="text-[var(--event-meta-fg)]">
                        {" "}
                        – {signatory.attribute}
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Каждая строка сведений в мастере — двухколоночный flex
            (`I-1`, `I-2`, `I-3`: `flex gap-[4px] items-start`, подпись
            `shrink-0 whitespace-nowrap`, значение `flex-[1_0_0]`), а не
            один строчный абзац. Поэтому значение, достаточно длинное для
            переноса, остаётся в своей колонке, а не убегает обратно под
            подпись. */}
        {infoRows.length > 0 && (
          <div className="flex flex-col gap-1 text-p1-medium">
            {infoRows.map((row, index) => (
              <div key={index} className="flex items-start gap-1">
                <span className="shrink-0 whitespace-nowrap text-[var(--event-meta-fg)]">
                  {row.label}
                </span>
                <span className="min-w-0 flex-1 [overflow-wrap:anywhere] text-[var(--event-title-fg)]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {hasValue(comment) && (
          <div className="text-p1-medium">
            {/* Подпись — nowrap + ellipsis, текст комментария переносится
                (мастер `Comment`). */}
            <p className="truncate text-[var(--event-meta-fg)]">{commentLabel}</p>
            <p className="[overflow-wrap:anywhere] text-[var(--event-title-fg)]">{comment}</p>
          </div>
        )}

        {documentList.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="truncate text-p1-medium text-[var(--event-meta-fg)]">
              Приложенные документы:
            </p>
            {/* Не больше двух колонок, и вторая — только когда каждой
                достаётся от 240px: считается по ширине самого блока, а не по
                экрану (`sm:`, аудит 14) и не по форме кита. Контейнерный
                запрос (r15) для этого не годится: `container-type` обнуляет
                ширину по содержимому, и Event в контейнере по содержимому
                (inline-block, колонка грида auto) сжимался до ~230px и резал
                имена файлов (аудит 15, тот же урок, что Informer в r9). */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(max(min(100%,240px),calc((100%_-_1rem)/2)),1fr))] gap-4">
              {documentList.map((doc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={doc.onClick}
                  // `pr-4`, а не `p-1`: строка `ELK / files` в мастере —
                  // это `gap-[16px] items-center pr-[16px]` без отступов с
                  // трёх остальных сторон, чтобы плитка 48px встала по
                  // подписи «Приложенные документы:» над ней. Равномерный
                  // отступ 4px выталкивал её из этой колонки.
                  className="flex items-center gap-4 overflow-hidden rounded-[8px] pr-4 text-left outline-none focus-visible:focus-ring"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[var(--event-file-bg)]">
                    {/* В макете здесь вложена та же строка `ELK / files`,
                        что и у File Upload, поэтому в плитке лежит
                        `icon / document` размером 24px, а не глиф FileText,
                        который стоял тут раньше. */}
                    <FileIcon
                      size={24}
                      aria-hidden="true"
                      className="size-6 text-[var(--event-title-fg)]"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-p1-medium text-[var(--event-title-fg)]">
                      {doc.name}
                    </span>
                    <span className="truncate text-p3-medium text-[var(--event-meta-fg)]">
                      {doc.meta}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {hasValue(buttonLabel) && (
          <div className="pt-1">
            <Button
              type="button"
              variant="secondary-grey"
              size="sm"
              onClick={onButtonClick}
              className="self-start"
            >
              {buttonLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { Event }
export type { EventStepType, EventProps, EventSignatory, EventInfoRow, EventDocument }
