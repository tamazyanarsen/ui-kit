import { Scrollbar } from "@/components/ui/scrollbar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

const LABELS = Array.from({ length: 8 }, (_, i) => `Label ${i + 1}`)

// Dropdown-list usage (ui/scrollbar) — 8px inset from top/bottom/right.
function DropdownListExample() {
  return (
    <Scrollbar
      orientation="vertical"
      className="h-52 w-56 rounded-2xl border bg-white py-2 pr-2 pl-4"
    >
      <ul className="flex flex-col gap-3">
        {LABELS.map((label) => (
          <li key={label}>
            <Checkbox label={label} />
          </li>
        ))}
      </ul>
    </Scrollbar>
  )
}

// Table usage (ui/scrollbar) — 16px inset from left/right/bottom, thicker
// (8px) track since horizontal scroll is more common in wide tables.
function TableScrollExample() {
  return (
    <Scrollbar
      orientation="horizontal"
      className="w-full rounded-2xl border bg-white px-4 pb-4"
    >
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="text-xs text-muted-foreground">
            {["Номер", "Дата открытия", "Дата закрытия", "Ставка", "Статус", "Комментарий", "Менеджер"].map(
              (col) => (
                <th key={col} className="py-3 pr-8 font-medium">
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 3 }, (_, i) => (
            <tr key={i} className="border-t">
              <td className="py-3 pr-8">10{i}</td>
              <td className="py-3 pr-8">24.12.2022</td>
              <td className="py-3 pr-8">24.12.2025</td>
              <td className="py-3 pr-8">12%</td>
              <td className="py-3 pr-8">Открыт</td>
              <td className="py-3 pr-8">Без комментариев</td>
              <td className="py-3 pr-8">Иванов И.И.</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scrollbar>
  )
}

function ScrollbarDemo() {
  return (
    <AccordionItem value="scrollbar">
      <AccordionTrigger>Scrollbar</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Vertical — 4px, отступы в выпадающем списке: 8px сверху/снизу/справа
          </RowLabel>
          <DropdownListExample />
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Horizontal — 8px (толще вертикального), отступы в таблице: 16px
            слева/справа/снизу
          </RowLabel>
          <TableScrollExample />
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ScrollbarDemo }
