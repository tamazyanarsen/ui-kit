import * as React from "react"

import { ExternalLink } from "@/icons"

import { cn } from "@/lib/utils"
import { hasNode } from "@/lib/has-node"
import { Button } from "@/components/ui/button"

// BlockWithBanner — белый блок с инлайн-баннером, подложенным под него.
// Правки UI-Kit от 25.10, пункт «Инлайн-баннер под блоком (новый шаблон)»: на
// главной — подсказка НСО под «Моими сбережениями».
//
//   • белый блок со всеми скруглёнными углами лежит на подложке Blue 114;
//     подложка — общая обёртка с тем же скруглением и обрезкой;
//   • баннер заходит под блок на 32, поля 32 по бокам и снизу (видимая
//     высота 96 с кнопкой 32); текст P1, кнопка secondary-black sm справа,
//     для перехода наружу — значок ExternalLink справа от подписи;
//   • высота блока не меняется — обёртка растёт на видимую часть баннера;
//   • баннера нет — нет и подложки: белый блок как есть;
//   • мобильный вид (уже 1280): заход 16, поля 16, кнопка под текстом через 8
//     по левому краю.
//
// Белый блок рисует сам компонент (`children` — его содержимое), чтобы
// скругление блока и обёртки совпадало: 16 в мобильном виде, 24 на десктопе.

interface BlockWithBannerProps extends React.ComponentProps<"div"> {
  /** Текст баннера. Не задан — баннера и подложки нет. */
  banner?: React.ReactNode
  /** Подпись кнопки баннера. */
  actionLabel?: React.ReactNode
  onAction?: () => void
  /** Ссылка кнопки — кнопка рисуется ссылкой `<a>`. */
  href?: string
  /** Переход наружу: значок ExternalLink и новая вкладка. */
  external?: boolean
  /** Классы белого блока. */
  blockClassName?: string
}

const BlockWithBanner = React.forwardRef<HTMLDivElement, BlockWithBannerProps>(
  function BlockWithBanner(
    {
      banner,
      actionLabel,
      onAction,
      href,
      external = false,
      blockClassName,
      className,
      children,
      ...props
    },
    ref
  ) {
    const withBanner = hasNode(banner)
    const radius = "rounded-[16px] desktop:rounded-[24px]"

    const action =
      hasNode(actionLabel) &&
      (href ? (
        <Button
          variant="secondary-black"
          size="sm"
          icon={external ? ExternalLink : undefined}
          iconPosition={external ? "right" : undefined}
          nativeButton={false}
          // Base UI ставит не-кнопке `role="button"`; переход — это ссылка.
          role="link"
          render={
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            />
          }
          onClick={onAction}
          className="shrink-0"
        >
          {actionLabel}
        </Button>
      ) : (
        <Button
          variant="secondary-black"
          size="sm"
          icon={external ? ExternalLink : undefined}
          iconPosition={external ? "right" : undefined}
          onClick={onAction}
          className="shrink-0"
        >
          {actionLabel}
        </Button>
      ))

    return (
      <div
        ref={ref}
        data-slot="block-with-banner"
        data-banner={withBanner || undefined}
        className={cn(
          "flex w-full flex-col",
          radius,
          withBanner && "overflow-hidden bg-[var(--block-with-banner-bg)]",
          className
        )}
        {...props}
      >
        <div
          data-slot="block-with-banner-block"
          className={cn("relative z-[1] bg-[var(--card-box-bg)]", radius, blockClassName)}
        >
          {children}
        </div>
        {withBanner && (
          <div
            data-slot="block-with-banner-banner"
            className={cn(
              "-mt-4 flex flex-col items-start gap-2 px-4 pt-8 pb-4",
              "desktop:-mt-8 desktop:flex-row desktop:items-center desktop:gap-6 desktop:px-8 desktop:pt-16 desktop:pb-8"
            )}
          >
            <p className="min-w-0 flex-1 text-p1-medium-adaptive text-[var(--block-with-banner-fg)] [overflow-wrap:anywhere]">
              {banner}
            </p>
            {action}
          </div>
        )}
      </div>
    )
  }
)

export { BlockWithBanner }
export type { BlockWithBannerProps }
