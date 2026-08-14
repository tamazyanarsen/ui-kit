import { Card } from "@/components/ui/card"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const MENU_ITEMS = [
  { text: "Активировать карту" },
  { text: "Перейти к счёту карты" },
  { text: "Переименовать" },
]

function CardDemo() {
  return (
    <AccordionItem value="card">
      <AccordionTrigger>Card</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Варианты</RowLabel>
          <div className="flex flex-col gap-4">
            <Card
              title="МИР Classic Business"
              titleSuffix="1135"
              tag="Активна"
              subtitle="Константинопольский Константин Константинович"
              value="Счёт 40702 810 7 00590062522"
              thumbnailNumber="4135"
              menuItems={MENU_ITEMS}
            />
            <Card
              title="МИР Classic Business"
              tag="Активна"
              subtitle="Константинопольский Константин Константинович"
              value="Счёт 40702 810 7 00590062522"
              thumbnailNumber="4135"
            />
            <Card
              title="МИР Classic Business"
              tag="Активна"
              value="Счёт 40702 810 7 00590062522"
              thumbnailNumber="4135"
            />
            <Card
              title="МИР Classic Business"
              tag="Активна"
              value="Счёт 40702 810 7 00590062522"
              showThumbnail={false}
            />
            <Card
              title="МИР Classic Business"
              value="Счёт 40702 810 7 00590062522"
              showThumbnail={false}
            />
            <Card title="МИР Classic Business" showThumbnail={false} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Hover + клик по карточке</RowLabel>
          <div className="flex flex-col gap-4">
            <Card
              title="МИР Classic Business"
              titleSuffix="1135"
              tag="Активна"
              subtitle="Константинопольский Константин Константинович"
              value="Счёт 40702 810 7 00590062522"
              thumbnailNumber="4135"
              menuItems={MENU_ITEMS}
              onClick={() => console.log("Переход на экран просмотра карты")}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Длинный текст — обрезается многоточием</RowLabel>
          <Card
            title="Lorem ipsum dolor sit amet, consectetuer adipiscing elit"
            titleSuffix="1135"
            tag="Активна"
            subtitle="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."
            value="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
            thumbnailNumber="4135"
            menuItems={MENU_ITEMS}
          />
        </div>

        <p className="mt-4 text-p3-regular text-muted-foreground">
          Все текстовые блоки — в одну строку, переполнение скрывается в
          многоточие. Каждый элемент (номер карты, тег, подпись, значение,
          кнопка меню) необязателен и просто не рендерится при отсутствии
          соответствующего пропа — как в спеке (Show Number Card / Show Tag /
          Show User Name / Show Value / Show Button). При наведении фон
          меняется на Grey 114 (#EFEFEF); клик по самой карточке и клик по
          кнопке-многоточию — независимые обработчики (клик на пункте меню не
          всплывает до строки).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { CardDemo }
