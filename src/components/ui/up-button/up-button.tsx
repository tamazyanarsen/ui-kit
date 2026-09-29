import * as React from "react"
import { ChevronUp } from "@/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Up Button — «Кнопка наверх»: по анатомии это собственная форма Button
// Icon/Small (secondary-white, круг 32px — size-8 с rounded-2xl даёт точный
// круг), по примечанию самого макета «аналогична Button + Анатомия +
// Small». По макету: появляется внизу справа, когда страницу прокрутили, и
// прячется, пока открыт плавающий элемент (модальное окно, шторка и
// прочее). `scrollContainer` указывает на источник прокрутки (по умолчанию
// окно), а `hidden` позволяет потребителю принудительно убрать кнопку для
// случая с плавающим элементом.
interface UpButtonProps {
  /**
   * Источник прокрутки: ref на контейнер или сам элемент. Не задан — окно.
   */
  scrollContainer?: React.RefObject<HTMLElement | null> | HTMLElement | null
  threshold?: number
  hidden?: boolean
  className?: string
}

type ScrollSource = UpButtonProps["scrollContainer"]

function resolveTarget(source: ScrollSource): Window | HTMLElement {
  if (source instanceof HTMLElement) return source
  return source?.current ?? window
}

function UpButton({
  scrollContainer,
  threshold = 400,
  hidden = false,
  className,
}: UpButtonProps) {
  const [visible, setVisible] = React.useState(false)
  const subscription = React.useRef<{
    target: Window | HTMLElement
    threshold: number
    unsubscribe: () => void
  } | null>(null)
  const latest = React.useRef({ scrollContainer, threshold })
  latest.current = { scrollContainer, threshold }

  // Подписка на актуальный источник: без изменений — ничего не делает.
  const ensureSubscribed = React.useCallback(() => {
    const { scrollContainer: source, threshold: limit } = latest.current
    const target = resolveTarget(source)
    const current = subscription.current
    if (current && current.target === target && current.threshold === limit) return
    current?.unsubscribe()

    function handleScroll() {
      const scrollTop = target === window ? window.scrollY : (target as HTMLElement).scrollTop
      setVisible(scrollTop > limit)
    }

    handleScroll()
    target.addEventListener("scroll", handleScroll, { passive: true })
    subscription.current = {
      target,
      threshold: limit,
      unsubscribe: () => target.removeEventListener("scroll", handleScroll),
    }
  }, [])

  // Источник перепроверяется после каждой отрисовки кнопки: сам ref не
  // меняется, а `ref.current` — да.
  React.useEffect(() => {
    ensureSubscribed()
  })

  // ⚠️ Одной перепроверки после отрисовки мало: контейнер часто монтирует
  // соседний компонент своим состоянием, а кнопка (или её мемоизированный
  // родитель) при этом не перерисовывается — и слушатель навсегда оставался
  // на `window`. Пока источник задан ref-объектом, за его `current` следит
  // MutationObserver: появление или замена узла в DOM и есть смена `current`.
  // Считается во время отрисовки, поэтому без `instanceof HTMLElement`: на
  // сервере такого глобала нет. У DOM-элемента поля `current` не бывает.
  const watchRef = scrollContainer != null && "current" in scrollContainer
  React.useEffect(() => {
    if (!watchRef || typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(ensureSubscribed)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [watchRef, ensureSubscribed])

  React.useEffect(
    () => () => {
      subscription.current?.unsubscribe()
      subscription.current = null
    },
    []
  )

  function handleClick() {
    resolveTarget(scrollContainer).scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!visible || hidden) return null

  return (
    <Button
      type="button"
      data-slot="up-button"
      variant="secondary-white"
      size="sm"
      iconPosition="only"
      icon={ChevronUp}
      aria-label="Наверх"
      onClick={handleClick}
      // Мастер (`ELK / up button`) несёт именованный эффект кита
      // «Universal shadow» — 0/4/12 цвета #8B99A93D, — а не какую-то свою
      // чёрную тень. Макет выгружает её фильтром `drop-shadow`, у которого
      // размытие в CSS вдвое меньше радиуса в макете, поэтому в сырой
      // выгрузке и читается 6px.
      //
      // ⚠️ Отступ снизу — над ЗАНЯТЫМ низом вьюпорта, а не над кромкой
      // экрана: закреплённая панель (ButtonMenu, ButtonMenuBlack) публикует
      // свою высоту в `--viewport-inset-bottom` (здесь читается
      // `--floating-bottom` — с блоком «Выбрать на всех страницах», см.
      // base.css). Без этого кнопка ложилась
      // на правый край панели — у чёрной точно на крестик «Закрыть», и
      // закрыть выделение мышью было нельзя.
      //
      // Тот же угол делит плавающая карточка NPS: пока она открыта, она
      // публикует занятую высоту в `--floating-corner-inset`, и кнопка
      // встаёт над ней. Без карточки переменной нет — отступ прежний.
      className={cn(
        "fixed right-6 bottom-[max(calc(1.5rem+var(--floating-bottom,0px)),var(--floating-corner-inset,0px))] z-40 shadow-[var(--shadow-universal)]",
        className
      )}
    />
  )
}

export { UpButton }
export type { UpButtonProps }
