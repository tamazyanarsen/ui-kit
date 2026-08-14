import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Loader2 } from "@/icons"
import { cn } from "@/lib/utils"

/**
 * Core Component «Loader» — крутящийся спиннер из Figma («icon / loader»,
 * нода 26561:26028).
 *
 * Дизайн-чек №8: до этого лоудера как отдельного компонента не было — каждое
 * место рисовало иконку само и красило её в свой акцент, из-за чего в матрице
 * кнопки оказалось шесть разных по цвету спиннеров. По дизайн-системе лоудер
 * всегда брендового цвета (замерено пиксельно на растре, который Figma отдаёт
 * для состояния Loading: #80E3FF, он же Base/Blue 223), и меняется он вместе
 * с палитрой, а не с типом кнопки. Единственный дополнительный цвет, который
 * дизайнер разрешил завести, — warning (жёлтый); в кнопке он не применяется.
 */
const loaderVariants = cva("animate-spin shrink-0", {
  variants: {
    color: {
      brand: "text-[var(--loader-fg)]",
      warning: "text-[var(--loader-warning-fg)]",
    },
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
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
