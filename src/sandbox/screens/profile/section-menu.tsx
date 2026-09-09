import { cn } from "@/lib/utils"

// Боковое меню разделов профиля.
//
// Не `Sidebar` кита: тот — навигация сотрудника со своим состоянием
// раскрытия и контекстом (`SidebarItem` без `Sidebar` просто не
// отрисовывается). Здесь — элемент страницы, и метрики у него свои,
// снятые с эталона 70371:24923: пункт 520 × 56, поле 16, радиус 8, значок
// 24 с зазором 16, выбранный — Grey 109.

// Иконка кита: `size` выбирает НАЧЕРТАНИЕ (16 и 24 нарисованы отдельно), а
// не масштаб. Слот здесь всегда 24, поэтому и просим двадцатичетвёрочное —
// дизайн-чек от 08.09, замечания 28 и 31.
type IconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { size?: 16 | 24 }
>

interface SectionMenuItem {
  value: string
  label: string
  icon: IconComponent
}

interface SectionMenuProps {
  items: SectionMenuItem[]
  value: string
  onValueChange: (value: string) => void
}

function SectionMenu({ items, value, onValueChange }: SectionMenuProps) {
  return (
    <nav className="flex w-full flex-col">
      {items.map((item) => {
        const Icon = item.icon
        const active = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-4 rounded-[8px] p-4 text-left text-p1-medium text-[var(--grey-1514)] outline-none focus-visible:focus-ring",
              active ? "bg-[var(--grey-109)]" : "hover:bg-[var(--grey-106)]"
            )}
          >
            <Icon
              size={24}
              aria-hidden="true"
              className="size-6 shrink-0 text-[var(--grey-1514)]"
            />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export { SectionMenu }
export type { SectionMenuItem, SectionMenuProps }
