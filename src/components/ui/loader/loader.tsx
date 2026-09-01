import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Loader2 } from "@/icons"
import { cn } from "@/lib/utils"

/**
 * Core Component «Loader» — крутящийся спиннер из Figma («icon / loader»).
 *
 * Дизайн-чек №8: до этого лоудера как отдельного компонента не было — каждое
 * место рисовало иконку само и красило её в свой акцент, из-за чего в матрице
 * кнопки оказалось шесть разных по цвету спиннеров. Лоудер не зависит ни от
 * типа кнопки, ни от статусных цветов.
 *
 * Дизайн-чек Storybook 2 (от Notification до Loader) №6: сет пересобран по
 * мастеру со страницы ALL ICONS (раздел «24. Loaders», компонент-сет
 * `icon / loader` 70326:21335). Там две оси:
 *
 *   Size   16х16 | 24х24 | 40х40
 *   Color  Green | Yellow | White
 *
 * Что было не так: размер L стоял 32px вместо 40, жёлтый был взят из
 * статусной палитры (`--yellow-214` #EEA20F), а белого варианта не было
 * вовсе. Цвета сняты пиксельно с самих растров сета: Green #80E3FF
 * (Base/Blue 223), Yellow #F8C000 (Yellow 167), White #FFFFFF.
 *
 * Имена значений в коде остались кодовыми (`brand`/`warning`/`white`,
 * `sm`/`md`/`lg`) — «Green» это имя из старого бренда, в текущей палитре
 * тот же слот голубой и переезжает вместе с темой.
 */
const loaderVariants = cva("animate-spin shrink-0", {
  variants: {
    color: {
      brand: "text-[var(--loader-fg)]",
      warning: "text-[var(--loader-warning-fg)]",
      white: "text-[var(--loader-white-fg)]",
    },
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-10",
    },
  },
  defaultVariants: {
    color: "brand",
    size: "md",
  },
})

interface LoaderProps
  extends Omit<React.SVGProps<SVGSVGElement>, "color">,
    VariantProps<typeof loaderVariants> {
  /** Подпись для скринридера. По умолчанию элемент скрыт от него. */
  label?: string
}

function Loader({ className, color, size, label, ...props }: LoaderProps) {
  return (
    <Loader2
      data-slot="loader"
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={cn(loaderVariants({ color, size }), className)}
      {...props}
    />
  )
}

export { Loader, loaderVariants }
export type { LoaderProps }
