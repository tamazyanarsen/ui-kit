import * as React from "react"

/**
 * Держать узел в разметке, пока играет анимация ухода.
 *
 * Появление анимируется само собой — узел монтируется и кадры идут с первого
 * рендера. С уходом так нельзя: закрытый узел снимается из разметки сразу же,
 * и анимировать становится нечего. Хук отодвигает снятие на длительность
 * ухода и заодно отдаёт состояние для `data-state`.
 *
 * Заведён по дизайн-чеку от 13.09, замечание 17 («Нет анимации
 * появления/исчезновения меню»).
 *
 * ⚠️ `prefers-reduced-motion` тут НЕ учитывается намеренно: длительность живёт
 * в CSS (там же, где и сама анимация), и вычитать её второй раз в JS значило
 * бы завести второй источник одной величины. При выключенном движении
 * анимация просто не играет, а узел лишний раз подержится в разметке —
 * увидеть это нельзя.
 */
function usePresence(open: boolean, exitMs: number) {
  const [present, setPresent] = React.useState(open)

  React.useEffect(() => {
    if (open) {
      setPresent(true)
      return
    }
    if (!present) return
    const timer = setTimeout(() => setPresent(false), exitMs)
    return () => clearTimeout(timer)
  }, [open, present, exitMs])

  return {
    /** Рисовать ли узел вообще. */
    present,
    /** Значение для `data-state` — по нему CSS выбирает набор кадров. */
    state: open ? ("open" as const) : ("closed" as const),
  }
}

export { usePresence }
