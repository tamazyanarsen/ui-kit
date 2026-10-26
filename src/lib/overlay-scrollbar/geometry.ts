/**
 * Геометрия наложенной полосы прокрутки — чистые функции без DOM, чтобы их
 * можно было проверить тестом без раскладки (в jsdom её нет).
 *
 * Правки UI-Kit от 25.10, «Scrollbar — родные полосы браузера вместо полос
 * кита»: минимальная длина бегунка 24, нажатие на дорожку листает на 90 %
 * высоты области в сторону нажатия.
 */

/** Минимальная длина бегунка по документу. */
export const MIN_THUMB = 24

/** Доля видимой высоты области, на которую листает нажатие на дорожку. */
export const TRACK_PAGE_RATIO = 0.9

export interface ScrollMetrics {
  /** Видимый размер области по оси (`clientHeight` / `clientWidth`). */
  client: number
  /** Полный размер содержимого по оси (`scrollHeight` / `scrollWidth`). */
  scroll: number
  /** Текущее положение (`scrollTop` / `scrollLeft`). */
  position: number
}

export interface ThumbGeometry {
  /** Есть что прокручивать — полоса вообще нужна. */
  scrollable: boolean
  /** Длина бегунка в пикселях. */
  size: number
  /** Сдвиг бегунка от начала дорожки. */
  offset: number
}

/** Запас в 1px: дробные размеры дают `scrollHeight` на единицу больше
 *  `clientHeight` и там, где прокручивать на деле нечего. */
export function isScrollable({ client, scroll }: Pick<ScrollMetrics, "client" | "scroll">) {
  return scroll - client > 1
}

/**
 * Длина и положение бегунка на дорожке длиной `track`.
 *
 * Длина пропорциональна доле видимого (`client / scroll`), но не меньше
 * `MIN_THUMB` и не больше дорожки. Сдвиг — та же доля пройденного пути,
 * что и у области, только путь бегунка — `track − size`.
 */
export function computeThumb(
  metrics: ScrollMetrics,
  track: number,
  minThumb = MIN_THUMB
): ThumbGeometry {
  const { client, scroll, position } = metrics
  if (!isScrollable(metrics) || track <= 0) {
    return { scrollable: false, size: 0, offset: 0 }
  }
  const size = Math.min(track, Math.max(minThumb, (client / scroll) * track))
  const maxScroll = scroll - client
  const ratio = Math.min(1, Math.max(0, position / maxScroll))
  return { scrollable: true, size, offset: ratio * (track - size) }
}

/**
 * Перевод сдвига указателя по дорожке в сдвиг прокрутки: путь бегунка
 * (`track − size`) соответствует всему пути области (`scroll − client`).
 */
export function dragDelta(
  pointerDelta: number,
  metrics: Pick<ScrollMetrics, "client" | "scroll">,
  track: number,
  thumbSize: number
): number {
  const travel = track - thumbSize
  if (travel <= 0) return 0
  return (pointerDelta * (metrics.scroll - metrics.client)) / travel
}

/**
 * Куда встать после нажатия на дорожку: на 90 % видимой высоты в сторону
 * нажатия (`point` — координата нажатия от начала дорожки). Нажатие на сам
 * бегунок прокрутку не меняет — с него начинается перетаскивание.
 */
export function trackClickTarget(
  metrics: ScrollMetrics,
  thumb: Pick<ThumbGeometry, "size" | "offset">,
  point: number
): number {
  const max = Math.max(0, metrics.scroll - metrics.client)
  if (point >= thumb.offset && point <= thumb.offset + thumb.size) return metrics.position
  const step = metrics.client * TRACK_PAGE_RATIO
  const next = point < thumb.offset ? metrics.position - step : metrics.position + step
  return Math.min(max, Math.max(0, next))
}
