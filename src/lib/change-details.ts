/**
 * Детали события изменения в форме Base UI (`ChangeEventDetails`) — для
 * изменений, которые кит делает сам, мимо примитива: очистка Select
 * крестиком, ввод значения RangeInput с клавиатуры.
 *
 * ⚠️ `cancel()` и `allowPropagation()` обязаны РАБОТАТЬ, а не быть
 * заглушками. Потребитель отменяет изменение `details.cancel()` в
 * `onValueChange`, и кит после вызова смотрит на `isCanceled`. У RangeInput
 * заглушка `cancel: () => {}` давала разный контракт: перетаскивание
 * бегунка отменялось (это делает Base UI), а набранное в поле — нет (ревью
 * 10.10, КК-2). Один помощник на оба места.
 */
interface ManualChangeDetails<Reason extends string> {
  reason: Reason
  event: Event
  trigger: undefined
  isCanceled: boolean
  isPropagationAllowed: boolean
  cancel: () => void
  allowPropagation: () => void
}

function manualChangeDetails<Reason extends string, Extra extends object = object>(
  reason: Reason,
  event: Event,
  extra?: Extra
): ManualChangeDetails<Reason> & Extra {
  const details = {
    ...(extra as Extra),
    reason,
    event,
    trigger: undefined,
    isCanceled: false,
    isPropagationAllowed: false,
    cancel() {
      details.isCanceled = true
    },
    allowPropagation() {
      details.isPropagationAllowed = true
    },
  }
  return details
}

export { manualChangeDetails }
export type { ManualChangeDetails }
