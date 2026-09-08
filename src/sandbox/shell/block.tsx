import * as React from "react"

import { cn } from "@/lib/utils"

// Блок страницы и его внутренности. Это оболочка эталона, а не компонент
// кита: у песочниц белая карточка с полем 32 и радиусом 16 — тем же, что у
// `TableBlock` («Для табличных блоков… радиусы скруглений 16px»), чтобы
// табличный и нетабличный блок на одной странице не расходились кромкой.
//
// Вложенная карточка внутри блока — 12: «Радиус вложенной карточки в
// эталонах не один (8 у „Типа подписи“, 16 у „Способа подписания“, 12 на
// витрине) — сведён к 12 на всех песочницах решением дизайнера».

/**
 * Закрепление блока при прокрутке — корневой хук продукта.
 *
 * Механика описана в ките отдельным разделом «Механика прокрутки страницы
 * (ЕЛК)» (нода 31180:130752) четырьмя кадрами:
 *
 *   1. блок прокручивается вместе с формой;
 *   2. «когда расстояние между шапкой сайта и блоком составляет 40px, блок
 *      фиксируется при дальнейшей прокрутке»;
 *   3. «когда нижняя граница блока совпадает с нижней границей соседнего
 *      блока, блок начинает прокручиваться вместе с ним»;
 *   4. «блок останавливается, когда до нижней границы остаётся 40px».
 *
 * Всё это и есть `position: sticky` с отступом 40 от занятого верха вьюпорта:
 * пункты 3 и 4 получаются сами — липкий узел ограничен коробкой РОДИТЕЛЯ, а
 * родитель здесь — колонка ряда, высота которой равна высоте соседней
 * колонки.
 *
 * ⚠️ Отсчёт от `--viewport-inset-top`, а не от нуля: шапка страницы
 * закреплена и публикует свою занятую высоту туда же, откуда её берут липкая
 * шапка таблицы и область тостов. Константа «128 минус…» здесь врала бы —
 * закрепляется только нижний ряд шапки, и величина ходит между 128 и 64.
 *
 * ⚠️ Работает, только если колонка ряда НЕ растянута по высоте: `GridRow`
 * ставит `items-start`, поэтому колонке задаётся `h-full` (см. `SandboxColumns`).
 */
const STICKY_BLOCK = "sticky top-[calc(var(--viewport-inset-top,0px)+40px)]"

interface SandboxBlockProps extends React.ComponentProps<"section"> {
  /** Поле блока. 32 — обычный блок, 0 — табличный (там поле у элементов). */
  padding?: 0 | 24 | 32
  /**
   * Закрепить блок при прокрутке — «Механика прокрутки страницы (ЕЛК)»
   * (нода 31180:130752), см. {@link STICKY_BLOCK}.
   */
  sticky?: boolean
}

function SandboxBlock({
  padding = 32,
  sticky = false,
  className,
  style,
  ...props
}: SandboxBlockProps) {
  return (
    <section
      data-slot="sandbox-block"
      data-sticky={sticky || undefined}
      className={cn(
        // ⚠️ `overflow-clip`, а не `overflow-hidden`. Дизайн-чек от 07.09,
        // замечание 32: «У таблиц всегда должна закрепляться нижняя полоса
        // горизонтальной прокрутки». Полоса `sticky`, а `overflow: hidden`
        // делает блок ПРОКРУЧИВАЕМОЙ областью — липкий потомок начинает
        // считаться от неё, а не от вьюпорта, и полоса замирала у нижней
        // кромки блока (замерено: 733px ниже нижнего края экрана).
        // `overflow: clip` подрезает по тому же радиусу, но области
        // прокрутки не создаёт, и полоса снова липнет к экрану.
        "flex w-full flex-col gap-8 overflow-clip rounded-[16px] bg-[var(--white-101)]",
        sticky && STICKY_BLOCK,
        className
      )}
      style={{ padding, ...style }}
      {...props}
    />
  )
}

/**
 * Заголовок группы внутри блока — H3 24/32. В эталонах это отдельный
 * текстовый узел «Section», а не заголовок страницы.
 */
function SandboxSectionTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-h3 text-[var(--grey-1514)]", className)}
      {...props}
    />
  )
}

/** Группа: заголовок + содержимое с зазором 24. */
function SandboxSection({
  title,
  action,
  gap = 24,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  action?: React.ReactNode
  gap?: number
}) {
  return (
    <div
      data-slot="sandbox-section"
      className={cn("flex w-full flex-col", className)}
      style={{ gap }}
      {...props}
    >
      {(title || action) && (
        <div className="flex w-full items-start justify-between gap-6">
          {typeof title === "string" ? (
            <SandboxSectionTitle>{title}</SandboxSectionTitle>
          ) : (
            title
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

/** Вложенная карточка: серая подложка, радиус 12, поле 24. */
function SandboxCard({
  className,
  bordered = false,
  ...props
}: React.ComponentProps<"div"> & { bordered?: boolean }) {
  return (
    <div
      data-slot="sandbox-card"
      className={cn(
        "flex w-full flex-col gap-4 rounded-[12px] p-6",
        bordered
          ? "border border-[var(--divider)] bg-[var(--white-101)]"
          : "bg-[var(--grey-106)]",
        className
      )}
      {...props}
    />
  )
}

/**
 * Ряд полей формы: два поля по 476 при области 976, зазор 24. Выражением, а
 * не числами — на 1440 доли сохраняются.
 */
function SandboxFieldRow({
  className,
  columns = 2,
  ...props
}: React.ComponentProps<"div"> & { columns?: number }) {
  return (
    <div
      data-slot="sandbox-field-row"
      className={cn("grid w-full items-start gap-6", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      {...props}
    />
  )
}

export {
  SandboxBlock,
  SandboxCard,
  SandboxFieldRow,
  SandboxSection,
  SandboxSectionTitle,
  STICKY_BLOCK,
}
export type { SandboxBlockProps }
