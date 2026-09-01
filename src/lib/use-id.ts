import * as React from "react"

// React.useId появился только в React 18, а кит обязан работать и на 17.
// Если нативный хук есть (18/19) — делегируем ему: id остаются прежними и
// SSR-гидратация честная. Если нет — счётчиковый фолбэк (тот же приём, что у
// @base-ui/react): уникален на инстанс, стабилен на ререндерах. Ограничение
// фолбэка — SSR на React 17: счётчики сервера и клиента могут разойтись,
// поэтому при SSR на 17 id нужно задавать явно (проп id уже это позволяет).
//
// Оба хука вызываются безусловно: версия React не меняется внутри одного
// рантайма, но условный вызов нарушил бы rules-of-hooks в линтере.

type ReactWithOptionalUseId = typeof React & { useId?: () => string }

let fallbackCounter = 0

export function useId(): string {
  const fallbackId = React.useState(() => `ui-kit-${++fallbackCounter}`)[0]
  const maybeUseId = (React as ReactWithOptionalUseId).useId
  return maybeUseId !== undefined ? maybeUseId() : fallbackId
}
