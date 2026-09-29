import * as React from "react"

import { cn } from "@/lib/utils"
import { pressHandlers } from "@/lib/press"
import { hasContent } from "@/lib/has-content"
import { hasNode } from "@/lib/has-node"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { Button } from "@/components/ui/button"
import { Scrollbar } from "@/components/ui/scrollbar"

// Notification — панель «Уведомления и новости» и её строка. По макету
// (помеченному «Actual old», в отличие от прочих message/*, — считайте его
// наименее устойчивым из пяти): показывает краткие сообщения о событиях,
// удачных действиях, ошибках или предупреждениях, обычно от значка
// колокольчика в шапке. Точкой непрочитанного управляет один только
// `viewed` (отдельного переключателя для неё в таблице свойств макета
// нет); все остальные разделы (сумма, статус, описание, кнопка)
// необязательны так же, как у Event и Informer.
interface NotificationItemProps {
  title: React.ReactNode
  viewed?: boolean
  sum?: React.ReactNode
  status?: React.ReactNode
  description?: React.ReactNode
  timestamp?: React.ReactNode
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  onClick?: () => void
  className?: string
}

function NotificationItem({
  title,
  viewed = false,
  sum,
  status,
  description,
  timestamp,
  buttonLabel,
  onButtonClick,
  onClick,
  className,
}: NotificationItemProps) {
  const clickable = Boolean(onClick)

  return (
    <div
      data-slot="notification-item"
      data-viewed={viewed || undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...pressHandlers<HTMLDivElement>(onClick)}
      className={cn(
        "flex items-start gap-4 bg-[var(--notification-bg)] px-4 py-6",
        // Наведение и нажатие дают ОДНУ заливку: отдельного Pressed у
        // набора в макете нет, см. комментарий к --notification-bg-hover.
        clickable &&
          "cursor-pointer transition-colors hover:bg-[var(--notification-bg-hover)] active:bg-[var(--notification-bg-hover)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-5 w-2 shrink-0 items-center justify-center"
      >
        {!viewed && (
          <span className="size-2 rounded-full bg-[var(--notification-dot)]" />
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-p1-medium [overflow-wrap:anywhere]",
              viewed
                ? "text-[var(--notification-meta-fg)]"
                : "text-[var(--notification-title-fg)]"
            )}
          >
            {title}
          </span>
          {/* Не `sum &&`: сумма `0` рисовалась голым нулём без стиля. */}
          {sum != null && sum !== false && sum !== "" && (
            <p
              className={cn(
                "text-p2-medium [overflow-wrap:anywhere]",
                viewed
                  ? "text-[var(--notification-meta-fg)]"
                  : "text-[var(--notification-title-fg)]"
              )}
            >
              {sum}
            </p>
          )}
        </div>
        {hasContent(status) && (
          <p className="text-p2-medium [overflow-wrap:anywhere] text-[var(--notification-meta-fg)]">
            {status}
          </p>
        )}
        {hasContent(description) && (
          <p className="text-p2-medium [overflow-wrap:anywhere] text-[var(--notification-meta-fg)]">
            {description}
          </p>
        )}

        {(hasContent(buttonLabel) || hasContent(timestamp)) && (
          // Перенос: строка вне панели (NotificationItem экспортируется сам
          // по себе) на телефоне не вмещала кнопку и время рядом — время
          // уходило за край на 3–58px (аудит 23). Не поместилось — время
          // встаёт под кнопку; в панели 480 ряд прежний.
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-2">
            {hasContent(buttonLabel) ? (
              <Button
                type="button"
                variant="secondary-grey"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation()
                  onButtonClick?.()
                }}
              >
                {buttonLabel}
              </Button>
            ) : (
              <span />
            )}
            {hasContent(timestamp) && (
              <span className="shrink-0 text-p2-medium text-[var(--notification-timestamp-fg)]">
                {timestamp}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface NotificationPanelProps {
  title?: React.ReactNode
  items: NotificationItemProps[]
  showDivider?: boolean
  showScrollBar?: boolean
  maxHeight?: number
  primaryButtonLabel?: React.ReactNode
  onPrimaryButtonClick?: () => void
  secondaryButtonLabel?: React.ReactNode
  onSecondaryButtonClick?: () => void
  className?: string
}

function NotificationPanel({
  title = "Уведомления и новости",
  items,
  showDivider = true,
  showScrollBar = true,
  maxHeight = 400,
  primaryButtonLabel,
  onPrimaryButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
  className,
}: NotificationPanelProps) {
  // Дизайн-чек №3 №13/№14: «Не должно быть разделителя, когда скролл в
  // верхнем положении» и «…в нижнем положении». Линии под шапкой и над
  // подвалом — не рамки блоков, а признак того, что за краем осталась
  // непрочитанная часть списка: сверху она появляется, только когда список
  // уже прокрутили, снизу — пока не домотали до конца. То же правило и в
  // том же виде уже работает в теле модалки, поэтому вынесено в общий
  // `useScrollEdges`.
  const { ref, scrolledFromTop, scrolledToEnd, update } =
    useScrollEdges<HTMLDivElement>([items])

  return (
    <div
      data-slot="notification-panel"
      className={cn(
        "flex w-[480px] flex-col overflow-hidden rounded-[16px] bg-[var(--notification-bg)] shadow-universal",
        className
      )}
    >
      {hasNode(title) && (
        <div
          className={cn(
            "border-b border-transparent px-4 pt-4 pb-3",
            scrolledFromTop && "border-b-[var(--notification-divider)]"
          )}
        >
          <p className="text-h3 [overflow-wrap:anywhere] text-[var(--notification-title-fg)]">
            {title}
          </p>
        </div>
      )}

      <Scrollbar
        ref={ref}
        onScroll={update}
        className={cn(
          "flex flex-col",
          showDivider && "divide-y divide-[var(--notification-divider)]",
          !showScrollBar && "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
        style={{ maxHeight }}
      >
        {items.filter(Boolean).map((item, index) => (
          <NotificationItem key={index} {...item} />
        ))}
      </Scrollbar>

      {(hasContent(primaryButtonLabel) || hasContent(secondaryButtonLabel)) && (
        // Дизайн-чек, замечание 41: каждая кнопка занимает половину
        // строки (раньше размер шёл по собственному тексту, и «Прочитать
        // все» с «Настройками» получались заметно разной ширины).
        <div
          className={cn(
            "flex items-center gap-4 border-t border-transparent p-4 [&>*]:flex-1",
            !scrolledToEnd && "border-t-[var(--notification-divider)]"
          )}
        >
          {hasContent(primaryButtonLabel) && (
            <Button
              type="button"
              variant="secondary-black"
              size="sm"
              onClick={onPrimaryButtonClick}
            >
              {primaryButtonLabel}
            </Button>
          )}
          {hasContent(secondaryButtonLabel) && (
            <Button
              type="button"
              variant="secondary-grey"
              size="sm"
              onClick={onSecondaryButtonClick}
            >
              {secondaryButtonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { NotificationItem, NotificationPanel }
export type { NotificationItemProps, NotificationPanelProps }
