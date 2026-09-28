import type { TableColumn } from "./column-settings"

/**
 * Видим ли столбец: `visible` необязателен, и его отсутствие — «виден».
 * Раньше пропущенный `visible` читался как «скрыт»: столбец `{ id, label }`
 * пропадал из таблицы, а чекбокс настройки получал `checked={undefined}` и
 * становился неуправляемым.
 */
function isColumnVisible(column: TableColumn) {
  return column.visible !== false
}

export { isColumnVisible }
