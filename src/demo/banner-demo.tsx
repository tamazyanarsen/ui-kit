import { Banner } from "@/components/ui/banner"
import type { BannerColor } from "@/components/ui/banner"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const COLORS: BannerColor[] = ["black", "pink", "green", "blue"]

function BannerDemo() {
  return (
    <AccordionItem value="banner">
      <AccordionTrigger>Banner</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Colored banner — compact</RowLabel>
          <div className="flex flex-col gap-4">
            {COLORS.map((color) => (
              <Banner
                key={color}
                size="compact"
                color={color}
                title="Вклад до 10%"
                description="При открытии в приложении банка"
                ctaLabel="Подробнее"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Colored banner — mobile</RowLabel>
          <div className="flex flex-wrap gap-4">
            {COLORS.map((color) => (
              <Banner
                key={color}
                size="mobile"
                color={color}
                image={false}
                title="Вклад до 10%"
                description="Выберите необходимые параметры кредита и зарегистрируйтесь через Госуслуги"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Black banner — desktop</RowLabel>
          <Banner
            size="desktop"
            title="Мобильное приложение банка"
            bullet
            description={[
              "Отслеживайте информацию по кредиту и ипотеке и вовремя вносите платежи без комиссии",
              "Подбирайте индивидуальные условия по вкладу в конструкторе, а также открывайте другие продукты на выгодных условиях",
            ]}
            ctaLabel="Подробнее"
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Black banner — compact</RowLabel>
          <Banner
            size="compact"
            title="Вклад до 10%"
            description="При открытии в приложении банка"
            ctaLabel="Подробнее"
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Black banner — mobile</RowLabel>
          <Banner
            size="mobile"
            title="Вклад до 10%"
            description={[
              "Отслеживайте информацию по кредиту и ипотеке и вовремя вносите платежи без комиссии",
              "Подбирайте индивидуальные условия по вкладу в конструкторе, а также открывайте другие продукты на выгодных условиях",
            ]}
            ctaLabel="Подробнее"
          />
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Один компонент на три размера (<code>size</code>: desktop / compact
          / mobile) — так же, как устроен сам узел в Figma. <code>color</code>{" "}
          управляет тем, с какого слоя pastel-градиента начинается фон
          (blue показывает только нижний слой, black — все четыре); тёмный
          фон переключает текст на белый, светлые — на #252628. Пропсы{" "}
          <code>image</code>/<code>ctaLabel</code> необязательны — в спеке
          встречаются варианты без картинки и без кнопки (например мобильная
          строка цветного баннера).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { BannerDemo }
