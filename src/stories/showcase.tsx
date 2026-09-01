import * as React from "react"

import { cn } from "@/lib/utils"

/* A looser layout for components that are too wide or too composite for a
   real grid (Modal, Header, Table, …): a stack of captioned sections. */
export function StoryShowcase({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-10 bg-[#F8F8F8] p-8", className)}>
      {children}
    </div>
  )
}

/**
 * Прокручиваемая «контентная область» — подставка под закреплённые снизу
 * панели (Button Menu, Button Menu Black): `sticky bottom-0` прижимает их к
 * низу именно прокручиваемого контейнера, на голом холсте закрепление не
 * увидеть.
 *
 * Дизайн-чек Storybook (Аня Багрова) №11–13, №15: раньше такая подставка в
 * каждой истории писалась своя и с фиксированной шириной (`w-[640px]` /
 * `w-[720px]`) и полным скруглением (`rounded-2xl` + `overflow-y-auto`).
 * Отсюда были оба замечания — «компонент не растягивается по ширине
 * контентной области» и «нижние углы компонента имеют скругления»: панель и
 * тогда была `w-full` со скруглением только сверху, обрезала её обвязка.
 */
export function StoryContentArea({
  height,
  children,
  className,
}: {
  /** Высота области, например `h-72` — от неё зависит, будет ли прокрутка. */
  height: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-y-auto rounded-t-2xl border border-b-0 border-[var(--divider)]",
        height,
        className
      )}
    >
      {children}
    </div>
  )
}

export function StorySection({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-p2-medium text-[#252628]">{title}</h3>
        {description && (
          <p className="text-p3-regular text-[#6D6D6D]">{description}</p>
        )}
      </div>
      <div className={cn("flex flex-wrap items-start gap-4", className)}>
        {children}
      </div>
    </section>
  )
}
