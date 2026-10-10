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
 * Пересчёт нужен и когда меняется контейнер, и когда меняется контент
 * внутри него. Раньше второе ловилось зависимостями эффекта (`[children]`),
 * а `children` — новый объект на каждом рендере родителя: наблюдатель
 * снимался и ставился заново при любом ре-рендере диалога (ревью 10.10,
 * КК-3). Теперь наблюдение ставится один раз, а смену состава детей ловит
 * `MutationObserver`.
 */
export function useScrollEdges<T extends HTMLElement>() {
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
    // Дети пришли или ушли (новый список, другой шаг диалога): новые
    // наблюдаются, ушедшие снимаются, края пересчитываются.
    const mutations =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver((records) => {
            for (const record of records) {
              record.addedNodes.forEach((node) => {
                if (node instanceof Element) observer.observe(node)
              })
              record.removedNodes.forEach((node) => {
                if (node instanceof Element) observer.unobserve(node)
              })
            }
            update()
          })
    mutations?.observe(el, { childList: true })
    return () => {
      observer.disconnect()
      mutations?.disconnect()
    }
  }, [update])

  return { ref, scrolledFromTop, scrolledToEnd, update }
}
