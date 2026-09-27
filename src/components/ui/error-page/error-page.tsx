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

function ErrorPage({
  type = "image",
  title,
  description,
  buttonLabel,
  onButtonClick,
  className,
}: ErrorPageProps) {
  const showCode = type === "403" || type === "404"
  return (
    <div
      data-slot="error-page"
      className={cn(
        "flex flex-col items-center rounded-[8px] bg-[var(--error-page-bg)] px-6 pt-10 pb-10 text-center",
        className
      )}
    >
      {title && (
        <h1 className="text-h2 text-[var(--error-page-title-fg)]">
          {title}
        </h1>
      )}
      {description && (
        // 592px — ширина, которую макет даёт этому абзацу внутри
        // текстовой колонки 1008px; `max-w-md` (448) переносил его на
        // строку раньше.
        <p className="mt-2 max-w-[592px] text-p1-medium text-[var(--error-page-description-fg)]">
          {description}
        </p>
      )}
      {buttonLabel && (
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onButtonClick}
          className="mt-8"
        >
          {buttonLabel}
        </Button>
      )}
      {/* Дизайн-чек №28: иллюстрация целиком вынесена в `Image Error (ELK)`
          и собрана по мастеру — см. illustration.tsx. Раньше цифры
          рисовались текстом (не тем шрифтом), а «ноль» вставлялся отдельной
          мелкой картинкой. Отступ 48px — `gap-[48px]` блока Box в
          мастере. */}
      <ErrorPageIllustration
        type={showCode ? type : "image"}
        className="mt-12"
      />
    </div>
  )
}

export { ErrorPage }
export type { ErrorPageProps, ErrorPageType }
