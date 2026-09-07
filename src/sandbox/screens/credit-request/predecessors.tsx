import { Plus, Trash } from "@/icons"
import { Button } from "@/components/ui/button"
import { Informer } from "@/components/ui/informer"
import { Input } from "@/components/ui/input"

import { SandboxFieldRow, SandboxSection } from "../../shell"

import type { Predecessor } from "./data"

// Раздел «Правопредшественники» шага 2 заявки на кредит.
//
// Появляется и исчезает вместе с ответом в селекте «Заёмщик является
// правопреемником»: «Нет» оставляло бы на экране заполненных
// правопредшественников, которых по данным нет. Состояние держит экран —
// раздел управляемый.

interface PredecessorsSectionProps {
  items: Predecessor[]
  onChange: (id: string, patch: Partial<Predecessor>) => void
  onRemove: (id: string) => void
  onAdd: () => void
}

function PredecessorsSection({
  items,
  onChange,
  onRemove,
  onAdd,
}: PredecessorsSectionProps) {
  return (
    <SandboxSection title="Правопредшественники">
      <Informer
        solid="grey"
        icon="information"
        title="Укажите организации, являющиеся правопредшественниками заёмщика"
        showCross={false}
      />

      {items.map((item, index) => (
        <SandboxSection
          key={item.id}
          gap={16}
          title={
            <h4 className="text-h4 text-[var(--grey-1514)]">
              Правопредшественник {index + 1}
            </h4>
          }
          action={
            <Button
              variant="secondary-grey"
              size="sm"
              icon={Trash}
              iconPosition="left"
              /* Единственного правопредшественника удалить нельзя — ответ
                 «Да» без единой организации был бы противоречием. В эталоне
                 кнопка тоже выключена. */
              disabled={items.length === 1}
              onClick={() => onRemove(item.id)}
            >
              Удалить
            </Button>
          }
        >
          <SandboxFieldRow>
            <Input
              label="Полное наименование ЮЛ"
              value={item.fullName}
              onChange={(event) =>
                onChange(item.id, { fullName: event.target.value })
              }
              clearable
              onClear={() => onChange(item.id, { fullName: "" })}
            />
            <Input
              label="Сокращённое наименование ЮЛ"
              value={item.shortName}
              onChange={(event) =>
                onChange(item.id, { shortName: event.target.value })
              }
              clearable
              onClear={() => onChange(item.id, { shortName: "" })}
            />
          </SandboxFieldRow>
          <SandboxFieldRow>
            <Input
              label="ОГРН"
              value={item.ogrn}
              onChange={(event) => onChange(item.id, { ogrn: event.target.value })}
              clearable
              onClear={() => onChange(item.id, { ogrn: "" })}
            />
            <span />
          </SandboxFieldRow>
        </SandboxSection>
      ))}

      <div>
        <Button
          variant="secondary-grey"
          size="sm"
          icon={Plus}
          iconPosition="left"
          onClick={onAdd}
        >
          Добавить
        </Button>
      </div>
    </SandboxSection>
  )
}

export { PredecessorsSection }
export type { PredecessorsSectionProps }
