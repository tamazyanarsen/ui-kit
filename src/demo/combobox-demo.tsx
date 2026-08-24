import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"
import { DocumentsMultiSelect } from "./combobox-demo-documents"
import { CompanySearchDropdown } from "./combobox-demo-search"
import { TreeMultiSelectDropdown } from "./combobox-demo-tree"

function ComboboxDemo() {
  return (
    <AccordionItem value="select-dropdown">
      <AccordionTrigger>
        Select — Dropdown (поиск / дерево / множественный выбор)
      </AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <RowLabel>Поиск + множественный выбор</RowLabel>
            <CompanySearchDropdown />
            <p className="text-p3-regular text-muted-foreground">
              Введите 3+ символа (например «742»). Значение «error» всегда
              завершается ошибкой — проверка авто-повтора (до 5 попыток).
            </p>
          </div>
          <div className="space-y-2">
            <RowLabel>Дерево (checkbox-каскад)</RowLabel>
            <TreeMultiSelectDropdown />
            <p className="text-p3-regular text-muted-foreground">
              Родительский чекбокс не является отдельным значением —
              отражает состояние дочерних (indeterminate/checked) и
              переключает их все разом.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <RowLabel>Триггер «Выбрано документов: N»</RowLabel>
              <DocumentsMultiSelect max={5} />
              <p className="text-p3-regular text-muted-foreground">
                Футер с ограничением: «Выбрать: N/5», остальные пункты
                блокируются по достижении лимита.
              </p>
            </div>
            <div className="space-y-2">
              <DocumentsMultiSelect />
              <p className="text-p3-regular text-muted-foreground">
                Без ограничения: «Выбрать: N».
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-p3-regular text-muted-foreground">
          Шаг 2 из 3: Dropdown-контейнер — поиск (со всеми состояниями Рис.
          1-6 из макета), список с чекбоксами, каскад родитель/потомок и
          футер Сбросить/Применить или Сбросить/Выбрать N(/max).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ComboboxDemo }
