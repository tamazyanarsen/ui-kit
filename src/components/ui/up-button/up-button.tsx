import * as React from "react"
import { ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Up Button — "Кнопка наверх": anatomy is Button's own Icon/Small form
// (secondary-white, 32px circle — size-8 rounded-2xl is an exact circle),
// per ui/button-up/up button.png's own "аналогична Button + Анатомия +
// Small" note. Per spec: appears bottom-right once the page has scrolled,
// hides again while a floating element (modal/sheet/etc) is open —
// `scrollContainer` targets that scroll source (defaults to window),
// `hidden` lets a consumer force it away for the floating-element case.
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
      variant="secondary-white"
      size="sm"
      iconPosition="only"
      icon={ChevronUp}
      aria-label="Наверх"
      onClick={handleClick}
      className={cn("fixed right-6 bottom-6 z-40 shadow-[0_4px_16px_rgba(0,0,0,0.16)]", className)}
    />
  )
}

export { UpButton }
export type { UpButtonProps }
