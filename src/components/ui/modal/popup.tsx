import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "@/icons"

import * as React from "react"

import { stateClassName } from "@/lib/state-class-name"
import { flattenChildren } from "@/lib/flatten-children"
import { useComposedRefs } from "@/lib/compose-refs"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { useSmoothHeight } from "@/lib/use-smooth-height"
import { useViewportAttr } from "@/lib/viewport"
import { Button } from "@/components/ui/button"

import { ModalHeader, ModalTopHolder } from "./header"
import { useFullScreen } from "./use-full-screen"

const modalPopupVariants = cva(
  // Сначала мобильный: классы без префикса — это мобильная форма нижней
  // шторки, а `desktop:` переключает на центрированную десктопную карточку
  // с порога десктопа (1280). `overflow-hidden` здесь нет намеренно: он живёт
  // на внутренней обёртке (см. ModalContent), чтобы кнопка закрытия,
  // вынесенная за эти границы по дизайн-чеку, замечание 37, не оказалась им
  // обрезана. Радиус верхних углов на мобильном — 24px (слой «Box» у
  // варианта «Size=Mobile, Type=Small Modal», то есть у самой карточки
  // нижней шторки), и это отдельное, меньшее значение, чем 32px у
  // --modal-radius десктопной карточки.
  //
  // `data-[full]:` — мобильный вариант на весь экран (Large Modal, Правки
  // UI-Kit от 25.10): от верха, `100dvh`, без скруглений. Признак ставит
  // `useFullScreen` (или проп `fullScreen`); на десктопе его не бывает.
  //
  // Ширина на десктопе — всегда своя (`l` 1008, `m` 592), без
  // `max-width: calc(100% - 160px)`. Правки UI-Kit от 25.10, «Modal — ширина
  // сжимается под окно»: порог десктопа теперь 1280, уже него десктопной
  // раскладки не бывает, и окно 1008 с вынесенным крестиком (−64) помещается
  // всегда. Прежнее ограничение спасало ширины 768–1135, которых у десктопа
  // больше нет, а при окне 1024 ужимало `l` до 849.
  "fixed inset-x-0 bottom-0 z-50 flex max-h-[87vh] w-full flex-col rounded-t-[24px] bg-[var(--modal-bg)] shadow-xl outline-none data-open:animate-in data-open:slide-in-from-bottom data-open:fade-in-0 data-closed:animate-out data-closed:slide-out-to-bottom data-closed:fade-out-0 desktop:inset-x-auto desktop:top-1/2 desktop:bottom-auto desktop:left-1/2 desktop:max-h-[87vh] data-[full]:top-0 data-[full]:h-dvh data-[full]:max-h-none data-[full]:rounded-none desktop:w-(--modal-width) desktop:-translate-x-1/2 desktop:-translate-y-1/2 desktop:rounded-[var(--modal-radius)] desktop:data-open:slide-in-from-bottom-0 desktop:data-open:zoom-in-95 desktop:data-closed:slide-out-to-bottom-0 desktop:data-closed:zoom-out-95",
  {
    // Дизайн-чек, замечание 40: снято прямо с вектора макета в натуральном
    // масштабе (пиксельным проходом по левому и правому краям самой белой
    // карточки, а не на глаз) — «Large Modal» это 1008px, «Small Modal» —
    // 592px, обе заметно больше прежних догадок 640 и 480.
    variants: {
      size: {
        // Горизонтальные отступы едут вместе с размером: большое окно
        // отступает сверху и по телу на 64px, маленькое — на 48px (у обоих
        // ряд кнопок остаётся на 48px, см. ModalFooter).
        l: "desktop:[--modal-width:1008px] desktop:[--modal-px:64px]",
        m: "desktop:[--modal-width:592px] desktop:[--modal-px:48px]",
      },
    },
    defaultVariants: {
      size: "l",
    },
  }
)

interface ModalContentProps
  extends DialogPrimitive.Popup.Props,
    VariantProps<typeof modalPopupVariants> {
  /** Прячет встроенную кнопку закрытия. Среди вариантов «Modal Top» в
   * макете есть и такой, без неё, а мобильная нижняя шторка у Hint
   * наследует это через свой пропс `showCross`. */
  showClose?: boolean
  /**
   * Мобильный вид на весь экран (Large Modal) принудительно — для длинных
   * форм, которым штора заведомо мала. Без пропа окно решает само: штора,
   * пока естественная высота помещается в 87% экрана, иначе — на весь экран.
   * На десктопе не действует.
   */
  fullScreen?: boolean
}

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(function ModalContent({
  className,
  size,
  showClose = true,
  fullScreen = false,
  initialFocus,
  children,
  ...props
}, forwardedRef) {
  // Base UI выносит попап в конец `<body>`, то есть за пределы обёртки
  // `<ViewportScope>`: React-контекст сквозь портал проходит, а CSS-селектор
  // по предку — нет. Поэтому корню всплывающего слоя атрибут проставляем
  // руками, иначе форсированный mobile не дойдёт до вариантов `desktop:`.
  const viewport = useViewportAttr()

  const isDesktop = useIsDesktop()
  const [popup, setPopup] = React.useState<HTMLDivElement | null>(null)
  // Сам узел окна — цель начального фокуса (см. `initialFocus` ниже).
  const popupRef = React.useRef<HTMLDivElement | null>(null)

  // Смена вида (штора ↔ весь экран) — не повод анимировать высоту: окно
  // перестраивается целиком, и плавная высота отмечает время переключения.
  const switchedAt = React.useRef(-Infinity)
  const forcedFull = fullScreen && !isDesktop
  useFullScreen(popup, {
    enabled: !isDesktop && !fullScreen,
    onSwitch: () => {
      switchedAt.current = performance.now()
    },
  })

  // Плавная смена высоты (Правки UI-Kit от 25.10, «Высоты перестраиваются с
  // анимацией»): окно с высотой по содержимому меняет её за 300 мс по мягкой
  // кривой. Окно на весь экран высоту не меняет. Подрезку держит внутренняя
  // обёртка, поэтому `clip: false` — вынесенный крестик за краем окна.
  const smoothRef = useSmoothHeight<HTMLDivElement>({
    clip: false,
    skip: (element) =>
      element.hasAttribute("data-full") ||
      performance.now() - switchedAt.current < 100,
  })
  const ref = useComposedRefs<HTMLDivElement>(
    setPopup,
    popupRef,
    smoothRef,
    forwardedRef
  )

  // ⚠️ Узнавание по ТИПУ ребёнка, а не по пропу. Дизайн-чек от 13.09,
  // замечание 15: белая полоса сверху нужна КАЖДОЙ модалке, а не той, которой
  // её попросили. Просить её пропом значило бы, что про полосу забудут ровно
  // там же, где забыли шапку.
  //
  // Обратная сторона приёма (см. `ButtonMenuRow`): обёртка вокруг
  // `ModalHeader` ломает разбор молча — шапка будет, а холдер встанет вторым.
  // Поэтому `ModalHeader` передаётся прямым ребёнком `ModalContent`, без
  // собственных обёрток. Фрагмент обёрткой не считается — он раскрывается:
  // условная разметка `<>{header}{body}</>` давала шапку И холдер над ней.
  //
  // Явно переданный `ModalTopHolder` (вариант «Modal Top: None» из JSDoc)
  // тоже засчитывается — иначе полоса вставала второй (аудит 14: тело
  // начиналось на 96px вместо 48).
  const hasHeader = flattenChildren(children).some(
    (node) =>
      React.isValidElement(node) &&
      (node.type === ModalHeader || node.type === ModalTopHolder)
  )

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="modal-backdrop"
        className="fixed inset-0 z-50 bg-[var(--modal-backdrop)]/70 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <DialogPrimitive.Popup
        data-slot="modal-content"
        data-viewport={viewport}
        // `className` у Popup бывает функцией от состояния — `cn` её бы
        // выбросил, см. `stateClassName`.
        data-full={forcedFull ? "" : undefined}
        data-full-forced={forcedFull ? "" : undefined}
        // Правки UI-Kit от 25.10, «Начальный фокус модалки»: при открытии
        // фокус встаёт на само окно (у Popup `tabindex −1`), а не на первый
        // элемент внутри — иначе при открытии мышью или пальцем браузер
        // рисовал кольцо на чипсе или поле, которого ещё не касались. Диктор
        // читает окно с заголовком, Tab ведёт к первому элементу уже с
        // кольцом. Экран вправе передать свой `initialFocus` (поле ввода).
        initialFocus={initialFocus ?? popupRef}
        className={stateClassName(modalPopupVariants({ size }), className)}
        ref={ref}
        {...props}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit]">
          {!hasHeader && <ModalTopHolder />}
          {children}
        </div>
        {showClose && (
        <DialogPrimitive.Close
          // На мобильном кнопка стоит внутри собственного верхнего отступа
          // шторки, правее того места, где была бы строка заголовка
          // (сверено с анатомией Mobile/Large Modal: кнопка закрытия делит
          // строку с заголовком, а не висит над шторкой). На десктопе она
          // вынесена целиком за карточку и выглядывает за её правый верхний
          // угол ровно на то смещение, что снято с анатомии десктопных
          // Large и Small Modal (right:-64px, top:0).
          className="absolute top-6 right-4 z-10 desktop:top-0 desktop:-right-16"
          render={
            <Button
              variant="secondary-grey"
              size="sm"
              icon={X}
              iconPosition="only"
              aria-label="Закрыть"
            />
          }
        />
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
})

export { ModalContent, modalPopupVariants }
