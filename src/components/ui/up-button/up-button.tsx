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
  scrollContainer?: React.RefObject<HTMLElement | null>
  threshold?: number
  hidden?: boolean
  className?: string
}

function UpButton({
  scrollContainer,
  threshold = 400,
  hidden = false,
  className,
}: UpButtonProps) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const target: Window | HTMLElement = scrollContainer?.current ?? window

    function handleScroll() {
      const scrollTop = scrollContainer?.current
        ? scrollContainer.current.scrollTop
        : window.scrollY
      setVisible(scrollTop > threshold)
    }

    handleScroll()
    target.addEventListener("scroll", handleScroll, { passive: true })
    return () => target.removeEventListener("scroll", handleScroll)
  }, [scrollContainer, threshold])

  function handleClick() {
    const target = scrollContainer?.current
    if (target) target.scrollTo({ top: 0, behavior: "smooth" })
    else window.scrollTo({ top: 0, behavior: "smooth" })
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
      className={cn(
        "fixed right-6 bottom-6 z-40 shadow-[var(--shadow-universal)]",
        className
      )}
    />
  )
}

export { UpButton }
export type { UpButtonProps }
