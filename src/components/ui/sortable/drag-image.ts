/**
 * Без фантома: дизайн-чек 08.10, замечание 7 — «убрать фантом. Полагаемся
 * только на затемнённую заливку на текущем месте плюс на чёрную
 * разделительную линию места приземления».
 *
 * Нативное перетаскивание всегда рисует у курсора полупрозрачную копию
 * строки, и снять её можно только подменой картинки: `setDragImage` с
 * прозрачным пикселем. Картинка создаётся один раз и заранее — Chrome
 * берёт в призрак только уже ЗАГРУЖЕННОЕ изображение, а созданное прямо в
 * `dragstart` ещё пустое, и браузер молча откатывается на копию строки.
 */
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

let pixel: HTMLImageElement | null = null

function transparentDragImage() {
  if (typeof Image === "undefined") return null
  if (!pixel) {
    pixel = new Image(1, 1)
    pixel.src = TRANSPARENT_PIXEL
  }
  return pixel
}

// Засев при загрузке модуля: к первому `dragstart` картинка уже декодирована.
transparentDragImage()

/** Снять фантом у начавшегося перетаскивания. */
function hideDragGhost(dataTransfer: DataTransfer | null | undefined) {
  const image = transparentDragImage()
  if (!image || typeof dataTransfer?.setDragImage !== "function") return
  dataTransfer.setDragImage(image, 0, 0)
}

export { hideDragGhost }
