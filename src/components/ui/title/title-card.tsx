import * as React from "react"
import { ArrowLeftSmall, ChevronDown, CircleHelp } from "@/icons"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { Button } from "@/components/ui/button"
import { Tag, type TagColor } from "@/components/ui/tag"

import { TitleHeading } from "./heading"
import { TitleInformationText } from "./information-text"

// TitleCard — «Заголовок со статусом», то есть `ELK / title-page` с
// Type=Title Card. Это заголовок страницы, который используется на карточке
// сущности: кнопка «Назад», заголовок H2 с необязательной кнопкой
// «Справка» напротив, описание и строка статуса из тега и пар
// «ссылка/подпись-значение».
//
// По собственному примечанию макета к этому варианту: «Изменение в дизайне
// кнопки „справка“ не допускается. Кнопка „Назад“ выводит на предыдущий
// экран (страница откуда пришли или же шаг, откуда пришли — когда сценарий
// имеет Progress Bar). Опциональные элементы: все, кроме Title и Button».
// Поэтому вид кнопки справки зафиксирован здесь, а не вынесен в пропс, и
// все слоты, кроме заголовка, необязательны.
//
// Это отдельный компонент от `TitleRegistry` (Type=Registry), а не один
// компонент за пропсом `type`: они отличаются зазором в корне (16 против
// 8), самим набором существующих слотов и тем, что стоит справа (одна
// фиксированная кнопка справки против свободной группы действий). Один
// компонент оказался бы объединением двух непересекающихся наборов
// пропсов.
//
// Мобильная форма — `Size=Mobile, Type=Title Card` (70482:8886, сет
// 70482:8875 версии 1.0.2): ни «Назад», ни «Справки» в ней нет — они живут
// в навигационной полосе над заголовком (`ELK / navbar`, см. ui/navbar).
// Остальное сжимается: заголовок H2 Mobile 22/30, описание и строка
// статуса — P2 Mobile 12/16, все слоты идут через 4px, тег и информация —
// через 12.
//
// Кнопка справа — `Button Title (ELK)` с двумя типами: `Support`
// («Справка» с вопросом) и `More` («Ещё» с шевроном вниз, поля 20/16).
// В «Вариантах» доки Title Card почти везде нарисован именно `More`.

interface TitleCardProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  /**
   * Подпись кнопки «Назад», по умолчанию «Назад». `null` убирает кнопку —
   * если только не задан `onBack`: тогда остаётся кнопка-значок без
   * подписи, а доступное имя у неё всё равно «Назад».
   */
  backLabel?: React.ReactNode
  onBack?: () => void
  /** «Справка» — её оформление задано макетом, меняется только обработчик.
   * `null` убирает кнопку. По умолчанию подпись зависит от `helpType`. */
  helpLabel?: React.ReactNode
  onHelp?: () => void
  /** `Button Title (ELK)` · Type: `support` — «Справка», `more` — «Ещё ⌄». */
  helpType?: "support" | "more"
  /** The status Tag. */
  tag?: React.ReactNode
  tagColor?: TagColor
  /** Слот `Information Text (ELK)` рядом с тегом: ссылка или пары значений. */
  information?: React.ReactNode
}

const TitleCard = React.forwardRef<HTMLDivElement, TitleCardProps>(function TitleCard({
  className,
  title,
  description,
  backLabel = "Назад",
  onBack,
  helpType = "support",
  helpLabel = helpType === "more" ? "Ещё" : "Справка",
  onHelp,
  tag,
  tagColor = "green",
  information,
  ...props
}, ref) {
  const showBack = Boolean(onBack || backLabel === null ? onBack : backLabel)
  const showHelp = Boolean(helpLabel)
  // Кнопка-значок (`backLabel={null}` при заданном `onBack`) или пустая
  // строка — у кнопки не было бы имени для скринридера.
  const backHasText =
    typeof backLabel === "string" ? backLabel.trim() !== "" : Boolean(backLabel)
  const backAriaLabel = backHasText ? undefined : "Назад"

  return (
    <div
      data-slot="title-card"
      className={cn("flex w-full flex-col items-start gap-1 desktop:gap-4", className)}
      ref={ref}
      {...props}
    >
      {showBack && (
        <Button
          variant="secondary-white"
          size="sm"
          icon={ArrowLeftSmall}
          // Без видимой подписи — кнопка-значок (круг 32), а не «пилюля»
          // с отступами под текст, которого нет.
          iconPosition={backHasText ? "left" : "only"}
          onClick={onBack}
          aria-label={backAriaLabel}
          // В мобильной форме «Назад» — в навигационной полосе (Navbar).
          className="hidden desktop:inline-flex"
        >
          {backLabel}
        </Button>
      )}

      {/* Заголовок и описание — одна группа с зазором 8px; корневой зазор
          16px разделяет эту группу, кнопку «Назад» и строку статуса. В
          мобильной форме оба зазора — 4px. */}
      <div className="flex w-full flex-col items-start gap-1 desktop:gap-2">
        <div className="flex w-full items-start gap-12">
          <TitleHeading>{title}</TitleHeading>
          {showHelp && (
            // `pt-6` стоит на обёртке, а не на кнопке: в макете кнопка
            // 32px выровнена оптически относительно строки заголовка
            // высотой 44px, а не по её верхнему краю. В мобильной форме
            // кнопки нет — справка уезжает в Navbar.
            <div className="hidden shrink-0 flex-col items-start pt-1.5 desktop:flex">
              <Button
                variant="secondary-white"
                size="sm"
                icon={helpType === "more" ? ChevronDown : CircleHelp}
                iconPosition={helpType === "more" ? "right" : "left"}
                onClick={onHelp}
              >
                {helpLabel}
              </Button>
            </div>
          )}
        </div>
        {hasNode(description) && (
          <p className="w-full text-p3-medium [overflow-wrap:anywhere] text-[var(--title-description-fg)] desktop:text-p2-medium">
            {description}
          </p>
        )}
      </div>

      {(hasNode(tag) || information) && (
        <div
          data-slot="title-card-status"
          // Перенос: тег и длинная информация на узкой полосе не помещались в
          // одну строку и уходили за край.
          className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 desktop:gap-x-4"
        >
          {hasNode(tag) && <Tag color={tagColor}>{tag}</Tag>}
          {information}
        </div>
      )}
    </div>
  )
})

export { TitleCard, TitleInformationText }
export type { TitleCardProps }
