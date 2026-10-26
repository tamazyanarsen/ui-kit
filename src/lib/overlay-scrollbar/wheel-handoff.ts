/**
 * Передача колеса между блоком с прокруткой и страницей — Правки UI-Kit от
 * 25.10, «Scrollbar — видимость полосы и передача прокрутки странице».
 *
 * Браузер «прилипает» жестом к тому, с чего он начался: докрутив блок до
 * края, страница не едет до нового жеста, а начав листать страницу, блок
 * под курсором колесо не подхватывает. Правило документа:
 *
 *   • блок докрутили до края сами (он сдвигался в последние 250 мс) — он
 *     держит колесо 500 мс, потом остаток хода уходит странице;
 *   • блоку прокручивать нечего или он уже стоял у края — сразу странице;
 *   • страница двигалась в последние 250 мс, а блок стоял, и блоку есть
 *     куда ехать в эту сторону — колесо подхватывает блок до конца жеста
 *     (жест кончается паузой колеса больше 200 мс).
 *
 * Здесь только решение: чистая функция от состояния и времени, чтобы
 * правило проверялось тестом без DOM и без настоящего колеса.
 */

/** Блок «сдвигался недавно» / страница «двигалась недавно». */
export const RECENT_MOVE_MS = 250
/** Сколько блок держит колесо, когда его докрутили до края. */
export const EDGE_HOLD_MS = 500
/** Пауза колеса, после которой начинается новый жест. */
export const GESTURE_GAP_MS = 200

export interface WheelHandoffState {
  /** Время последнего колеса над блоком (начало жеста определяется паузой). */
  lastWheel: number
  /** Кому принадлежит текущий жест, если это уже решено. */
  owner: "block" | null
  /** До какого момента блок держит колесо у края (0 — не держит). */
  holdUntil: number
}

export function createWheelHandoffState(): WheelHandoffState {
  return { lastWheel: -Infinity, owner: null, holdUntil: 0 }
}

export interface WheelInput {
  now: number
  /** Направление колеса: > 0 — вниз. */
  delta: number
  /** Положение и размеры области блока. */
  position: number
  client: number
  scroll: number
  /** Последний сдвиг блока и страницы (по событию scroll). */
  lastBlockMove: number
  lastPageMove: number
}

/**
 * Что сделать с колесом:
 *   • `native` — не вмешиваться: браузер листает блок сам (или страницу,
 *     если блоку прокручивать нечего вовсе);
 *   • `block` — отменить событие и прокрутить блок вручную (браузер
 *     прилип к странице);
 *   • `hold` — отменить и ничего не листать (блок держит колесо у края);
 *   • `page` — отменить и прокрутить страницу вручную (браузер прилип к
 *     блоку).
 */
export type WheelDecision = "native" | "block" | "hold" | "page"

function canScroll({ delta, position, client, scroll }: WheelInput) {
  const max = scroll - client
  if (max <= 1) return false
  return delta > 0 ? position < max - 1 : position > 1
}

/** Решение по одному событию колеса. Состояние меняется на месте. */
export function decideWheel(state: WheelHandoffState, input: WheelInput): WheelDecision {
  const { now } = input
  if (now - state.lastWheel > GESTURE_GAP_MS) state.owner = null
  state.lastWheel = now

  // Блоку прокручивать нечего совсем — браузер и сам отдаёт колесо странице
  // (прилипать не к чему), а родная прокрутка плавнее ручной.
  if (input.scroll - input.client <= 1) return "native"

  if (!canScroll(input)) {
    if (now < state.holdUntil) return "hold"
    if (state.holdUntil === 0 && now - input.lastBlockMove < RECENT_MOVE_MS) {
      state.holdUntil = now + EDGE_HOLD_MS
      return "hold"
    }
    return "page"
  }

  // Есть куда ехать — держание у края больше не действует.
  state.holdUntil = 0
  if (state.owner === "block") return "block"
  const pageMoving = now - input.lastPageMove < RECENT_MOVE_MS
  const blockStill = now - input.lastBlockMove >= RECENT_MOVE_MS
  if (pageMoving && blockStill) {
    state.owner = "block"
    return "block"
  }
  return "native"
}

/** Колесо в пикселях: строки и страницы пересчитываются. */
export function wheelDeltaPx(event: Pick<WheelEvent, "deltaY" | "deltaMode">, page: number) {
  if (event.deltaMode === 1) return event.deltaY * 16
  if (event.deltaMode === 2) return event.deltaY * page
  return event.deltaY
}
