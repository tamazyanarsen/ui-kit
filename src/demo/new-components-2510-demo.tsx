import * as React from "react"

import { BlockWithBanner } from "@/components/ui/block-with-banner"
import { PromoBanner } from "@/components/ui/banner"
import { Donut } from "@/components/ui/donut"
import { Item } from "@/components/ui/item"
import { PagedList } from "@/components/ui/paged-list"
import { PromoCarousel } from "@/components/ui/promo-carousel"
import { StackBar } from "@/components/ui/stack-bar"
import { AccordionItem, AccordionPanel, AccordionTrigger } from "@/demo/scaffold"
import {
  BALANCE,
  PORTFOLIO,
  PROMOS,
  PromoArt,
  TASKS,
  formatRub,
  sumOf,
} from "@/stories/new-components-fixtures"

import { RowLabel } from "./shared"

// Демо новых компонентов по Правкам UI-Kit от 25.10: графики (Donut,
// StackBar), ленты (PromoCarousel, PagedList с CarouselDots) и баннер под
// блоком (BlockWithBanner). Форма — по ширине окна (порог 1280).

function ChartsDemo() {
  const [active, setActive] = React.useState<number | null>(null)
  const [data, setData] = React.useState(PORTFOLIO)
  return (
    <AccordionItem value="charts">
      <AccordionTrigger>Donut, Stack Bar</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-6">
          <RowLabel>Donut 224 «Портфель», наведение на легенду — подсветка</RowLabel>
          <div className="flex flex-wrap items-center gap-8">
            <Donut data={PORTFOLIO} label="Портфель" value={formatRub(sumOf(PORTFOLIO))} activeIndex={active} />
            <ul className="flex flex-col gap-2 text-p2-medium">
              {PORTFOLIO.map((datum, i) => (
                <li key={datum.name} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                  {datum.name}
                </li>
              ))}
            </ul>
            <Donut data={PORTFOLIO} size={300} label="Портфель" value={formatRub(sumOf(PORTFOLIO))} />
          </div>
          <RowLabel>Stack Bar — нажмите на полосу, чтобы сменить данные</RowLabel>
          <div
            className="w-full max-w-[560px] cursor-pointer"
            onClick={() => setData((d) => (d === PORTFOLIO ? BALANCE : PORTFOLIO))}
          >
            <StackBar
              data={data}
              label={data === PORTFOLIO ? "Портфель" : "Баланс"}
              total={formatRub(sumOf(data))}
            />
          </div>
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

function CarouselsDemo() {
  return (
    <AccordionItem value="carousels">
      <AccordionTrigger>Promo Carousel, Paged List, Carousel Dots</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-6">
          <RowLabel>Promo Carousel — десктоп: два в кадре и стрелки; уже 1280: один, свайп, точки</RowLabel>
          <div className="w-full max-w-[880px]">
            <PromoCarousel>
              {PROMOS.map((promo) => (
                <PromoBanner
                  key={promo.title}
                  title={promo.title}
                  description={promo.description}
                  actionLabel={promo.actionLabel}
                  color={promo.color}
                  image={<PromoArt tone={promo.tone} />}
                />
              ))}
            </PromoCarousel>
          </div>
          <RowLabel>Paged List «Дела» по 4 — страницы только уже 1280</RowLabel>
          <div className="w-full max-w-[400px] overflow-hidden rounded-[16px] bg-[var(--card-box-bg)]">
            <PagedList pageSize={4}>
              {TASKS.map(([value, text]) => (
                <Item key={value} value={value} text={text} rightElement="navigation" onClick={() => {}} />
              ))}
            </PagedList>
          </div>
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

function BlockWithBannerDemo() {
  return (
    <AccordionItem value="block-with-banner">
      <AccordionTrigger>Block With Banner</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-6 bg-[var(--page-bg)] p-4">
          <BlockWithBanner
            className="max-w-[640px]"
            banner="Подключите накопительный счёт — доход на остаток каждый день"
            actionLabel="Подключить"
            href="https://example.com"
            external
          >
            <div className="h-48 p-4 text-h3-adaptive desktop:p-8">Мои сбережения</div>
          </BlockWithBanner>
          <BlockWithBanner className="max-w-[640px]">
            <div className="h-48 p-4 text-h3-adaptive desktop:p-8">Без баннера</div>
          </BlockWithBanner>
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { BlockWithBannerDemo, CarouselsDemo, ChartsDemo }
