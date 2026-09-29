import * as React from "react"
import { CloseCross } from "@/components/ui/close-cross"

import { cn } from "@/lib/utils"
import { hasContent } from "@/lib/has-content"
import { Button } from "@/components/ui/button"
import { Icon as KitIcon, type IconName } from "@/components/ui/icon"

import {
  ICON_COLOR,
  ICON_COMPONENT,
  SOLID_BG,
  type InformerIcon,
  type InformerSolid,
} from "./variants"

// Informer — «Уведомление»: сообщение для показа внутри контентного
// блока. Заметное, но не блокирующее работу пользователя; размер
// подстраивается под текст. Ширина: минимум 360px, максимум не ограничен
// (минимум падает до 240px у варианта со ссылкой, который используется в
// модальных окнах, — так записано в исключении самого макета). Шириной
// управляет вызывающий код через `className`, сам компонент её не
// зажимает. Дата, описание, кнопки и крестик необязательны: минимальная
// форма в макете — это значок плюс заголовок.
interface InformerProps {
  icon?: InformerIcon
  /**
   * Любая иконка кита вместо пяти штатных — дизайн-чек от 08.09, замечание
   * 12: «В информер добавить возможность проброса нестандартной иконки…
   * доработать компонент и сделать там возможность ставить любую иконку из
   * кита».
   *
   * Отдельным пропом, а не расширением `icon`: у штатных пяти вместе с
   * глифом приезжает и цвет (красный «внимание», зелёная «галочка»), а
   * произвольная иконка сама по себе ничего о статусе не сообщает — цвет ей
   * задаётся `customIconColor`, по умолчанию тем же серым, что у
   * `information`.
   *
   * Принимает имя из набора (молния в ките зовётся `"lghtning-fill"`) или
   * готовый узел, если нужен нестандартный размер или своя обёртка.
   */
  customIcon?: IconName | React.ReactNode
  /** Цвет произвольной иконки. Любое валидное значение CSS `color`. */
  customIconColor?: string
  title: React.ReactNode
  date?: React.ReactNode
  description?: React.ReactNode
  solid?: InformerSolid
  showCross?: boolean
  onClose?: () => void
  mainButtonLabel?: React.ReactNode
  onMainButtonClick?: () => void
  additionalButtonLabel?: React.ReactNode
  onAdditionalButtonClick?: () => void
  className?: string
}

function Informer({
  icon = "attention-red",
  customIcon,
  customIconColor = "var(--informer-icon-grey)",
  title,
  date,
  description,
  solid = "white",
  showCross = true,
  onClose,
  mainButtonLabel,
  onMainButtonClick,
  additionalButtonLabel,
  onAdditionalButtonClick,
  className,
}: InformerProps) {
  const Icon = ICON_COMPONENT[icon]

  return (
    <div
      data-slot="informer"
      // Дизайн-чек, замечание 27: отступ и зазор до значка прочитаны прямо
      // с листа анатомии — отступ 24px (был 16, p-4) и зазор 16px между
      // значком и текстовой колонкой (был 12, gap-3).
      // Size=Mobile — карточка 328px с отступом 16px, Size=Desktop — 592px
      // (минимум 400) с отступом 24px; прежде минимальная ширина была 360, а
      // отступ задавался только для десктопа.
      // ⚠️ Минимум взят `min(400px, 100%)`, а не голыми 400px. Дизайн-чек от
      // 07.09, замечание 28: «Информер не должен вылезать за пределы блока…
      // у информера не должно быть макс ширины, он должен встроиться в
      // правила содержащего его блока». Жёсткие 400 — это именно то, что
      // мешало: в узком виджете (перевод между счетами) карточка отказывалась
      // сжиматься и вылезала за скруглённый край блока. `min()` оставляет
      // спецификационный минимум там, где место есть, и снимает его там, где
      // его нет.
      className={cn(
        "rounded-[16px] p-4 desktop:min-w-[min(400px,100%)] desktop:p-6",
        className
      )}
      style={{ backgroundColor: SOLID_BG[solid] }}
    >
      <div className="flex items-start gap-4">
        {customIcon == null || customIcon === false || customIcon === "" ? (
          <Icon
            size={24}
            aria-hidden="true"
            className="size-6 shrink-0"
            style={{ color: ICON_COLOR[icon] }}
          />
        ) : typeof customIcon === "string" ? (
          // `size={24}` — не то же самое, что `className="size-6"`: у части
          // иконок кита 16 и 24 нарисованы отдельно, и масштабирование
          // шестнадцатого до двадцати четырёх даёт слишком жирный штрих
          // (дизайн-чек от 08.09, замечание 31).
          <KitIcon
            name={customIcon}
            size={24}
            aria-hidden="true"
            className="size-6 shrink-0"
            style={{ color: customIconColor }}
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center"
            style={{ color: customIconColor }}
          >
            {customIcon}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              {/* Мобильная форма опускает весь текстовый блок на ступень:
                  заголовок 14/20 и дата с описанием 12/16 при Size=Mobile
                  против 16/24 и 14/20 на десктопе. */}
              <span className="text-p2-medium [overflow-wrap:anywhere] text-[var(--informer-title-fg)] desktop:text-p1-medium">
                {title}
              </span>
              {hasContent(date) && (
                <span className="text-p3-medium [overflow-wrap:anywhere] text-[var(--informer-meta-fg)] desktop:text-p2-medium">
                  {date}
                </span>
              )}
            </div>
            {hasContent(description) && (
              <span className="text-p3-medium [overflow-wrap:anywhere] text-[var(--informer-description-fg)] desktop:text-p2-medium">
                {description}
              </span>
            )}
          </div>
          {(hasContent(mainButtonLabel) || hasContent(additionalButtonLabel)) && (
            // Перенос: две длинные подписи на узкой полосе уходили за край
            // (до 436px при полосе 343). `w-max max-w-full` вместо запрета
            // переноса на десктопе: в контейнере по содержимому (колонка auto,
            // inline-block) процентный max-width при расчёте вклада не
            // действует, и ряд, как и без переноса, задаёт ширину карточки —
            // она не сжимается и кнопки не падают в столбик (урок r9). А в
            // узкой колонке фиксированной ширины 100% ограничивает ряд, и
            // кнопки переносятся — `desktop:flex-nowrap` выпускал их за
            // колонку 288 на 89px (аудит 22).
            <div className="flex w-max max-w-full flex-wrap items-center gap-2">
              {hasContent(mainButtonLabel) && (
                <Button
                  type="button"
                  variant="secondary-black"
                  size="sm"
                  onClick={onMainButtonClick}
                >
                  {mainButtonLabel}
                </Button>
              )}
              {hasContent(additionalButtonLabel) && (
                <Button
                  type="button"
                  variant="secondary-grey"
                  size="sm"
                  onClick={onAdditionalButtonClick}
                >
                  {additionalButtonLabel}
                </Button>
              )}
            </div>
          )}
        </div>
        {/* Крестик в мастере (v2.0.5) — сосед всей текстовой коробки, то
            есть одна строка с зазором 16px из [значок 24][коробка]
            [крестик], а не ребёнок строки заголовка. Его обёртка с `py-1`
            и центрует глиф 16px относительно значка статуса 24px; будучи
            вложенным в строку заголовка, он стоял на 4px выше, а зазор был
            12px вместо 16. */}
        {showCross && (
          <span className="flex shrink-0 items-center py-1">
            <CloseCross
              onClick={onClose}
              className="text-[var(--informer-title-fg)]"
            />
          </span>
        )}
      </div>
    </div>
  )
}

export { Informer }
export type { InformerProps }
