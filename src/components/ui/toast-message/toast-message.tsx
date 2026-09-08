import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Button } from "@/components/ui/button"

import { TOAST_BG, TOAST_BORDER, TOAST_ICON, TOAST_ICON_COLOR } from "./variants"
import { ToastContext, useToast, type ToastItem, type ToastOptions } from "./use-toast"
import { CloseCross } from "@/components/ui/close-cross"

// Toast Message — "Всплывающее уведомление". Shows a notification
// noticeably without blocking the user's work; auto-dismisses after 8s
// (the spec's own timing). `data` carries the two optional buttons (Type
// (Button): Two Buttons / Black Button / White Button).
//
// Hand-rolled state (Context + useState + timers) rather than Base UI's
// own Toast primitive: that primitive's store (`useToastManager`) never
// reflected `.add()` calls in this project's exact setup — reproduced with
// a minimal, textbook-correct usage both nested in the app tree and
// mounted standalone at the app root, so it isn't a nesting/context
// mistake on this component's part. Everything else in this kit that
// leans on Base UI (Menu, Popover, Tooltip, Accordion, Dialog, ...) works
// fine; this is scoped to Toast specifically.

/**
 * Сколько длится уход тоста. Держится в паре с длительностью анимаций
 * `toast-out-*` в styles/base.css: узел снимается ПОСЛЕ того, как анимация
 * доиграла, иначе он просто пропадал бы кадром.
 */
const EXIT_DURATION = 260

// ToastProvider — 8s default timeout per the spec ("Время отображения
// всплывающего сообщения 8 сек").
//
// ⚠️ Предела количеству НЕТ. Дизайн-чек от 08.09, замечание 14: «Нажал
// копирование несколько раз (7), но тостов предельно возникает три. Такого
// быть не должно, новые просто должны продолжать появляться ниже. Предел
// нужно убрать». Раньше здесь стоял `limit = 3` и `.slice(0, limit)`, то есть
// четвёртое нажатие молча выбрасывало сообщение. Колонка и без предела не
// растянет страницу: она ограничена высотой вьюпорта и подрезает СТАРЫЕ
// карточки сверху (см. `Toaster`).
function ToastProvider({
  timeout = 8000,
  children,
}: {
  timeout?: number
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const timers = React.useRef(new Map<string, number>())

  const forget = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer !== undefined) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  // Закрытие идёт в два шага: сначала карточка помечается уходящей и
  // доигрывает свою анимацию, и только потом снимается. Одним шагом она
  // исчезала кадром — дизайн-чек от 08.09, замечание 15.
  const close = React.useCallback(
    (id: string) => {
      let alreadyClosing = false
      setToasts((prev) =>
        prev.map((toast) => {
          if (toast.id !== id) return toast
          alreadyClosing = Boolean(toast.closing)
          return { ...toast, closing: true }
        })
      )
      if (alreadyClosing) return
      const timer = window.setTimeout(() => forget(id), EXIT_DURATION)
      timers.current.set(id, timer)
    },
    [forget]
  )

  const add = React.useCallback(
    (options: ToastOptions) => {
      const id = `toast-${Math.random().toString(36).slice(2, 10)}`
      const duration = options.timeout ?? timeout
      // В КОНЕЦ: «новые просто должны продолжать появляться ниже».
      setToasts((prev) => [...prev, { ...options, id }])
      if (duration > 0) {
        const timer = window.setTimeout(() => close(id), duration)
        timers.current.set(id, timer)
      }
      return id
    },
    [timeout, close]
  )

  React.useEffect(() => {
    const timerMap = timers.current
    return () => {
      timerMap.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const value = React.useMemo(
    () => ({ toasts, add, close }),
    [toasts, add, close]
  )

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem
  onClose: () => void
}) {
  const type = toast.type ?? "information"
  const Icon = TOAST_ICON[type]
  const isDesktop = useIsDesktop()
  const data = toast.data
  const showCross = toast.showCross ?? true

  // Уход — двумя разными способами, по судьбе сообщения (дизайн-чек от
  // 08.09, замечание 15; сами кадры — `toast-out-*` в styles/base.css).
  const behavior = toast.behavior ?? "collected"

  return (
    <div
      data-slot="toast"
      data-behavior={behavior}
      data-closing={toast.closing || undefined}
      role="status"
      // Size=Mobile is a 328px card with 16px padding and a 16px close
      // cross; Size=Desktop is 480px with 24px padding and a 24px cross.
      className={cn(
        "w-full min-w-[320px] shrink-0 rounded-[16px] p-4 shadow-universal desktop:p-6",
        toast.closing
          ? behavior === "collected"
            ? "animate-[toast-out-collected_260ms_cubic-bezier(0.4,0,1,1)_forwards]"
            : "animate-[toast-out-transient_260ms_cubic-bezier(0.4,0,1,1)_forwards]"
          : "animate-in fade-in-0 slide-in-from-right-4"
      )}
      style={{
        backgroundColor: TOAST_BG[type],
        // Дизайн-чек 3/3 №31: «сейчас размер тоста 76px, должен быть 74px».
        // В Figma обводка нарисована ВНУТРЬ рамки, поэтому не увеличивает
        // высоту: 24 (pt) + 2 (pt-0.5 текстовой колонки) + 24 (Title 16/24)
        // + 24 (pb) = 74 (774:134177). CSS-`border` же добавлялся снаружи и
        // давал 76. `outline` с отрицательным offset рисует ту же линию, но
        // вне потока — высота становится ровно 74.
        outline: `1px solid ${TOAST_BORDER[type]}`,
        outlineOffset: "-1px",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Дизайн-чек №3 №5: «иконки тоста некорректные — слишком жирное
            начертание». Плитка 24px и на десктопе, и на мобиле, поэтому
            нужен именно 24px-рисунок из Figma, а не 16px, растянутый до
            24: у второго кольцо и штрихи в полтора раза толще. */}
        <Icon
          size={24}
          aria-hidden="true"
          className="size-6 shrink-0"
          style={{ color: TOAST_ICON_COLOR[type] }}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
          {/* Size=Mobile steps the whole text block down one notch, like
              Informer does: Title 14/20 and Description 12/16 against
              16/24 and 14/20 on Size=Desktop (master `ELK / toast
              message` v2.0.0, node 774:134168). */}
          <span className="text-p2-medium text-[var(--toast-title-fg)] desktop:text-p1-medium">
            {toast.title}
          </span>

          {toast.description && (
            <p className="text-p3-medium text-[var(--toast-description-fg)] desktop:text-p2-medium">
              {toast.description}
            </p>
          )}

          {(data?.primaryButtonLabel || data?.secondaryButtonLabel) && (
            <div className="flex items-center gap-2 pt-2">
              {data?.primaryButtonLabel && (
                <Button
                  type="button"
                  variant="secondary-black"
                  size="sm"
                  onClick={data.onPrimaryButtonClick}
                >
                  {data.primaryButtonLabel}
                </Button>
              )}
              {data?.secondaryButtonLabel && (
                <Button
                  type="button"
                  variant="secondary-white"
                  size="sm"
                  onClick={data.onSecondaryButtonClick}
                >
                  {data.secondaryButtonLabel}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Дизайн-чек 3/3 №8: Show Cross — свойство компонент-сета
            `ELK / toast message` (774:134186), поэтому крестик отключаемый. */}
        {showCross && (
        /* Дизайн-чек №3 №9: «Некорректное начертание крестика… ещё
           заметил в toast message». У крестика два самостоятельных рисунка,
           и 24px-коробка должна получать 24px-глиф, иначе линии выходят на
           треть толще макета. Размер здесь меняется брейкпоинтом (16 → 24),
           поэтому выбирать приходится в JS, а не вариантом. */
        <CloseCross
          size={isDesktop ? 24 : 16}
          onClick={onClose}
          className="text-[var(--toast-close-fg)]"
        />
        )}
      </div>
    </div>
  )
}

// Toaster — the fixed viewport. Per the spec: desktop top-right, 32px
// from the header, 40px from the right edge, 24px gap between stacked
// toasts; mobile: top, 16px edge padding.
//
// «От ШАПКИ», а не от края вьюпорта — и это разные числа, как только шапка
// закреплена (`Header pinned`). Отсчёт от нуля клал тост ПОВЕРХ шапки,
// закрывая переключатель организации и значки уведомлений; поймано на
// песочном экране «Реестр заявок на аккредитив», где тост нарисован ниже
// шапки, а рисовался на ней.
//
// Занятую высоту публикует сама шапка (`useViewportInsetTop`), и это тот же
// механизм, которым уже пользуются липкая шапка таблицы сверху и полоса
// прокрутки снизу (`--viewport-inset-bottom`). Отступ спецификации (16
// мобильный / 32 десктопный) прибавляется к нему, а не заменяет: без
// закреплённой шапки переменная равна нулю и поведение прежнее.
function Toaster() {
  const { toasts, close } = useToast()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      // ⚠️ Колонка ОГРАНИЧЕНА высотой вьюпорта и складывается сверху вниз.
      //
      // Дизайн-чек от 07.09, замечание 21: «окно [опроса] складывает тосты в
      // стопку и накрывает их, если во вьюпорте мало высоты. Заложить
      // возможности складывания тостов и перекрытия». Раньше колонка росла
      // без границы и на низком экране уезжала за его край — «сложить» её
      // было нечем, а окно опроса вдобавок лежало на том же слое.
      //
      // `max-height` + подрезка дают складывание: лишние карточки
      // подрезаются вьюпортом, а не растягивают страницу. `flex-col` +
      // `justify-end` оставляют на виду САМЫЕ СВЕЖИЕ: новые прибавляются
      // снизу («новые просто должны продолжать появляться ниже», дизайн-чек
      // от 08.09, замечание 14), а переполнение уходит вверх, то есть
      // подрезается старое.
      //
      // ⚠️ Подрезка именно `overflow: clip` с полем 24px, а не
      // `overflow: hidden`. Дизайн-чек от 08.09, замечание 13: «Обрезается
      // тень тост-уведомлений. На уголках видно, что тень есть, но
      // почему-то обрезается контейнером». Тень (`0 4px 12px`) выходит за
      // габарит карточки, а карточка занимает всю ширину колонки — `hidden`
      // срезал её по бокам. `clip` с `overflow-clip-margin` подрезает по той
      // же коробке, но с запасом под тень, и, в отличие от `hidden`, не
      // делает колонку областью прокрутки.
      className="fixed inset-x-4 top-[calc(var(--viewport-inset-top,0px)+1rem)] z-(--z-toast) flex max-h-[calc(100vh-var(--viewport-inset-top,0px)-2rem)] flex-col justify-end gap-6 overflow-clip [overflow-clip-margin:24px] desktop:inset-x-auto desktop:top-[calc(var(--viewport-inset-top,0px)+2rem)] desktop:right-10 desktop:max-h-[calc(100vh-var(--viewport-inset-top,0px)-4rem)] desktop:w-[480px]"
    >
      {/* Порядок прямой: первый в списке — самый старый, он же выше всех. */}
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => close(toast.id)} />
      ))}
    </div>
  )
}

// ToastCard is the presentational half of the component (the Toaster owns
// mounting/timing). It's exported for the Storybook state matrix, which has
// to render every type/button combination at once — going through
// `toast.add()` would stack them on a timer instead. Not re-exported from
// index.ts: consumers should still go through `useToast()`.
export { ToastProvider, Toaster, ToastCard }
