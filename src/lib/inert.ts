import * as React from "react"

// React 18 не знает атрибута `inert` и пропускает в DOM только строку
// (`inert=""`), а React 19 знает его как булев — и пустую строку там
// трактует как `false`. Чтобы поддерево не «оживало» при переходе на 19,
// значение выбирается по версии.
const INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : ""

/**
 * Пропсы, делающие поддерево инертным: вне порядка фокуса, недоступным
 * для клика и скрытым от скринридера.
 */
function inertProps(inert: boolean): Record<string, unknown> {
  return inert ? { inert: INERT_VALUE } : {}
}

export { inertProps }
