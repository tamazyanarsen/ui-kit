import * as React from "react"

// useComboboxSelection — схема «черновик против подтверждённого», которой
// пользуется каждый фасет с множественным выбором в макете: открытие
// всплывающего окна заводит черновую копию подтверждённого значения, клики
// по флажкам меняют только черновик, а «Сбросить» и «Применить» в подвале
// подтверждают его или отбрасывают. Закрытие окна любым другим способом
// (Escape, клик снаружи) молча отбрасывает черновик.
//
// `T` — это то, что вызывающий код использует в качестве выбираемого
// элемента; так же устроена и модель Base UI, где `value` у
// `Combobox.Item` может быть целым объектом, а не только строковым
// идентификатором. Сравнение идёт по ссылке (`Array#includes`), и это
// нормально, пока исходный список элементов сохраняет тождественность
// (константа уровня модуля или её же фильтр или срез с той же ссылкой), —
// что верно для всех фасетов, построенных на этом хуке до сих пор.
export function useComboboxSelection<T>(initialValue: T[] = []) {
  const [committed, setCommitted] = React.useState(initialValue)
  const [draft, setDraft] = React.useState(initialValue)
  const [open, setOpenState] = React.useState(false)

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (next) setDraft(committed)
      setOpenState(next)
    },
    [committed]
  )

  const reset = React.useCallback(() => setDraft([]), [])

  const apply = React.useCallback(() => {
    setCommitted(draft)
    setOpenState(false)
  }, [draft])

  const hasChanges =
    draft.length !== committed.length ||
    draft.some((v) => !committed.includes(v))

  return {
    committed,
    setCommitted,
    draft,
    setDraft,
    open,
    setOpen,
    reset,
    apply,
    hasChanges,
    // Дизайн-чек №22: «по умолчанию кнопки сброса и выбора значений не
    // блокируются, даже если не выбрано ничего или выбрано всё». Раньше эти
    // два флага прокидывались в `disabled` подвала, и на пустом списке обе
    // кнопки были серыми — именно это и попало в дизайн-чек.
    //
    // Мастер `ELK / dropdown` (вариант Two Buttons) уточняет: при нуле
    // выбранных серой (#EFEFEF, подпись #C8C8CB) рисуется только левая
    // кнопка, а в спецификации сказано «Сбросить активна только при наличии
    // выбранных элементов». Поэтому истории передают в подвал только
    // `resetDisabled={!canReset}`; «Выбрать» по-прежнему не блокируется
    // (см. `canApply` ниже).
    canReset: draft.length > 0,
    // Подтверждать есть что при любом изменении — в том числе когда
    // черновик пуст: «Сбросить» → «Применить» и есть способ снять выбор.
    // Раньше пустой черновик запрещал применение, и выбранное через подвал
    // было не снять.
    canApply: hasChanges,
  }
}
