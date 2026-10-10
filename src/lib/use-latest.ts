import * as React from "react"

/** `useLayoutEffect` в браузере, `useEffect` на сервере — без предупреждения React. */
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/**
 * Ref с последним значением — для колбэков, которые читаются из
 * обработчиков событий, таймеров и подписок, но не должны перезапускать
 * эффекты, когда родитель передаёт новую функцию на каждом рендере.
 *
 * Значение пишется в layout-эффекте, а не в теле рендера. Запись во время
 * рендера (`ref.current = value`) — побочный эффект: отрисовка, которую React
 * начал и бросил (concurrent-режим, двойной рендер StrictMode), оставляла в
 * ref колбэк от незафиксированного рендера (ревью 10.10, КК-5). Layout-эффект
 * отрабатывает до того, как браузер передаст управление обработчикам, так
 * что любой обработчик видит колбэк последнего зафиксированного рендера.
 *
 * ⚠️ Только для чтения ВНЕ рендера. Читать такой ref в теле компонента или в
 * эффектах, объявленных РАНЬШЕ этого хука, нельзя — там значение ещё прежнее.
 */
function useLatest<T>(value: T) {
  const ref = React.useRef(value)
  useIsoLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

export { useIsoLayoutEffect, useLatest }
