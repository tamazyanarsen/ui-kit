import { CardBox } from "@/components/ui/card-box"
import { ItemInformationField } from "@/components/ui/item-information-field"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const ROWS = [
  ["Номер договора", "БК-2024-000148"],
  ["Дата заключения", "12.03.2024"],
  ["Срок действия", "до 12.03.2027"],
  ["Ответственный", "Иванова Мария Сергеевна"],
  ["Статус", "Действует"],
  ["Подразделение", "Управление корпоративного обслуживания"],
]

function CardBoxDemo() {
  return (
    <AccordionItem value="card-box">
      <AccordionTrigger>Card Box</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Large — заголовок и контент в одной колонке</RowLabel>
          <div className="bg-[#F8F8F8] p-4">
            <CardBox title="Стандартный блок">
              <div className="grid gap-6 sm:grid-cols-2">
                {ROWS.slice(0, 4).map(([label, value]) => (
                  <ItemInformationField key={label} label={label} value={value} />
                ))}
              </div>
            </CardBox>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Small — шапка отдельно, контент прокручивается под ней
          </RowLabel>
          <div className="bg-[#F8F8F8] p-4">
            <CardBox type="small" title="Блок со скроллом" maxHeight={280}>
              <div className="flex flex-col gap-6">
                {[...ROWS, ...ROWS].map(([label, value], index) => (
                  <ItemInformationField
                    key={`${label}-${index}`}
                    label={label}
                    value={value}
                  />
                ))}
              </div>
            </CardBox>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Table — слот во всю ширину, без внутренних отступов</RowLabel>
          <div className="bg-[#F8F8F8] p-4">
            <CardBox type="table" title="Блок с таблицей">
              <table className="w-full border-collapse text-p2-regular">
                <tbody>
                  {ROWS.map(([label, value]) => (
                    <tr key={label} className="border-t border-[#DEDEDE]">
                      <td className="px-4 py-3 text-[#6D6D6D]">{label}</td>
                      <td className="px-4 py-3 text-right">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBox>
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Отступы блока: 32px на десктопе и 16px на мобайле (у типа{" "}
          <code>table</code> шапка всегда 16px). У типа <code>small</code>{" "}
          высота ограничена 792px — при переполнении контент уходит под шапку,
          появляется скролл и разделители сверху/снизу.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { CardBoxDemo }
