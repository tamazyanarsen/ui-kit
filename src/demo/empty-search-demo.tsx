import { Search } from "@/icons"

import { EmptySearchResults } from "@/components/ui/empty-search"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function EmptySearchDemo() {
  return (
    <AccordionItem value="empty-search">
      <AccordionTrigger>Empty Search Results</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Полный набор — Icon / Title / Description / Button</RowLabel>
          <div className="rounded-lg border border-[#DEDEDE]">
            <EmptySearchResults
              title="Ничего не найдено"
              description="Попробуйте изменить параметры поиска или сбросить фильтры"
              buttonLabel="Сбросить фильтры"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Large Icon + свой значок</RowLabel>
          <div className="rounded-lg border border-[#DEDEDE]">
            <EmptySearchResults
              icon={<Search aria-hidden="true" />}
              largeIcon
              title="Ничего не найдено"
              description="По вашему запросу результатов нет"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Только Title — без иконки, описания и кнопки</RowLabel>
          <div className="rounded-lg border border-[#DEDEDE]">
            <EmptySearchResults icon={null} title="Список пуст" />
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Иконка, описание и кнопка независимо опциональны — блок
          используется не только для поиска, а для любого «нет данных».
          Вертикальный отступ 64px сверху/снизу, по центру горизонтальной оси.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { EmptySearchDemo }
