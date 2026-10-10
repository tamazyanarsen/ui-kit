import * as React from "react"

/** Полночь того же дня по местному времени. */
function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * «Сегодня» для календаря — ПОЛНОЧЬ текущего дня, обновляемая при смене суток.
 *
 * Ревью 10.10, п. 14. Две ошибки прежнего `useMemo(() => new Date(), [])`:
 *
 *  1. Время суток. Сетка отдаёт в `disabledDate` полночные даты, а «сегодня»
 *     уходило туда с текущим временем: `d > maxDate` при `maxDate` = сегодня
 *     00:00 считал сегодняшний день выключенным только на этом пути, и
 *     остановка Tab вставала на 1-е число месяца вместо сегодняшнего.
 *  2. Сутки не менялись. Долгоживущий календарь (`layout="sheet"`, открытый
 *     на экране) после полуночи подсвечивал вчерашний день.
 *
 * Таймер ставится на следующую полночь и перезапускается после неё. Спящая
 * вкладка может разбудить его позже — тогда пересчёт случится при первом
 * срабатывании, и значение снова верное.
 */
function useToday(): Date {
  const [today, setToday] = React.useState(() => startOfDay(new Date()))

  React.useEffect(() => {
    const now = new Date()
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    // Новый объект и при той же дате (часы сдвинули назад): эффект
    // перезапустится и поставит таймер заново, а не замолчит навсегда.
    const timer = setTimeout(
      () => setToday(startOfDay(new Date())),
      next.getTime() - now.getTime() + 1000
    )
    return () => clearTimeout(timer)
  }, [today])

  return today
}

export { startOfDay, useToday }
