import * as React from "react"
import { Information } from "@/icons"

import { useIsDesktop } from "@/lib/use-is-desktop"
import { Hint } from "@/components/ui/tooltip"
import { InfoHint } from "@/components/ui/info-hint"

interface CaptionInfoProps {
  /** Текст подсказки по значку; без него значок декоративный. */
  hint?: React.ReactNode
}

/**
 * Значок «i» 16×16 в строке подписи под полем (Input, Textarea).
 *
 * На десктопе подсказка раскрывается по клику через `Hint`, как в макете
 * поля. В мобильном виде (уже 1280) — по правилу каркаса из Правок UI-Kit
 * от 25.10 («Значок „Информация“ (i) в мобильном виде — штора с текстом»)
 * нажатие открывает штору `InfoHint`: заголовок «Информация», кнопок нет.
 */
function CaptionInfo({ hint }: CaptionInfoProps) {
  const isDesktop = useIsDesktop()

  if (!hint) {
    return (
      <Information
        aria-hidden="true"
        className="size-4 shrink-0 text-[var(--input-caption-fg)]"
      />
    )
  }

  const button = (
    <button
      type="button"
      aria-label="Дополнительная информация"
      className="shrink-0 text-[var(--input-caption-fg)] outline-none focus-visible:focus-ring"
    >
      <Information aria-hidden="true" className="size-4" />
    </button>
  )

  return isDesktop ? (
    <Hint content={hint} direction="down-center">
      {button}
    </Hint>
  ) : (
    <InfoHint content={hint}>{button}</InfoHint>
  )
}

export { CaptionInfo }
export type { CaptionInfoProps }
