import * as React from "react"

// Общий для Tabs, Switcher и Header: во всех трёх макетах описано одно и то
// же поведение «Show More» — как только ряд перестаёт помещаться, хвостовые
// элементы уходят за триггер «...», открывающий выпадающий список.
//
// `itemRefs` обязан быть привязан к *всегда отрисованной закадровой* копии
// каждого элемента (см. замерочный ряд у Tabs и Switcher), а не к видимому
// ряду: элементы, спрятанные за триггером перекрытия, иначе сообщили бы
// нулевую ширину при следующем пересчёте и навсегда сломали бы счёт.
//
// ⚠️ Пересчёт обязан висеть на ТРЁХ источниках, и каждый закрывает свой
// способ соврать:
//
//  1. `ResizeObserver` на контейнере. Раньше здесь был только
//     `window.resize`, и контейнер, сузившийся без участия окна (раскрылся
//     соседний блок, приехала боковая панель, сменилась вёрстка страницы),
//     оставлял счёт нетронутым. Замер: контейнер табов 787 → 300px, счёт
//     остался 8 из 8, таба «Ещё» не появилось — табы просто торчали за
//     коробкой, и чинил это только настоящий resize окна.
//  2. `document.fonts.ready`. Object Sans грузится асинхронно, и до его
//     подхвата текст меряется fallback-метриками — строка у́же, «переполнения
//     нет». Компонент, который считает один раз в эффекте, фиксирует эту ложь
//     навсегда. Это сквозное правило проекта, а не частность табов.
//  3. Смена входных данных — число элементов, зарезервированная ширина, зазор.
//
// ⚠️ Ширины берутся `getBoundingClientRect().width`, а не `offsetWidth`:
// последний округляет до целого, и на ряду из десятка элементов ошибка
// копится в заметный сдвиг.
//
// `alwaysReserve` — триггер перекрытия виден ВСЕГДА (Tabs с `showMore`), а не
// только при переполнении. Тогда его место входит и в проверку «помещается
// всё»: иначе ряд из пунктов, которые помещаются ровно впритык, считался
// помещающимся, а триггер рядом с ними вылезал за контейнер.
//
// `occupiedWidth` — место в ряду, которое ВСЕГДА занято не пунктами (прочие
// дети ButtonMenuRow: кнопка в своей обёртке, произвольная разметка). Оно
// вычитается из доступной ширины и в проверке «помещается всё», и при
// подсчёте: иначе ряд из пунктов и такой разметки вылезал за контейнер.
//
// ⚠️ Доступная ширина — это КОНТЕНТНАЯ коробка контейнера: `clientWidth`
// включает внутренние отступы, а пункты на них не встают. Раньше отступы
// вычитал только Switcher (сам, через `occupiedWidth`), и любой другой ряд с
// `px-*` — Tabs с `className="px-4"`, полоса избранного, ButtonMenuRow в
// карточке — заезжал на них и вылезал за рамку. Теперь их меряет хук, для
// всех, при каждом пересчёте: потребитель может переопределить отступы
// классом.
//
// `minVisible` — сколько пунктов ряд держит видимыми, даже когда они не
// помещаются. По умолчанию 1: у Tabs, Switcher и шапки ряд без единого
// пункта бессмыслен, и это известный нижний предел. Ряду, у которого «…»
// способно взять ВСЕ команды (чёрная панель на узкой сетке), нужен 0 —
// иначе единственная «обязательная» кнопка вылезала из ряда шириной 32 и
// ложилась поверх соседей.
const FIT_TOLERANCE = 1

/** Сумма горизонтальных внутренних отступов элемента. */
function horizontalPadding(element: HTMLElement) {
  const style = getComputedStyle(element)
  return (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0)
}

export function useOverflowCount(
  itemCount: number,
  reservedWidth: number,
  gap = 0,
  alwaysReserve = false,
  occupiedWidth = 0,
  minVisible = 1
) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])
  const [visibleCount, setVisibleCount] = React.useState(itemCount)

  // Число пунктов сменилось, а ряд до этого помещался целиком — считаем, что
  // он помещается и теперь, ещё до замера. Иначе на один проход раскладки
  // счёт отставал бы от нового числа, хвостовой пункт уезжал бы в «Ещё» и
  // тут же возвращался — то есть пересоздавался, теряя фокус и состояние.
  const [counted, setCounted] = React.useState(itemCount)
  if (counted !== itemCount) {
    setCounted(itemCount)
    if (visibleCount >= counted || visibleCount > itemCount) {
      setVisibleCount(itemCount)
    }
  }

  const recompute = React.useCallback(() => {
    const container = containerRef.current
    if (!container || itemCount === 0) return

    const widthOf = (el: HTMLElement | null) =>
      el ? el.getBoundingClientRect().width : 0

    const itemsWidth = itemRefs.current
      .slice(0, itemCount)
      .reduce((sum, el) => sum + widthOf(el), 0)
    // Допуск на округление: `clientWidth` целый, а ширины пунктов дробные.
    // У ряда, ширину которого задаёт само содержимое (ячейка матрицы,
    // `w-fit`-обёртка), без допуска выходило «202 ≤ 201»: пункт уезжал в
    // «Ещё», контейнер от этого сужался, и ряд так и оставался свёрнутым.
    const available = container.clientWidth - horizontalPadding(container) - occupiedWidth

    // ⚠️ Нулевая ширина — это «ещё не померили», а не «не помещается».
    // Контейнер бывает нулевым, пока он скрыт, не разложен или отрисован в
    // jsdom, а элементы — пока не подхватился шрифт. Без этой проверки
    // расчёт `gap * (itemCount - 1)` сам по себе больше нулевого
    // `available`, и ряд схлопывается до одного элемента на пустом месте:
    // именно так табы и свитчер потеряли все пункты, кроме первого, как
    // только зазор начали учитывать (дизайн-чек 3/3 №12).
    if (container.clientWidth === 0 || itemsWidth === 0) {
      setVisibleCount(itemCount)
      return
    }

    const fitsAll =
      itemsWidth + gap * (itemCount - 1) + (alwaysReserve ? reservedWidth : 0)

    if (fitsAll <= available + FIT_TOLERANCE) {
      setVisibleCount(itemCount)
      return
    }

    let used = reservedWidth
    let count = 0
    for (let i = 0; i < itemCount; i++) {
      used += widthOf(itemRefs.current[i])
      if (count > 0) used += gap
      if (used > available + FIT_TOLERANCE) break
      count++
    }
    setVisibleCount(Math.max(minVisible, count))
  }, [itemCount, reservedWidth, gap, alwaysReserve, occupiedWidth, minVisible])

  React.useLayoutEffect(() => {
    recompute()
    window.addEventListener("resize", recompute)
    return () => window.removeEventListener("resize", recompute)
  }, [recompute])

  // Контейнер может сузиться и без участия окна — см. пункт 1 выше.
  //
  // Наблюдаются и сами мерные копии: ширина пункта меняется без смены их
  // ЧИСЛА (вырос бейдж таба, сменилась подпись при локализации,
  // переименовали раздел), и зависимостей `recompute` это не трогает. Без
  // наблюдения за копиями ряд переставал помещаться, а «Ещё» не появлялось.
  const observerRef = React.useRef<ResizeObserver | null>(null)
  const observed = React.useRef(new Set<HTMLElement>())
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(recompute)
    observerRef.current = observer
    observed.current = new Set()
    observer.observe(container)
    return () => {
      observer.disconnect()
      observerRef.current = null
    }
  }, [recompute])

  // Узлы копий появляются и сменяются на рендерах, поэтому набор
  // наблюдаемых сверяется после каждого: новые подписываются, ушедшие
  // снимаются. Повторный `observe` того же узла не нужен — отсюда Set.
  React.useEffect(() => {
    const observer = observerRef.current
    if (!observer) return
    const current = new Set(
      itemRefs.current
        .slice(0, itemCount)
        .filter((el): el is HTMLElement => el !== null)
    )
    for (const el of observed.current) {
      if (!current.has(el)) {
        observer.unobserve(el)
        observed.current.delete(el)
      }
    }
    for (const el of current) {
      if (!observed.current.has(el)) {
        observer.observe(el)
        observed.current.add(el)
      }
    }
  })

  // Пункты переставили или заменили, а их ЧИСЛО прежнее («Настройка
  // избранного» перетащила длинные разделы в начало): зависимости
  // `recompute` не менялись, а мерные копии с ключом по значению — те же
  // узлы того же размера, так что и ResizeObserver молчит. Ряд вылезал за
  // контейнер до первого ресайза. Поэтому после каждой отрисовки сверяется
  // ПОРЯДОК узлов копий: на любой позиции другой узел — пересчёт. Сам
  // пересчёт узлов не меняет, так что петли нет.
  const lastNodes = React.useRef<(HTMLElement | null)[]>([])
  React.useLayoutEffect(() => {
    const nodes = itemRefs.current.slice(0, itemCount)
    const previous = lastNodes.current
    lastNodes.current = nodes
    if (previous.length === 0) return
    const changed =
      nodes.length !== previous.length || nodes.some((node, i) => node !== previous[i])
    if (changed) recompute()
  })

  // Ширины текста до прихода шрифта другие — см. пункт 2 выше.
  React.useEffect(() => {
    if (!document.fonts) return
    let alive = true
    void document.fonts.ready.then(() => {
      if (alive) recompute()
    })
    return () => {
      alive = false
    }
  }, [recompute])

  return { containerRef, itemRefs, visibleCount }
}
