import * as React from "react"
import { createPortal } from "react-dom"

import { useComposedRefs } from "@/lib/compose-refs"
import { sharedRegistry } from "@/lib/shared-registry"
import {
  attachPageScrollbar,
  startOverlayScrollbars,
  type PageScrollbarHandle,
} from "@/lib/overlay-scrollbar"

// PageScrollbar — полоса прокрутки всей страницы (Правки UI-Kit от 25.10,
// «Scrollbar — родные полосы браузера вместо полос кита»). Экран монтирует
// её ОДИН раз, обычно рядом с корнем приложения:
//
//   • прячет родную полосу окна (она занимала место справа) и рисует свою —
//     тонкую, поверх страницы, 4 px от правого края и по 4 сверху и снизу,
//     только бегунок без дорожки; горизонтальную — 4 px от низа, если
//     страница шире окна;
//   • на устройстве с мышью и десктопной ширине полоса видна всегда, когда
//     есть что прокручивать; в мобильном виде (уже 1280) и на тач-устройствах
//     — только во время прокрутки;
//   • по умолчанию (`areas`) включает наложенную полосу у ВСЕХ областей
//     `.themed-scrollbar` на странице — и у тех, что ставят класс напрямую,
//     без `<Scrollbar>` (выпадающие списки, Select, подсказки, textarea).
//
// Полоса страницы одна на страницу: если `PageScrollbar` смонтирован
// несколько раз (общая оболочка и экран, Storybook и история, две копии
// кита в микрофронтах), рисует только первый из живых, остальные ждут —
// иначе у окна стояли бы две полосы. Реестр общий для всех копий кита.
//
// Узлы полос живут в портале в `<body>`: у `position: fixed` внутри
// трансформированного предка окно перестало бы быть охватывающим блоком.
interface PageScrollbarProps extends React.ComponentProps<"div"> {
  /**
   * Подключать наложенную полосу ко всем областям `.themed-scrollbar`
   * страницы. Без этого у голых областей остаётся запасной вид через
   * `::-webkit-scrollbar`.
   */
  areas?: boolean
  /** `always` — по правилу документа; `scroll` — только во время прокрутки везде. */
  visibility?: "always" | "scroll"
}

interface PageScrollbarOwners {
  order: symbol[]
  listeners: Set<() => void>
}

function owners(): PageScrollbarOwners {
  return sharedRegistry<PageScrollbarOwners>("page-scrollbar", () => ({
    order: [],
    listeners: new Set(),
  }))
}

/** Это ли экземпляр рисует полосу: первый живой в порядке монтирования. */
function useIsPageScrollbarOwner(): boolean {
  const [owner, setOwner] = React.useState(false)
  React.useEffect(() => {
    const registry = owners()
    const token = Symbol("page-scrollbar")
    const sync = () => setOwner(registry.order[0] === token)
    registry.order.push(token)
    registry.listeners.add(sync)
    registry.listeners.forEach((listener) => listener())
    return () => {
      registry.order.splice(registry.order.indexOf(token), 1)
      registry.listeners.delete(sync)
      registry.listeners.forEach((listener) => listener())
    }
  }, [])
  return owner
}

const PageScrollbar = React.forwardRef<HTMLDivElement, PageScrollbarProps>(
  function PageScrollbar({ areas = true, visibility = "always", ...props }, forwardedRef) {
    const [node, setNode] = React.useState<HTMLDivElement | null>(null)
    const ref = useComposedRefs<HTMLDivElement>(forwardedRef, setNode)
    const handle = React.useRef<PageScrollbarHandle | null>(null)
    const mounted = useIsPageScrollbarOwner()

    React.useLayoutEffect(() => {
      if (!node) return
      const attached = attachPageScrollbar(node, visibility)
      handle.current = attached
      return () => {
        attached.release()
        handle.current = null
      }
      // Режим обновляет эффект ниже.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node])

    React.useLayoutEffect(() => {
      handle.current?.setVisibility(visibility)
    }, [visibility])

    React.useEffect(
      () => (mounted && areas ? startOverlayScrollbars() : undefined),
      [mounted, areas]
    )

    if (!mounted) return null
    return createPortal(
      <div ref={ref} data-slot="page-scrollbar" aria-hidden="true" {...props} />,
      document.body
    )
  }
)

export { PageScrollbar }
export type { PageScrollbarProps }
