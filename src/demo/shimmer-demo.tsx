import { Shimmer } from "@/components/ui/shimmer"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

// Mirrors the spec's "Рис. 3. Подробный вариант Shimmer" — an offer card
// where each real element (title, description line, tag pill, rate value)
// is replaced by exactly one shimmer block sized to match it.
function OfferCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-5 w-16" />
      </div>
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-3/4" />
      <div className="flex items-center gap-3">
        <Shimmer shape="circle" className="size-8" />
        <Shimmer className="h-3 w-24" />
      </div>
    </div>
  )
}

function ShimmerDemo() {
  return (
    <AccordionItem value="shimmer">
      <AccordionTrigger>Shimmer</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Текст — блоки для заголовков (Heading 1–4), основного текста
            (P1–2), подписи (P3–4); многострочный текст всё равно
            обозначается одной строкой скелета
          </RowLabel>
          <div className="flex max-w-sm flex-col gap-2">
            <Shimmer className="h-6 w-2/3" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-5/6" />
            <Shimmer className="h-3 w-1/3" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Фигура — Square/Circle для иконок, аватарок или основных кнопок
          </RowLabel>
          <div className="flex items-center gap-3">
            <Shimmer shape="square" className="size-12" />
            <Shimmer shape="circle" className="size-12" />
            <Shimmer shape="square" className="h-10 w-28" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Использование в макете — карточка предложения (ui/shimmer, Рис.
            3): каждый элемент заменяется одним блоком, размер которого
            точно совпадает с реальным контентом
          </RowLabel>
          <div className="max-w-sm">
            <OfferCardSkeleton />
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Анимация — пульсация (opacity) с длительностью цикла 1.8с;
          подсветка внутри блока статична (запечена в градиенте), а не
          бегущий блик.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ShimmerDemo }
