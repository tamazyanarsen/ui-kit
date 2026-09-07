import { millions } from "../../shell"

// Показатель отчёта: подпись, полоса и строка «значение — процент от плана».
//
// ⚠️ Полоса НЕ переполняется. 105,7 % от плана рисуется ПОЛНОЙ полосой, а
// правду говорит число рядом — расхождение с эталоном, разрешённое на
// сборке: полоса шире карточки ломала бы сетку блока, а показатель «сверх
// плана» и так читается числом.
//
// Это не `ProgressBar` кита: у того полоса 8px с закруглением, своя строка
// статуса и цвет по диапазону. Здесь полоса 4px, цвет один на весь экран
// (см. ниже) и подпись стоит НАД полосой, а не над ней и под ней.

interface ReportMetricProps {
  title: string
  /** Значение в млн ₽. */
  value: number
  /** Процент от плана. Может быть больше 100. */
  percent: number
  /** Хвост правой подписи. По умолчанию «от плана». */
  note?: string
}

function ReportMetric({
  title,
  value,
  percent,
  note = "от плана",
}: ReportMetricProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-p3-regular text-[var(--grey-284)]">{title}</span>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--progress-track-bg)]">
        <div
          aria-hidden="true"
          className="h-full bg-[var(--progress-step-fill)]"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-p2-medium text-[var(--grey-1514)]">
          {millions(value)}
        </span>
        <span className="text-p3-regular text-[var(--grey-284)]">
          {percent.toLocaleString("ru-RU", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          % {note}
        </span>
      </div>
    </div>
  )
}

export { ReportMetric }
export type { ReportMetricProps }
