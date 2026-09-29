import * as React from "react"

import { Button } from "@/components/ui/button"

/* Живая обёртка для историй компонентов, которые сами не убирают себя из
   разметки: крестик у них только зовёт `onClose`, а что делать дальше —
   решает вызывающий код. Без обёртки крестик в Storybook ничего не делал, и
   поведение нельзя было проверить в браузере.

   После закрытия ставится кнопка «Показать снова», и фокус переходит на неё:
   иначе он падает на body, и клавиатурного пользователя выбрасывает в начало
   страницы (то же правило у самих компонентов кита — см. NpsDone).
   Счётчик закрытий виден на странице, чтобы значение проверялось без
   внутренностей компонента. */
interface DismissibleProps {
  /** Содержимое; `onClose` отдаётся тому узлу, чей крестик закрывает. */
  children: (onClose: () => void) => React.ReactNode
  /** Сменился — обёртка показывает содержимое заново (сброс из контролов). */
  resetKey?: string
}

function Dismissible({ children, resetKey }: DismissibleProps) {
  const [closed, setClosed] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const restoreRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const wasClosed = React.useRef(false)

  // Смена ключа возвращает содержимое (корректировка во время рендера).
  const [lastKey, setLastKey] = React.useState(resetKey)
  if (lastKey !== resetKey) {
    setLastKey(resetKey)
    setClosed(false)
  }

  React.useEffect(() => {
    // Фокус переезжает только в момент самой смены, не при первом рендере:
    // при закрытии — на «Показать снова», при возврате — на первую кнопку
    // содержимого (кнопки, на которую нажали, уже нет).
    if (closed && !wasClosed.current) restoreRef.current?.focus()
    if (!closed && wasClosed.current) {
      contentRef.current?.querySelector<HTMLElement>("button")?.focus()
    }
    wasClosed.current = closed
  }, [closed])

  return (
    <div className="flex flex-col gap-4">
      {closed ? (
        <div>
          <Button
            ref={restoreRef}
            type="button"
            variant="secondary-grey"
            size="sm"
            onClick={() => setClosed(false)}
          >
            Показать снова
          </Button>
        </div>
      ) : (
        <div ref={contentRef}>
          {children(() => {
            setClosed(true)
            setCount((n) => n + 1)
          })}
        </div>
      )}
      <p data-slot="story-status" className="text-p3-medium text-[var(--nps-subtitle-fg)]">
        Закрыто раз: {count}
      </p>
    </div>
  )
}

export { Dismissible }
