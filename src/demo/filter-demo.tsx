import * as React from "react"
import { Circle } from "lucide-react"

import { Filter } from "@/components/ui/filter"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function FilterTableExample() {
  const [status, setStatus] = React.useState<string | null>("Оплачен")
  const [amount, setAmount] = React.useState<string | null>(null)

  const rows = [
    { id: "1001", status: "Оплачен", amount: "12 500 ₽" },
    { id: "1002", status: "В обработке", amount: "3 200 ₽" },
    { id: "1003", status: "Оплачен", amount: "48 900 ₽" },
  ]

  return (
    <div className="rounded-lg border border-[#DEDEDE] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Filter label="Статус" value={status} onValueChange={setStatus} chip />
        <Filter label="Сумма" value={amount} onValueChange={setAmount} chip />
      </div>
      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground">
            <th className="pb-2 font-medium">№</th>
            <th className="pb-2 font-medium">Статус</th>
            <th className="pb-2 font-medium">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[#DEDEDE]">
              <td className="py-2">{row.id}</td>
              <td className="py-2">{row.status}</td>
              <td className="py-2">{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FilterDemo() {
  return (
    <AccordionItem value="filter">
      <AccordionTrigger>Filter</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Фон — White / Grey</RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Filter label="Filter" background="white" />
            <Filter label="Filter" background="grey" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>С Subtitle</RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Filter label="Filter" subtitle="Subtitle" background="white" />
            <Filter label="Filter" subtitle="Subtitle" background="grey" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Опциональные элементы — Icon / Badge</RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Filter label="Filter" icon={<Circle aria-hidden="true" />} />
            <Filter label="Filter" count={3} />
            <Filter label="Filter" icon={<Circle aria-hidden="true" />} count={3} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Поведение Select — closed / open / есть значение (клик по X
            сбрасывает без открытия попапа)
          </RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Filter label="Filter" subtitle="Subtitle" defaultValue={null} />
            <Filter label="Filter" subtitle="Subtitle" defaultValue="Значение" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Disabled</RowLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Filter label="Filter" disabled />
            <Filter label="Filter" subtitle="Subtitle" disabled />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>
            Использование в таблице (ui/filter-table) — применённое
            значение сворачивается в тёмный чипс с крестиком
          </RowLabel>
          <FilterTableExample />
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Filter — Select-подобный триггер: клик открывает попап с полем
          ввода и футером «Сбросить» / «Применить». Применённое значение
          показывается вместо шеврона крестиком (X), клик по нему сбрасывает
          фильтр напрямую, не открывая попап. Проп <code>chip</code>{" "}
          включает вид из ui/filter-table — компактный тёмный чипс с
          применённым значением, как это используется в фильтр-баре над
          таблицей.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { FilterDemo }
