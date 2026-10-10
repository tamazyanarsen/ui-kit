import type { NotificationMenuItem } from "./notification-menu"

/**
 * Число непрочитанных уведомлений — на плитке колокольчика. Одно правило
 * для десктопной и мобильной шапки (ревью 10.10, КК-2: мобильная повторяла
 * его своей строкой).
 */
function countUnread(items: NotificationMenuItem[]) {
  return items.filter((item) => !item.viewed).length
}

export { countUnread }
