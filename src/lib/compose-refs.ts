import * as React from "react"

type PossibleRef<T> = React.Ref<T> | undefined

function assignRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) (ref as React.MutableRefObject<T | null>).current = value
}

/**
 * Один callback-ref на несколько получателей: внутренний ref компонента
 * (замер, фокус) и ref потребителя из `forwardRef`. Нужен там, где узлу
 * требуются оба — иначе один из них остаётся `null`.
 *
 * Ref стабилен, пока не сменились сами получатели, поэтому React не
 * переподключает его на каждом рендере.
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return React.useCallback((node: T | null) => {
    for (const ref of refs) assignRef(ref, node)
    // Зависимости — сами получатели, их число от рендера к рендеру не меняется.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs)
}

export { assignRef, useComposedRefs }
