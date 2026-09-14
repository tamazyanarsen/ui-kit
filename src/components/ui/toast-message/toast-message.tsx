import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Button } from "@/components/ui/button"

import { TOAST_BG, TOAST_BORDER, TOAST_ICON, TOAST_ICON_COLOR } from "./variants"
import { ToastProvider } from "./provider"
import { useToast, type ToastItem } from "./use-toast"
import { CloseCross } from "@/components/ui/close-cross"

// Toast Message — "Всплывающее уведомление". Shows a notification
// noticeably without blocking the user's work; auto-dismisses after 4s
// (дизайн-чек от 13.09, замечание 20). `data` carries the two optional
// buttons (Type (Button): Two Buttons / Black Button / White Button).
//
// Очередь, таймеры и пауза по наведению живут в `./provider`.
//
// Hand-rolled state (Context + useState + timers) rather than Base UI's
// own Toast primitive: that primitive's store (`useToastManager`) never
// reflected `.add()` calls in this project's exact setup — reproduced with
// a minimal, textbook-correct usage both nested in the app tree and
// mounted standalone at the app root, so it isn't a nesting/context
// mistake on this component's part. Everything else in this kit that
// leans on Base UI (Menu, Popover, Tooltip, Accordion, Dialog, ...) works
// fine; this is scoped to Toast specifically.

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
      // Появление общее у всех, уход — по судьбе сообщения. Числа и кадры —
      // в styles/base.css, длительности в tokens-motion.css.
      className={cn(
        "w-full min-w-[320px] shrink-0 rounded-[16px] p-4 shadow-universal desktop:p-6",
        "motion-safe:animate-[toast-in_var(--duration-overlay)_var(--ease-out)_both]",
        toast.closing &&
          (behavior === "collected"
            ? "motion-safe:animate-[toast-out-collected_var(--duration-overlay)_var(--ease-out)_forwards]"
            : "motion-safe:animate-[toast-out-transient_var(--duration-overlay)_var(--ease-out)_forwards]"),
        // При выключенном движении карточка всё равно должна пропадать, иначе
        // она зависнет на экране навсегда: анимации не играют, а снятие узла
        // произойдёт по таймеру.
        toast.closing && "motion-reduce:opacity-0"
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
  const { toasts, close, pause, resume } = useToast()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      // «По ховеру на область уведомлений (включая отступы между) — пауза по
      // времени жизни на все уведомления» (дизайн-чек от 13.09, замечание
      // 20). Обработчики висят на колонке, а сама она указателя не принимает
      // (`pointer-events-none`) — иначе её невидимая коробка во всю высоту
      // экрана перехватывала бы клики по странице. Приём возвращают строки, и
      // зазоры между ними закрывает псевдоэлемент строки (см. `ToastRow`).
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
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
      //
      // ⚠️ `overflow-clip` заменён на `clip-path`, и вот почему.
      //
      // Подрезка нужна СВЕРХУ (складывание стопки, дизайн-чек от 08.09,
      // замечание 13 — с запасом под тень), но мешает СПРАВА: уходящий
      // «отклик системы» уезжает на 520 px за габарит колонки (дизайн-чек от
      // 13.09, замечание 20), и `overflow` съедал бы весь полёт. Одним
      // свойством разные поля по сторонам задаёт только `clip-path`:
      // 560 px запаса справа под полёт, 24 по низу и слева под тень, а сверху
      // отрицательное поле ровно в тот отступ, с которым колонка стоит от
      // шапки (16 / 32). Из-за него «информирующий» тост, уходящий вверх на
      // 200 px, виден до самой кромки шапки и там пропадает — то есть уходит
      // ПОД ШАПКУ, как и написано в документации, хотя лежит слоем выше неё
      // (`--z-toast` 50 против `z-40` у шапки).
      //
      // ⚠️ Правый отступ — ПО СЕТКЕ, а не фиксированные 40 px. «Финальная
      // позиция с отступом от правого края 40 px по сетке страницы»
      // (замечание 20): до 1880 поле сетки и есть 40, а выше контент стоит на
      // 1800 и растут поля — колонка обязана ехать вместе с ним, иначе на
      // широком экране тост отрывается от содержимого страницы. Выражение то
      // же, которым меряет себя полоса: половина того, что осталось от
      // ширины за вычетом контентной полосы.
      className="pointer-events-none fixed inset-x-4 top-[calc(var(--viewport-inset-top,0px)+1rem)] z-(--z-toast) flex max-h-[calc(100vh-var(--viewport-inset-top,0px)-2rem)] flex-col justify-end gap-6 [clip-path:inset(-1rem_-560px_-1.5rem_-1.5rem)] desktop:inset-x-auto desktop:top-[calc(var(--viewport-inset-top,0px)+2rem)] desktop:right-[calc((100%-var(--grid-content-width))/2)] desktop:max-h-[calc(100vh-var(--viewport-inset-top,0px)-4rem)] desktop:w-[480px] desktop:[clip-path:inset(-2rem_-560px_-1.5rem_-1.5rem)]"
    >
      {/* Порядок прямой: первый в списке — самый старый, он же выше всех. */}
      {toasts.map((toast) => (
        <ToastRow key={toast.id} closing={Boolean(toast.closing)}>
          <ToastCard toast={toast} onClose={() => close(toast.id)} />
        </ToastRow>
      ))}
    </div>
  )
}

/**
 * Строка колонки: держит место под карточку и отдаёт его соседям, когда
 * карточка уходит.
 *
 * «При уходе/закрытии уведомления последующее занимает его место. Одинаковое
 * время исчезновения независимо от высоты. Время сдвига совпадает с временем
 * исчезновения» — дизайн-чек от 13.09, замечание 20.
 *
 * Механика — `grid-template-rows: 1fr → 0fr`. Ровно этим она и отличается от
 * прежней (схлопывание `max-height` внутри кадров ухода): переход всегда
 * длится заданные 300 ms, какой бы высоты ни была карточка, тогда как путь от
 * общего потолка 320 px низкая карточка проходила «вхолостую».
 *
 * ⚠️ Внутренний узел НЕ режет переполнение. Обычно у этого приёма стоит
 * `overflow: hidden`, но здесь он срезал бы и тень карточки, и её полёт на
 * 520 px вправо. Видимое переполнение схлопывающейся строки не мешает:
 * карточка в этот момент уже улетает и гаснет.
 *
 * `-mb-6` съедает зазор колонки (24) — без него на месте ушедшей карточки
 * оставался бы пустой интервал.
 *
 * Псевдоэлемент `after` закрывает этот самый зазор для НАВЕДЕНИЯ: без него
 * курсор, идущий между карточками, ронял бы паузу и время жизни дёргалось бы.
 */
function ToastRow({
  closing,
  children,
}: {
  closing: boolean
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="toast-row"
      data-closing={closing || undefined}
      className={cn(
        "pointer-events-auto relative grid transition-all duration-300 ease-out",
        "after:absolute after:inset-x-0 after:top-full after:h-6 after:content-['']",
        closing ? "-mb-6 grid-rows-[0fr]" : "grid-rows-[1fr]"
      )}
    >
      <div className="min-h-0">{children}</div>
    </div>
  )
}

// ToastCard is the presentational half of the component (the Toaster owns
// mounting/timing). It's exported for the Storybook state matrix, which has
// to render every type/button combination at once — going through
// `toast.add()` would stack them on a timer instead. Not re-exported from
// index.ts: consumers should still go through `useToast()`.
export { ToastProvider, Toaster, ToastCard }
