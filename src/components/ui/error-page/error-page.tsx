import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { ErrorPageIllustration } from "./illustration"

// ErrorPage — «Страница ошибок» (403, 404 и прочие). Дизайн-чек,
// замечания 18, 19 и 20: обе иллюстрации — настоящие ассеты, извлечённые
// из встроенных растровых слоёв выгрузки макета, а не перерисованные
// заново. Собственное свойство «Type» компонента в макете перечисляет лишь
// три значения — 403, 404 и Image (общая), — а документация по применению
// подтверждает, что все прочие ошибки (500, технические работы и так
// далее) используют общую иллюстрацию вообще без цифр, а не составленную
// строку из цифр. Поэтому отрисовка крупных цифр намеренно ограничена
// ровно этими двумя кодами:
// - `zeroMascot` подставляется вместо «0» в «403» и «404» (собственные
//   примеры составленных цифр в макете), а вторая цифра («4» или «3») в
//   исходнике тоже отдельная векторная графика. Но, как сказано выше, эта
//   графика существует только для двух кодов: общего цифрового начертания,
//   на которое можно было бы откатиться для других чисел, нет. Поэтому
//   любое другое значение `code` (включая обычные числовые строки вроде
//   «500») откатывается на `noCodeMascot`, а не пытается нарисовать цифры.
// - `noCodeMascot` — самостоятельная иллюстрация, которая используется
//   всегда, когда кода 403 или 404 нет (сверено с отдельным примером
//   анатомии без цифр по бокам), а не запасной вариант первой.
/**
 * Свойство `Type` компонент-сета Figma: 403, 404 или обобщённая картинка.
 *
 * Дизайн-чек от 07.09, замечание 14: «Не наглядное управление пропсом…
 * Должно быть переключение как в Figma, выбор из списка или радио. Варианты
 * — 403, 404, Image. Логику подмены цифр шрифтом — сохранить, она полезна».
 * Раньше это была свободная строка `code?: string`, и панель истории
 * предлагала вписать туда что угодно — а компонент всё равно понимал ровно
 * три значения и молча сваливался в картинку на любом четвёртом.
 */
type ErrorPageType = "403" | "404" | "image"

interface ErrorPageProps {
  /** Вариант страницы — см. {@link ErrorPageType}. */
  type?: ErrorPageType
  title?: React.ReactNode
  description?: React.ReactNode
  buttonLabel?: React.ReactNode
  onButtonClick?: () => void
  className?: string
}

/** Есть что показать: 0 — значение, а `null`, `false` и `""` — нет. */
const hasValue = (node: React.ReactNode) =>
  node != null && node !== false && node !== ""

function ErrorPage({
  type = "image",
  title,
  description,
  buttonLabel,
  onButtonClick,
  className,
}: ErrorPageProps) {
  const showCode = type === "403" || type === "404"
  const hasTitle = hasValue(title)
  const hasDescription = hasValue(description)
  const hasButton = hasValue(buttonLabel)
  return (
    // Мобильная форма (мастер `Size=Mobile`): боковые 16, сверху 88, кадр не
    // ниже 640; заголовок 22/30, описание 14/20, зазор до кнопки 24.
    // Десктоп: боковые 24, сверху 40, зазор до кнопки 32. Зазоры между
    // слотами дают `gap-*` контейнеров, а не `mt-*` у самих слотов, поэтому
    // пустой слот не оставляет после себя отступа.
    <div
      data-slot="error-page"
      className={cn(
        "flex min-h-[640px] flex-col items-center gap-12 rounded-[8px] bg-[var(--error-page-bg)] px-4 pt-[88px] pb-10 text-center desktop:min-h-0 desktop:px-6 desktop:pt-10",
        className
      )}
    >
      {(hasTitle || hasDescription || hasButton) && (
        <div className="flex w-full flex-col items-center gap-6 desktop:gap-8">
          {(hasTitle || hasDescription) && (
            <div className="flex w-full flex-col items-center gap-2">
              {hasTitle && (
                <h1 className="max-w-full text-h2-mobile [overflow-wrap:anywhere] text-[var(--error-page-title-fg)] desktop:text-h2">
                  {title}
                </h1>
              )}
              {hasDescription && (
                // 592px — ширина, которую макет даёт этому абзацу внутри
                // текстовой колонки 1008px; `max-w-md` (448) переносил его на
                // строку раньше.
                <p className="max-w-[592px] text-p2-medium [overflow-wrap:anywhere] text-[var(--error-page-description-fg)] desktop:text-p1-medium">
                  {description}
                </p>
              )}
            </div>
          )}
          {hasButton && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={onButtonClick}
            >
              {buttonLabel}
            </Button>
          )}
        </div>
      )}
      {/* Дизайн-чек №28: иллюстрация целиком вынесена в `Image Error (ELK)`
          и собрана по мастеру — см. illustration.tsx. Отступ 48px до неё —
          `gap-[48px]` блока Box в мастере (`gap-12` корня). */}
      <ErrorPageIllustration type={showCode ? type : "image"} />
    </div>
  )
}

export { ErrorPage }
export type { ErrorPageProps, ErrorPageType }
