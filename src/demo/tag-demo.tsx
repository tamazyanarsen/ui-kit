import { Tag } from "@/components/ui/tag"
import type { TagStatusColor } from "@/components/ui/tag"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

const STATUS_COLORS: { color: TagStatusColor; label: string }[] = [
  { color: "green", label: "Green (Completed)" },
  { color: "orange", label: "Orange (Process)" },
  { color: "red", label: "Red (Rejected)" },
  { color: "blue", label: "Blue (System)" },
  { color: "grey", label: "Grey (Draft)" },
]

function TagDemo() {
  return (
    <AccordionItem value="tag">
      <AccordionTrigger>Tag</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>Статусы — Main / Secondary (L)</RowLabel>
          <div className="grid grid-cols-5 gap-6">
            {STATUS_COLORS.map(({ color, label }) => (
              <div key={color} className="flex flex-col items-start gap-2">
                <Tag color={color} variant="main">
                  Example Text
                </Tag>
                <Tag color={color} variant="secondary">
                  Example Text
                </Tag>
                <span className="text-p3 text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Признаки — Black / White / Grey (Info)</RowLabel>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start gap-2">
              <Tag color="black">Example Text</Tag>
              <span className="text-p3 text-muted-foreground">
                Black (Sign)
              </span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Tag color="white">Example Text</Tag>
              <span className="text-p3 text-muted-foreground">
                White (Sign)
              </span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Tag color="grey-info">Example Text</Tag>
              <span className="text-p3 text-muted-foreground">
                Grey (Info sign)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Размеры — Large (Desktop) / Small (Mobile)</RowLabel>
          <div className="flex items-center gap-3">
            <Tag color="green" size="l">
              Example Text
            </Tag>
            <Tag color="green" size="s">
              Example Text
            </Tag>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Show Icon: True</RowLabel>
          <div className="flex items-center gap-3">
            <Tag color="green" variant="main" showIcon>
              Example Text
            </Tag>
            <Tag color="red" variant="secondary" showIcon>
              Example Text
            </Tag>
            <Tag color="black" showIcon>
              Example Text
            </Tag>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>Использование в макете — вместо компонента Status</RowLabel>
          <div className="flex items-center gap-3 rounded-lg border border-[#DEDEDE] px-4 py-3">
            <Tag color="green" variant="main">
              Исполнен
            </Tag>
            <Tag color="orange" variant="main">
              В обработке
            </Tag>
          </div>
        </div>

        <p className="mt-4 text-p3 text-muted-foreground">
          Tag — некликабельный компонент, тултип при наведении не
          предусмотрен. Статусные цвета (Green/Orange/Red/Blue/Grey) имеют
          варианты <code>main</code> (заливка) и <code>secondary</code>{" "}
          (обводка/тинт); признаки (Black/White/Grey-Info) — только один
          фиксированный вид. Используется вместо компонента Status, например
          в таблицах для отображения статуса документа/объекта.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TagDemo }
