import * as React from "react"

import { cn } from "@/lib/utils"
import { pressHandlers } from "@/lib/press"
import { SelectionButton } from "@/components/ui/selection-button"
import type { SelectionButtonItem } from "@/components/ui/selection-button"
import { Tag } from "@/components/ui/tag"
import type { TagColor } from "@/components/ui/tag"
import type { PaymentSystem } from "@/components/ui/thumbnail"
// Дизайн-чек №15: пиктограмма карты больше не собирается здесь локально —
// это отдельный компонент со своей историей, подключённый как зависимость.
import { CardAccount } from "@/components/ui/card-account"

// Card — строка банковской карты «ELK / card». Каждый текстовый блок
// (заголовок, подзаголовок, значение) по макету строго однострочный (раздел
// «Ограничения текстовых блоков»: выходящее за границы обрезается
// многоточием и никогда не переносится). `titleSuffix`, `tag`, `subtitle`,
// `value` и `menuItems` необязательны и просто не рисуют свой слот, когда
// их нет, — это повторяет собственные булевы свойства макета «Show Number
// Card / Show Tag / Show User Name / Show Value / Show Button», которые все
// показаны как переключатели содержимого, а не как отдельный флаг на
// каждое поле.
//
// `value` (номер счёта) живёт в верхней строке рядом с заголовком и тегом,
// а не отдельным блоком снизу: по макету это сосед Title, Number и Tag
// внутри строки «Top» с `flex-[1_0_0]`, прижатый вправо и растущий на
// оставшуюся ширину строки. Он НЕ сосед всей колонки «заголовок плюс
// подзаголовок», поэтому его нельзя центровать по вертикали на всю высоту
// карточки: при наличии подзаголовка он бы заметно оторвался от заголовка.
// Центруется он только внутри самой строки Top.
//
// Кнопка «...» — это SelectionButton (размер S, secondary-white, вниз и
// влево): в макете правым краем строки служит край вьюпорта, поэтому
// список открывается от триггера влево и вниз.
interface CardProps {
  title: React.ReactNode
  titleSuffix?: React.ReactNode
  tag?: React.ReactNode
  tagColor?: TagColor
  subtitle?: React.ReactNode
  value?: React.ReactNode
  showThumbnail?: boolean
  thumbnailNumber?: React.ReactNode
  paymentSystem?: PaymentSystem
  menuItems?: SelectionButtonItem[]
  onClick?: () => void
  className?: string
}

function Card({
  title,
  titleSuffix,
  tag,
  tagColor = "green",
  subtitle,
  value,
  showThumbnail = true,
  thumbnailNumber,
  paymentSystem = "mastercard",
  menuItems,
  onClick,
  className,
}: CardProps) {
  const clickable = Boolean(onClick)

  return (
    <div
      data-slot="card"
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      // Клик и Enter по «…» и по пунктам его меню (они в портале, но
      // всплывают по дереву React) — не нажатие на карточку.
      {...pressHandlers<HTMLDivElement>(onClick)}
      className={cn(
        // ⚠️ Выключка по ВЕРХУ, а не по центру. Дизайн-чек «Storybook 3»,
        // замечание 11: «проверить и скорректировать расположение кнопки в
        // Card». Замер анатомии (карточка 1200×100 с полем 24): блок
        // `Container` стоит на y=24, блок `Button`
        // — тоже на y=24 и ростом 52, то есть кнопка прижата к верхней кромке
        // содержимого. По центру карточки (y=34) её ставило `items-center`, и
        // с подписью пользователя она уезжала на 10px вниз относительно
        // заголовка, к которому относится.
        //
        // Из всей строки по центру стоит только плашка карты: `Card` в сете —
        // y=32 при росте 36 в карточке 100, то есть ровно середина. Отсюда
        // `self-center` на ней ниже.
        "flex min-h-20 items-start gap-6 rounded-[12px] bg-[var(--card-bg)] p-6 transition-colors",
        clickable && "cursor-pointer hover:bg-[var(--card-bg-hover)]",
        className
      )}
    >
      {showThumbnail && (
        <CardAccount
          number={thumbnailNumber}
          paymentSystem={paymentSystem}
          className="self-center"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex min-w-0 items-center gap-2 text-h4">
            <span className="min-w-0 truncate text-[var(--card-title-fg)]">
              {title}
            </span>
            {titleSuffix && (
              <span className="shrink-0 font-medium text-[var(--card-meta-fg)]">
                • {titleSuffix}
              </span>
            )}
          </span>
          {tag && (
            <Tag color={tagColor} className="shrink-0">
              {tag}
            </Tag>
          )}
          {/* Не `value &&`: номер `0` рисовался голым нулём вне колонки. */}
          {value != null && value !== false && value !== "" && (
            <span className="min-w-0 flex-1 truncate text-right text-p1-medium text-[var(--card-meta-fg)]">
              {value}
            </span>
          )}
        </div>
        {subtitle && (
          <span className="truncate text-p2-medium text-[var(--card-meta-fg)]">
            {subtitle}
          </span>
        )}
      </div>

      {menuItems && menuItems.length > 0 && (
        <SelectionButton items={menuItems} size="sm" direction="down-left" />
      )}
    </div>
  )
}

export { Card }
export type { CardProps }
