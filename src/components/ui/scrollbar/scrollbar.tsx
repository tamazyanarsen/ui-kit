import * as React from "react"

import { cn } from "@/lib/utils"
import { useComposedRefs } from "@/lib/compose-refs"
import {
  attachOverlayScrollbar,
  type OverlayScrollbarHandle,
  type ScrollbarVisibility,
} from "@/lib/overlay-scrollbar"

// Scrollbar — «Скролл»: область прокрутки кита с полосой в стиле кита
// (списки выпадающих меню, тела модальных окон, белые блоки). По макету
// толщина зависит от оси — 4px по вертикали и 8px по горизонтали
// («Горизонтальный скролл ... имеет большую толщину»).
//
// Полоса НАЛОЖЕННАЯ (Правки UI-Kit от 25.10, «Scrollbar — родные полосы
// браузера вместо полос кита, полоса занимает место»). Раньше вид задавался
// только через `::-webkit-scrollbar`: в Firefox и при системной настройке
// «полосы всегда» показывалась родная полоса, а полоса кита занимала 4px и
// сдвигала содержимое. Теперь родная полоса скрыта, а свою рисует механика
// src/lib/overlay-scrollbar: места не занимает (`offsetWidth − clientWidth`
// равно одной рамке), бегунок перетаскивается, нажатие на дорожку листает на
// 90 % высоты, колесо над полосой листает область. Поля содержимого поэтому
// считаются БЕЗ ширины полосы.
//
// Отступ полосы от края поверхности — проп `inset` (прозрачная рамка:
// полоса стоит у её внутреннего края, см. styles/scrollbar.css). Отступы
// дорожки по оси область может задать сама переменными `--ovs-start` /
// `--ovs-end`, отступ от края рамки внутрь — `--ovs-cross`.
interface ScrollbarProps extends React.ComponentProps<"div"> {
  orientation?: "vertical" | "horizontal"
  /**
   * Отступ полосы от края поверхности.
   *
   *   • `none` — полоса по краю коробки. Годится там, где Scrollbar сам и
   *     есть край: прокручиваемая область страницы, тело таблицы;
   *   • `dropdown` — 8px, норма для выпадающих списков и панелей;
   *   • `rounded` — 16px, для скруглённых поверхностей, где 8 не хватает,
   *     чтобы полоса не наезжала на закругление;
   *   • `panel` — 8px справа, 8px сверху и 48px снизу: панель раскрытого
   *     меню упирается верхом в шапку, а низ у неё скруглён на 32, и дорожка
   *     обязана заканчиваться ДО закругления. Числа сняты с кадров адаптации
   *     (раздел «Адаптация»), а не подобраны (дизайн-чек от 08.09,
   *     замечание 8).
   *
   * ⚠️ Отступ теперь ставится и вдоль оси полосы, а не только поперёк:
   * дорожка тянется во всю высоту окна и упирается в скруглённый угол
   * поверхности, где её и срезает `overflow: hidden` родителя.
   */
  inset?: "none" | "dropdown" | "rounded" | "panel"
  /**
   * Когда видна полоса на устройстве с мышью (Правки UI-Kit от 25.10):
   *
   *   • `always` — всегда, когда есть что прокручивать (модалки, списки);
   *   • `hover` — при наведении на блок и во время прокрутки (белые
   *     блоки дашборда). Блок — ближайший CardBox или предок с атрибутом
   *     `data-ovs-hover`, иначе сама область;
   *   • `scroll` — только во время прокрутки и перетаскивания бегунка.
   *
   * В мобильном виде (уже 1280) и на тач-устройствах (`hover: none`) полоса
   * в любом режиме видна только во время прокрутки: появляется за 150 мс,
   * гаснет за 400 мс через 800 мс после остановки.
   */
  visibility?: ScrollbarVisibility
  /**
   * Передача колеса странице у края — правило блоков (Правки UI-Kit от
   * 25.10, «Scrollbar — видимость полосы и передача прокрутки странице»):
   * докрученный до края блок держит колесо 500 мс, потом отдаёт странице;
   * блок, под которым листают страницу, подхватывает колесо до конца жеста.
   * Только вертикальное колесо и только на устройствах с наведением.
   * По умолчанию включено вместе с `visibility="hover"`.
   */
  wheelHandoff?: boolean
}

// forwardRef нужен потому, что потребителям требуется сам прокручиваемый
// узел, а не только его оформление: ModalBody, например, читает с него
// scrollTop и scrollHeight, чтобы решить, какой краевой разделитель
// показать. На React 18 обычный функциональный компонент здесь потерял бы
// ref совсем (то же ограничение см. у Button и Dropdown).
const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  function Scrollbar(
    {
      orientation = "vertical",
      inset = "none",
      visibility = "always",
      wheelHandoff,
      className,
      ...props
    },
    forwardedRef
  ) {
    const [node, setNode] = React.useState<HTMLDivElement | null>(null)
    const ref = useComposedRefs<HTMLDivElement>(forwardedRef, setNode)
    const handle = React.useRef<OverlayScrollbarHandle | null>(null)
    const options = { visibility, wheelHandoff: wheelHandoff ?? visibility === "hover" }

    // Подключение — в layout-эффекте: полоса и скрытие родной полосы
    // появляются в том же кадре, что и область, без мигания родной.
    React.useLayoutEffect(() => {
      if (!node) return
      const attached = attachOverlayScrollbar(node, options)
      handle.current = attached
      return () => {
        attached.release()
        handle.current = null
      }
      // Параметры обновляет эффект ниже, переподключать полосу не нужно.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node])

    React.useLayoutEffect(() => {
      handle.current?.setOptions(options)
    }, [options.visibility, options.wheelHandoff]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div
        ref={ref}
        data-slot="scrollbar"
        data-orientation={orientation}
        data-inset={inset === "none" ? undefined : inset}
        data-visibility={visibility}
        // Окно прокрутки фокусируемо БЕЗ `tabindex` — браузер даёт его
        // само, чтобы область можно было листать клавиатурой. Маркер
        // ничего не добавляет в обход табом, он только выдаёт кольцо
        // фокуса кита (см. styles/base.css).
        data-scroll-window=""
        className={cn(
          "themed-scrollbar",
          orientation === "vertical"
            ? "overflow-y-auto overflow-x-hidden"
            : "overflow-x-auto overflow-y-hidden",
          className
        )}
        {...props}
      />
    )
  }
)

export { Scrollbar }
export type { ScrollbarProps }
