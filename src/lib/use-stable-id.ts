import * as React from "react"

// Копия React-модуля, а не сам модуль: прямое `React.useId` бандлер
// потребителя на React 17 проверяет статически и ругается на отсутствующий
// экспорт. Через копию обращение динамическое — так же делает Base UI
// (`@base-ui/utils/safeReact`).
const SafeReact: { useId?: () => string } = { ...React }
const reactUseId = SafeReact.useId

// Счётчики общие для всех копий кита на странице: каждый микрофронт везёт
// свой кит (и часто свой React), а id в DOM общие для документа.
type Registry = { copies: number; ids: number }
const KEY = Symbol.for("@core/ui-kit/use-stable-id")
const registry: Registry = ((globalThis as Record<symbol, Registry | undefined>)[KEY] ??= {
  copies: 0,
  ids: 0,
})

// Номер этой копии кита. Первая копия префикса не получает — её id совпадают
// с тем, что отдаёт `useId`. Остальным он нужен и на React 18: `useId`
// уникален только внутри одной копии React, и два микрофронта со своим
// React оба выдали бы `:r0:`.
const copy = registry.copies++
const prefix = copy === 0 ? "" : `k${copy}`

function useFallbackId() {
  const ref = React.useRef<string | null>(null)
  if (ref.current === null) ref.current = `:u${(registry.ids++).toString(36)}:`
  return ref.current
}

/**
 * `useId`, который работает и на React 17 (там хука нет). На 17 id берётся из
 * счётчика при первом рендере — синхронно, так что `htmlFor`/`aria-*` и
 * ссылки `url(#…)` в svg верны сразу, без второго прохода. Формат id тот же,
 * что у React (`:…:`): потребители, вырезающие двоеточия, не меняются.
 *
 * Выбор ветки постоянен на всё время жизни модуля, поэтому порядок хуков
 * между рендерами не меняется.
 */
const useStableId: () => string = reactUseId
  ? () => prefix + reactUseId()
  : () => prefix + useFallbackId()

export { useStableId }
