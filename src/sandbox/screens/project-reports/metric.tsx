import { ProgressBar } from "@/components/ui/progress-bar"

import { millions } from "../../shell"

// Показатель отчёта: подпись, полоса и строка «значение — процент от плана».
//
// ⚠️ Полоса НЕ переполняется. 105,7 % от плана рисуется ПОЛНОЙ полосой, а
// правду говорит число рядом — расхождение с эталоном, разрешённое на
// сборке: полоса шире карточки ломала бы сетку блока, а показатель «сверх
// плана» и так читается числом.
//
// ⚠️ Раньше здесь была СВОЯ полоса 4px — «ответвление» от кита. Дизайн-чек от
// 08.09, замечание 22: «Некорректная толщина штриха Progress Bar. Взять
// точную из компонента, а такое ответвление удалить». Взят вариант
// `timeline` кита: у него ровно та же анатомия — подпись сверху, полоса,
// строка «значение / описание», — и толщина 8px из мастера, а не подобранная
// на глаз.
//
// `statusTimeline="process"` фиксирует цвет: штатное правило кита красит
// полосу по диапазону (до 50 зелёная, дальше жёлтая, со 100 красная), а на
// этом экране все показатели одного цвета — «выполнено столько-то», а не
// «плохо/хорошо».

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
    <ProgressBar
      variant="timeline"
      statusTimeline="process"
      title={title}
      showDescription={false}
      value={Math.min(percent, 100)}
      subtitle={millions(value)}
      statusDescription={`${percent.toLocaleString("ru-RU", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}% ${note}`}
    />
  )
}

export { ReportMetric }
export type { ReportMetricProps }
