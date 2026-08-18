import * as React from "react"

/**
 * Отслеживает, скрыт ли контент за верхним и нижним краем прокручиваемой
 * области.
 *
 * Нужно там, где разделитель у края — не украшение, а признак «дальше есть
 * ещё»: у шапки он появляется, только когда список уже прокручен, а у
 * подвала — пока список не домотан до конца. Дизайн-чек №3, замечания 13 и
 * 14: «Не должно быть разделителя, когда скролл в верхнем положении» и
 * «…в нижнем положении».
 *
 * Логика раньше жила прямо в `ModalBody`; Notification нуждается ровно в
 * ней же, поэтому вынесена сюда, а не продублирована.
 *
 * `deps` — то, от чего зависит высота содержимого (обычно `children`):
 * пересчёт нужен и когда меняется контейнер, и когда меняется контент
 * внутри него.
 */
export function useScrollEdges<T extends HTMLElement>(deps?: React.DependencyList) {
  const ref = React.useRef<T>(null)
  const [scrolledFromTop, setScrolledFromTop] = React.useState(false)
  const [scrolledToEnd, setScrolledToEnd] = React.useState(true)

  const update = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    setScrolledFromTop(scrollTop > 0)
    setScrolledToEnd(scrollTop + clientHeight >= scrollHeight - 1)
  }, [])

  React.useEffect(() => {
    update()
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(update)
    // Дизайн-чек №34: наблюдаем не только за самим контейнером, но и за
    // детьми — иначе изменение высоты СОДЕРЖИМОГО при неизменном
    // контейнере (подгрузилась картинка, раскрылся аккордеон, доехали
    // веб-шрифты) не пересчитывало состояние, и разделитель залипал.
    observer.observe(el)
    for (const child of el.children) observer.observe(child)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, ...(deps ?? [])])

  return { ref, scrolledFromTop, scrolledToEnd, update }
}
