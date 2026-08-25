import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"
import { TableFieldTypesExample } from "@/stories/table-field-types-example"
import { TableFieldsExample } from "@/stories/table-fields-example"

import { RowLabel } from "./shared"
import { TableCompositionDemo } from "./table-demo-composition"

function TableDemo() {
  return (
    <AccordionItem value="table">
      <AccordionTrigger>Table</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Табличный блок — заливка white 101, радиус 16px, внутренние
            элементы с горизонтальным padding 16px: Название, Блок фильтрации,
            Сводка, Шапка, Блок с данными, Пагинатор
          </RowLabel>
          <RowLabel>
            Закрепления — чекбокс и колонка иерархии слева, блок действий
            справа; подложки с тенью появляются, только когда за ними есть
            скрытый контент. Шапка липкая при вертикальной прокрутке
          </RowLabel>
          <RowLabel>
            Строки — вложенность со сдвигом 16px и шевроном, ховер/активное
            состояние только у кликабельных строк, «Добавить строку» включает
            подсветку Added на 2000 ms
          </RowLabel>
          <RowLabel>
            Ячейки — Checkbox, Text + описание, Tag, Number (моноширинные
            цифры, зелёный для поступлений), Selection Button с действиями;
            усечённый текст показывает подсказку
          </RowLabel>
          <TableCompositionDemo />

          <RowLabel>
            То же самое по конфигу полей — `DataTable`: место использования
            отдаёт данные и описание столбцов, а вариант ячейки и формат
            значения выбираются по типу поля (text, list, number, money,
            percent, date, datetime, time, boolean, checkbox, tag, link,
            icon, actions, custom)
          </RowLabel>
          <RowLabel>
            Вложенность выключает сортировку целиком — по документации она
            невозможна без нарушения иерархии; на плоском наборе строк
            заголовки становятся кнопками сортировки
          </RowLabel>
          <TableFieldsExample />

          <RowLabel>
            Все типы полей по столбцу на каждый — включая «Несколько (N)» для
            массива значений и прочерк для пустого
          </RowLabel>
          <TableFieldTypesExample />
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TableDemo }
