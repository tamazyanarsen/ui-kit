import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "@/icons"

import { cn } from "@/lib/utils"
import { Tooltip } from "@/components/ui/tooltip"

import { useSidebarContext } from "./sidebar"

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const ICON_SIZE = "size-6"

// Показывает подпись в подсказке, когда боковая панель свёрнута (видимой
// подписи просто нет) или когда текст подписи не помещается даже в
// развёрнутой панели — как в макете «длинного элемента меню, который не
// помещается».
//
// Проверяются ОБЕ оси: у подписей стоит `line-clamp-2`, поэтому слишком
// длинная подпись выходит за границы по вертикали (scrollHeight), а не по
// горизонтали. Проверка одной только ширины молча перестала бы показывать
// подсказку ровно в том случае, который макет и рисует.
function useTruncated<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [truncated, setTruncated] = React.useState(false)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setTruncated(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
  })

  return { ref, truncated }
}

// Подписи боковой панели в макете заданы как `min-h-[24px]
// max-h-[48px]` с многоточием, то есть одна строка, которая может вырасти
// до двух и лишь потом обрезаться. Поэтому строка — это *минимальные* 40px,
// а не фиксированная высота (у `Sidebar Item (ELK)` собственный триггер это
// `p-[8px]` с `items-start`).
const LABEL_CLASS = "min-w-0 line-clamp-2"

interface SidebarItemProps {
  icon?: IconComponent
  label: React.ReactNode
  active?: boolean
  nested?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

// Конечный пункт навигации: по макету клик по нему всегда просто ведёт на
// раздел — и в развёрнутой панели, и в свёрнутой полосе (автораскрытия у
// него нет, это поведение SidebarGroup). `nested` рисует форму с отступом и
// без значка, которая используется для детей группы («Платежи СБП» и
// «QR-коды СБП» в анатомии).
function SidebarItem({
  icon: Icon,
  label,
  active = false,
  nested = false,
  href,
  onClick,
  className,
}: SidebarItemProps) {
  const { open } = useSidebarContext()
  const { ref: labelRef, truncated } = useTruncated<HTMLSpanElement>()

  const content = (
    <a
      href={href}
      onClick={onClick}
      data-slot="sidebar-item"
      data-active={active || undefined}
      aria-label={!open && typeof label === "string" ? label : undefined}
      className={cn(
        "flex min-h-10 shrink-0 cursor-pointer items-center gap-4 rounded-[8px] text-p1-medium text-[var(--nav-sidebar-fg)] outline-none focus-visible:focus-ring transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)]",
        // Вложенные строки в мастере — это `pl-[48px] pr-[8px] py-[8px]`;
        // 48 это ровно px-2 плюс значок 24px плюс зазор 16px, поэтому их
        // подписи встают под подпись родителя.
        //
        // Дизайн-чек 3/3 №23: «в свёрнутом варианте меню при наведении/
        // нажатии на иконку выделяется неверная область клика, она должна
        // быть больше». Свёрнутая полоса центрирует детей (`items-center` в
        // sidebar.tsx), поэтому пункт сжимался по содержимому, а `px-0`
        // оставлял его шириной ровно в иконку — подсветка выходила 24×40
        // вместо квадрата 40×40. В макете свёрнутый пункт — это
        // `p-[8px] rounded-[8px]` вокруг 24px-иконки, то есть те же 8px
        // отступа, что и в развёрнутом состоянии.
        open ? (nested ? "py-2 pr-2 pl-12" : "p-2") : "size-10 justify-center p-2",
        className
      )}
    >
      {Icon && !nested && (
        <Icon
          aria-hidden="true"
          className={cn(ICON_SIZE, "shrink-0 text-[var(--nav-sidebar-icon-fg)]")}
        />
      )}
      {open && (
        <span ref={labelRef} className={LABEL_CLASS}>
          {label}
        </span>
      )}
    </a>
  )

  if (open && !truncated) return content

  return (
    <Tooltip content={label} direction="left">
      {content}
    </Tooltip>
  )
}

interface SidebarGroupProps {
  value: string
  icon?: IconComponent
  label: React.ReactNode
  active?: boolean
  children: React.ReactNode
  className?: string
}

// Заголовок раскрывающейся группы. По макету клик в свёрнутой полосе не
// переключает её собственную (невидимую) панель, а разворачивает всю
// боковую панель *и* заранее раскрывает эту группу через SidebarContext —
// так что подкатегории видны уже в тот момент, когда полоса закончила
// разворачиваться.
function SidebarGroup({
  value,
  icon: Icon,
  label,
  active = false,
  children,
  className,
}: SidebarGroupProps) {
  const { open, requestOpenGroup } = useSidebarContext()

  const collapsedTrigger = (
    <button
      type="button"
      data-slot="sidebar-group-trigger"
      data-active={active || undefined}
      aria-label={typeof label === "string" ? label : undefined}
      onClick={() => requestOpenGroup(value)}
      className={cn(
        // Дизайн-чек 3/3 №23: та же область 40×40 с 8px отступа, что и у
        // обычного пункта в свёрнутой полосе — `w-full` здесь
        // не помогал, потому что родитель сжат по содержимому.
        "flex size-10 shrink-0 items-center justify-center rounded-[8px] p-2 text-[var(--nav-sidebar-fg)] outline-none focus-visible:focus-ring transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)]",
        className
      )}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={cn(ICON_SIZE, "shrink-0 text-[var(--nav-sidebar-icon-fg)]")}
        />
      )}
    </button>
  )

  return (
    <AccordionPrimitive.Item value={value} data-slot="sidebar-group">
      <AccordionPrimitive.Header>
        {open ? (
          <AccordionPrimitive.Trigger
            nativeButton={false}
            render={<div />}
            data-slot="sidebar-group-trigger"
            data-active={active || undefined}
            className={cn(
              // `items-start` вместе с `min-h-10` повторяет собственный
              // триггер мастера `p-[8px] items-start`: подпись в две строки
              // растит строку вниз и оставляет значок и шеврон на первой
              // строке, а не переcчитывает их по центру.
              "flex min-h-10 w-full cursor-pointer items-start gap-4 rounded-[8px] p-2 text-left text-p1-medium text-[var(--nav-sidebar-fg)] outline-none focus-visible:focus-ring transition-colors hover:bg-[var(--nav-sidebar-item-hover-bg)] data-active:bg-[var(--nav-sidebar-item-active-bg)] [&[data-panel-open]_[data-slot=sidebar-group-chevron]]:rotate-180",
              className
            )}
          >
            {Icon && (
              <Icon
                aria-hidden="true"
                className={cn(ICON_SIZE, "shrink-0 text-[var(--nav-sidebar-icon-fg)]")}
              />
            )}
            <span className={cn(LABEL_CLASS, "flex-1")}>{label}</span>
            {/* Мастер оборачивает шеврон в «Arrow Box» с `pt-[4px]`,
                который ставит его по центру первой строки высотой 24px. При
                однострочной подписи это то же место, что и центрирование,
                но при переносе подписи шеврон остаётся на месте. */}
            <ChevronDown
              aria-hidden="true"
              data-slot="sidebar-group-chevron"
              className="mt-1 size-4 shrink-0 text-[var(--nav-sidebar-icon-fg)] transition-transform duration-200"
            />
          </AccordionPrimitive.Trigger>
        ) : (
          <Tooltip content={label} direction="left">
            {collapsedTrigger}
          </Tooltip>
        )}
      </AccordionPrimitive.Header>
      {/* Свёрнутая полоса никогда не показывает вложенных детей — даже
          когда значение аккордеона этой группы формально «раскрыто» (оно
          таким и остаётся при сворачивании, чтобы после разворачивания
          полосы группа открылась уже раскрытой, см. requestOpenGroup).
          Полный пропуск панели в свёрнутом виде избавляет от того, что
          вложенные строки без значков рисовались бы в полосу «только
          значки» пустым просветом. */}
      {open && (
        <AccordionPrimitive.Panel
          data-slot="sidebar-group-panel"
          className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
        >
          <div className="flex flex-col gap-4 pt-4 pb-2">{children}</div>
        </AccordionPrimitive.Panel>
      )}
    </AccordionPrimitive.Item>
  )
}

export { SidebarItem, SidebarGroup }
export type { SidebarItemProps, SidebarGroupProps }
