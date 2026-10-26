import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { menuClickOpenProps } from "@/lib/menu-click-open"

import { Bell } from "@/icons"
import { cn } from "@/lib/utils"
import { hasContent } from "@/lib/has-content"
import { compactList } from "@/components/ui/header-menu/compact-list"
import { Badge } from "@/components/ui/badge"
import { Scrollbar } from "@/components/ui/scrollbar"

import { HEADER_ICON_TILE_ACCENT, HeaderMenuPopup } from "./menu-popup"

// Выпадающий список уведомлений — собственное содержимое всплывающего окна
// у значка колокольчика. Намеренно не построен на общем компоненте
// Notification (src/components/ui/notification): его собственный макет
// помечен «Actual old», а устройство строки там (заголовок, затем жирная
// строка суммы, затем строки статуса и описания) не совпадает со строкой
// этого списка («Название» и прижатые вправо статус или сумма в той же
// строке, затем организация, отметка времени и описание). Натягивание
// одного на другое либо рисовалось бы неправильно, либо потребовало бы
// менять компонент, трогать который в эту задачу не входит.
interface NotificationMenuItem {
  id: string
  title: React.ReactNode
  status?: React.ReactNode
  org: React.ReactNode
  timestamp: React.ReactNode
  description: React.ReactNode
  viewed?: boolean
  onClick?: () => void
}

interface NotificationMenuProps {
  items: NotificationMenuItem[]
  unreadCount?: number
  /**
   * Нажатие ведёт в раздел уведомлений, а не раскрывает список. Мобильная
   * шапка (Правки UI-Kit от 25.10): там колокольчик — обычная кнопка
   * перехода, без выпадающего списка; счётчик, подсветка и сжатие те же.
   */
  onNavigate?: () => void
  /** Без списка: значок — кнопка перехода (`onNavigate`). */
  asLink?: boolean
  className?: string
}

/**
 * Кнопка-значок шапки со счётчиком (уведомления, сообщения).
 *
 * Правки UI-Kit от 25.10: при нажатии значок вместе со счётчиком сжимается
 * до 0,92, как маленькие кнопки-значки (нажатие 140 мс, отпускание 280 мс по
 * мягкой кривой; при `prefers-reduced-motion` — без сжатия). Сжимается
 * обёртка значка (`press-scale-content`), а не плитка: подсветка счётчика
 * — фон самой плитки — остаётся на месте и своим переходом.
 */
const HEADER_ICON_PRESS = "press-scale-content [--press-scale:0.92]"

/** Подписи под заголовком выровнены по тексту, а не по точке-индикатору. */
const META_LINE = "pl-3.5 text-p3-medium text-[var(--header-meta-fg)]"

/**
 * Подсветка колокольчика, когда счётчик вырос.
 *
 * Дизайн-чек от 13.09, замечание 20, «Точное описание из документации»:
 * «Меняется счетчик на колокольчике. Подсветка кнопки колокольчика на 1
 * секунду (Grey 114)» — это то, что происходит, когда информирующий тост
 * уходит в центр уведомлений.
 *
 * ⚠️ Правило локальное, а не проброшенное из тостов. Подсветку можно было
 * завести пропом и звать из провайдера тостов, но тогда шапка обязана была бы
 * стоять внутри `ToastProvider` и знать про него, а центр уведомлений
 * наполняется приложением, а не китом. Смотреть на СВОЙ счётчик надёжнее:
 * подсветка срабатывает от любого прироста — и от тоста, и от опроса сервера,
 * и от чужой вкладки. Уменьшение счётчика (прочитали) ничего не подсвечивает.
 */
function useCounterHighlight(count: number, ms = 1000) {
  const [highlighted, setHighlighted] = React.useState(false)
  const previous = React.useRef(count)

  React.useEffect(() => {
    const grew = count > previous.current
    previous.current = count
    // ⚠️ Без роста подсветка гасится явно. Очистка прошлого эффекта снимает
    // таймер, который её выключил бы: уведомление пришло и было прочитано
    // раньше, чем прошла секунда, — и фон Grey 114 оставался навсегда.
    if (!grew) {
      setHighlighted(false)
      return
    }
    setHighlighted(true)
    const timer = window.setTimeout(() => setHighlighted(false), ms)
    return () => window.clearTimeout(timer)
  }, [count, ms])

  return highlighted
}

function NotificationRow({ item }: { item: NotificationMenuItem }) {
  return (
    <MenuPrimitive.Item
      onClick={item.onClick}
      data-slot="notification-menu-item"
      // Общая строка выпадающего списка (Правки UI-Kit от 25.10): Grey 114 /
      // Grey 124 от `menu-row`, рука, содержимое — одной обёрткой, которая
      // сжимается к центру строки.
      className="menu-row press-scale-content flex cursor-pointer flex-col px-4 py-3 outline-none select-none"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <span className="flex items-start gap-2">
            {!item.viewed && (
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--header-unread-dot)]"
              />
            )}
            <span
              className={cn(
                "text-p2-medium",
                item.viewed
                  ? "text-[var(--header-meta-fg)]"
                  : "font-medium text-[var(--header-fg)]"
              )}
            >
              {item.title}
            </span>
          </span>
          {hasContent(item.status) && (
            <span className="shrink-0 text-p2-medium text-[var(--header-fg)]">
              {item.status}
            </span>
          )}
        </div>
        <span className={META_LINE}>{item.org}</span>
        <span className={META_LINE}>{item.timestamp}</span>
        <span className={META_LINE}>{item.description}</span>
      </div>
    </MenuPrimitive.Item>
  )
}

/** Значок колокольчика со счётчиком — общий у списка и у кнопки перехода. */
function BellGlyph({ count }: { count: number }) {
  return (
    // Бейдж крепится к самой иконке, а не к плитке: иначе он уезжает
    // в угол блока 56×64 вместо угла глифа 24×24.
    <span className="relative flex">
      <Bell size={24} aria-hidden="true" className="size-6" />
      {count > 0 && (
        <Badge
          type="counter"
          color="red"
          value={count}
          className="absolute -top-1 -right-1"
        />
      )}
    </span>
  )
}

function NotificationMenu({
  items: rawItems,
  unreadCount = 0,
  onNavigate,
  asLink = false,
  className,
}: NotificationMenuProps) {
  // Меню экспортируется отдельно от Header: пустые элементы отбрасываются и здесь.
  const items = compactList(rawItems) ?? []
  const highlighted = useCounterHighlight(unreadCount)
  const triggerClass = cn(
    HEADER_ICON_TILE_ACCENT,
    HEADER_ICON_PRESS,
    // Grey 114 из документации; держится секунду и гаснет плавно.
    "transition-colors duration-300 ease-out",
    highlighted && "bg-[var(--header-notification-highlight-bg)]",
    className
  )

  if (asLink) {
    return (
      <button
        type="button"
        aria-label="Уведомления"
        data-slot="notification-menu-trigger"
        data-highlighted={highlighted || undefined}
        onClick={onNavigate}
        className={triggerClass}
      >
        <BellGlyph count={unreadCount} />
      </button>
    )
  }

  return (
    <MenuPrimitive.Root modal={false}>
      <MenuPrimitive.Trigger {...menuClickOpenProps}
        render={
          <button
            type="button"
            aria-label="Уведомления"
            data-slot="notification-menu-trigger"
            data-highlighted={highlighted || undefined}
            className={triggerClass}
          />
        }
      >
        <BellGlyph count={unreadCount} />
      </MenuPrimitive.Trigger>

      <HeaderMenuPopup
        slot="notification-menu-content"
        align="start"
        className="flex w-[380px] max-w-[calc(100vw-2rem)] flex-col"
      >
        <p className="border-b border-[var(--header-divider)] px-4 py-3 text-p1-medium text-[var(--header-fg)]">
          Уведомления
        </p>
        {/* По макету: фиксированная высота 584px, когда содержимое до неё
            дорастает, дальше прокрутка, и нижний отступ 32px. Здесь
            ограничение ниже (420px), потому что демонстрационного
            содержимого в ките всего два пункта, но механика прокрутки и
            отступа та же. */}
        <Scrollbar
        inset="dropdown"
        className="flex max-h-[420px] flex-col divide-y divide-[var(--header-divider)] pb-8"
      >
          {items.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </Scrollbar>
      </HeaderMenuPopup>
    </MenuPrimitive.Root>
  )
}

export { HEADER_ICON_PRESS, NotificationMenu }
export type { NotificationMenuItem, NotificationMenuProps }
