import * as React from "react"

import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"

/* Дизайн-чек 3/3 №9: «Title: заголовок ограничен одной строкой». По макету
   (33102:196681) заголовок страницы занимает ДО ДВУХ строк, дальше режется
   многоточием, и — только если многоточие реально появилось — при наведении
   показывает Tooltip с полным текстом.

   Раньше здесь стоял `truncate` (`white-space: nowrap` + одна строка), из-за
   чего вторая строка не появлялась никогда. Замена на `line-clamp-2` даёт
   две строки и многоточие, а факт обрезки приходится измерять в рантайме:
   CSS не умеет отвечать «сработал ли line-clamp», а вешать Tooltip
   безусловно нельзя — он всплывал бы и над коротким заголовком.

   Обёртка `Tooltip` монтируется всегда и просто держится закрытой, пока
   обрезки нет (`disabled`): условный рендер самой обёртки перемонтировал бы
   заголовок в момент смены ширины окна — тот же приём, что у поля ввода в
   input/hover-tooltip.tsx. */

/** Обрезан ли текст внутри элемента по вертикали (сработал ли line-clamp). */
function useIsClamped(ref: React.RefObject<HTMLElement | null>, key: unknown) {
  const [clamped, setClamped] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    // +1px — запас на субпиксельные метрики: у помещающегося текста
    // scrollHeight бывает больше clientHeight на доли пикселя.
    const check = () => setClamped(el.scrollHeight > el.clientHeight + 1)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, key])

  return clamped
}

interface TitleHeadingProps {
  children: React.ReactNode
  className?: string
}

/** H2-заголовок страницы: максимум две строки, полный текст — в Tooltip. */
function TitleHeading({ children, className }: TitleHeadingProps) {
  const ref = React.useRef<HTMLHeadingElement>(null)
  // Ключ пересчёта — сам текст: смена заголовка не меняет размеров бокса,
  // поэтому ResizeObserver об этом не узнает.
  const clamped = useIsClamped(ref, children)

  return (
    <Tooltip
      content={children}
      direction="top-center"
      disabled={!clamped}
    >
      <h1
        ref={ref}
        className={cn(
          "line-clamp-2 min-w-0 flex-1 text-h2 text-[var(--title-fg)]",
          className
        )}
      >
        {children}
      </h1>
    </Tooltip>
  )
}

export { TitleHeading }
