import * as React from "react"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { Button } from "@/components/ui/button"

import { TOAST_BG, TOAST_BORDER, TOAST_ICON, TOAST_ICON_COLOR } from "./variants"
import { ToastProvider } from "./provider"
import { useToast, type ToastItem } from "./use-toast"
import { useToasterPause } from "./use-toaster-pause"
import { CloseCross } from "@/components/ui/close-cross"

// Toast Message — «Всплывающее уведомление». Показывает уведомление
// заметно, но не блокируя работу пользователя; само закрывается через 4
// секунды (дизайн-чек от 13.09, замечание 20). `data` несёт две
// необязательные кнопки (Type (Button): Two Buttons / Black Button /
// White Button).
//
// Очередь, таймеры и пауза по наведению живут в `./provider`.
//
// Состояние написано вручную (контекст, useState и таймеры), а не взято у
// примитива Toast из Base UI: хранилище того примитива
// (`useToastManager`) в этом проекте так и не отразило ни одного вызова
// `.add()`. Воспроизведено на минимальном, образцово-правильном
// использовании — и вложенным в дерево приложения, и смонтированным
// отдельно в его корне, — так что дело не в ошибке вложенности или
// контекста со стороны этого компонента. Всё остальное в ките, что
// опирается на Base UI (Menu, Popover, Tooltip, Accordion, Dialog и
// прочее), работает нормально; проблема касается именно Toast.

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
      // Size=Mobile — это карточка 328px с отступом 16px и крестиком 16px;
      // Size=Desktop — 480px с отступом 24px и крестиком 24px.
      // Минимум 320px — только на десктопе (аудит 14): в мобильной колонке
      // `inset-x-4` на телефоне 320 он был шире колонки (288), и крестик
      // уезжал за край экрана.
      // Появление общее у всех, уход — по судьбе сообщения. Числа и кадры —
      // в styles/base.css, длительности в tokens-motion.css.
      //
      // Мобильный вид (Правки UI-Kit от 25.10, правило каркаса «Тосты в
      // мобильном виде»): стопка у верхней кромки экрана, поэтому тост любого
      // типа уходит ВВЕРХ — на свою высоту и ещё 16 (`toast-out-up`), а не
      // вбок: вбок он уезжал бы за край узкого экрана посреди стопки.
      className={cn(
        "w-full shrink-0 rounded-[16px] p-4 shadow-universal desktop:min-w-[320px] desktop:p-6",
        "motion-safe:animate-[toast-in_var(--duration-overlay)_var(--ease-out)_both]",
        toast.closing &&
          (!isDesktop
            ? "motion-safe:animate-[toast-out-up_var(--duration-overlay)_var(--ease-out)_forwards]"
            : behavior === "collected"
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
        // + 24 (pb) = 74. CSS-`border` же добавлялся снаружи и
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
          {/* Size=Mobile опускает весь текстовый блок на ступень, как это
              делает Informer: заголовок 14/20 и описание 12/16 против
              16/24 и 14/20 при Size=Desktop (мастер `ELK / toast message`
              v2.0.0). */}
          <span className="text-p1-medium-adaptive break-words text-[var(--toast-title-fg)]">
            {toast.title}
          </span>

          {hasNode(toast.description) && (
            <p className="text-p2-medium-adaptive break-words text-[var(--toast-description-fg)]">
              {toast.description}
            </p>
          )}

          {(data?.primaryButtonLabel || data?.secondaryButtonLabel) && (
            // Кнопки в мобильной форме переносятся: «Перейти в документ» и
            // «Скрыть» в одну строку не помещаются на телефоне 320–360 и
            // раздвигали карточку. На десктопе ряд без переноса.
            <div className="flex flex-wrap items-center gap-2 pt-2 desktop:flex-nowrap">
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
            `ELK / toast message`, поэтому крестик отключаемый. */}
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

// Toaster — закреплённая область показа. По макету: на десктопе сверху
// справа, 32px от шапки, 40px от правого края, зазор 24px между тостами в
// стопке; на мобильном — сверху, отступ от краёв 16px, зазор 16.
//
// Десктоп — «от ШАПКИ», а не от края вьюпорта. Правки UI-Kit от 25.10,
// «Toaster — стопка тостов наезжает на шапку»: прежде отсчёт шёл от
// `--viewport-inset-top`, куда шапка кладёт только ЗАКРЕПЛЁННЫЙ ряд, и в
// начале страницы тост ложился на верхнюю полосу шапки. Теперь отсчёт — от
// нижней кромки корня шапки (`--header-bottom`, её публикует Header на
// `<html>`, всегда, а не только у закреплённого ряда) плюс 32. Без шапки на
// странице — прежний `--viewport-inset-top`, без него — 0.
//
// Мобильный вид (правило каркаса «Тосты в мобильном виде»): стопка прижата
// к верху ВЬЮПОРТА с полем 16 и лежит поверх шапки, закреплённых элементов и
// штор (слой тостов выше модалок); высота — не больше вьюпорта минус 32.
//
// Зазор стопки — переменная `--toast-gap` (16 мобильный, 24 десктоп): из
// неё же берут отрицательный отступ схлопывающейся строки и высоту
// «мостика» для наведения (см. `ToastRow`). Прежде у строки было зашито −24
// под десктопный зазор, и при зазоре 16 следующий тост подлетал на 8 выше и
// одним кадром падал на место.
function Toaster() {
  const { toasts, close, pause, resume } = useToast()
  const pauseHandlers = useToasterPause(toasts, pause, resume)

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
      //
      // Наведение и фокус — два независимых источника паузы, см.
      // `useToasterPause`.
      {...pauseHandlers}
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
      // шапки на десктопе (32; в мобильном виде — 16 от верха экрана, то есть
      // подрезка по кромке экрана). Из-за него «информирующий» тост, уходящий вверх на
      // 200 px, виден до самой кромки шапки и там пропадает — то есть уходит
      // ПОД ШАПКУ, как и написано в документации, хотя лежит слоем выше неё
      // (`--z-toast` 70 против `z-40` у шапки).
      //
      // ⚠️ Правый отступ — ПО СЕТКЕ, а не фиксированные 40 px. «Финальная
      // позиция с отступом от правого края 40 px по сетке страницы»
      // (замечание 20): до 1880 поле сетки и есть 40, а выше контент стоит на
      // 1800 и растут поля — колонка обязана ехать вместе с ним, иначе на
      // широком экране тост отрывается от содержимого страницы. Выражение то
      // же, которым меряет себя полоса: половина того, что осталось от
      // ширины за вычетом контентной полосы.
      className="pointer-events-none fixed inset-x-4 top-4 z-(--z-toast) flex max-h-[calc(100dvh-2rem)] flex-col justify-end gap-(--toast-gap) [--toast-gap:1rem] [clip-path:inset(-1rem_-560px_-1.5rem_-1.5rem)] desktop:inset-x-auto desktop:top-[calc(var(--header-bottom,var(--viewport-inset-top,0px))+2rem)] desktop:right-[calc((100%-var(--grid-content-width))/2)] desktop:max-h-[calc(100vh-var(--header-bottom,var(--viewport-inset-top,0px))-4rem)] desktop:w-[480px] desktop:[--toast-gap:1.5rem] desktop:[clip-path:inset(-2rem_-560px_-1.5rem_-1.5rem)]"
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
 * Отрицательный нижний отступ съедает зазор колонки — без него на месте
 * ушедшей карточки оставался бы пустой интервал. Он берётся из той же
 * переменной `--toast-gap`, что и зазор (16 мобильный, 24 десктоп), иначе
 * следующий тост вставал не ровно и в конце падал на место рывком.
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
        "pointer-events-auto relative grid grid-cols-[minmax(0,1fr)] transition-all duration-300 ease-out",
        "after:absolute after:inset-x-0 after:top-full after:h-(--toast-gap) after:content-['']",
        closing ? "-mb-(--toast-gap) grid-rows-[0fr]" : "grid-rows-[1fr]"
      )}
    >
      <div className="min-h-0">{children}</div>
    </div>
  )
}

// ToastCard — это оформительская половина компонента (монтированием и
// временем ведает Toaster). Он экспортирован ради матрицы состояний в
// Storybook, которой нужно отрисовать все сочетания типа и кнопок сразу:
// через `toast.add()` они складывались бы в стопку по таймеру. Из index.ts
// он не реэкспортируется — потребителям по-прежнему следует ходить через
// `useToast()`.
export { ToastProvider, Toaster, ToastCard }
