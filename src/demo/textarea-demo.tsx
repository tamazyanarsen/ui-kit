import { Textarea } from "@/components/ui/textarea"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

function TextareaDemo() {
  return (
    <AccordionItem value="textarea-states">
      <AccordionTrigger>Textarea — состояния</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Textarea label="Label" />
          <Textarea
            label="Label"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
          <Textarea
            label="Label"
            comment="Comment"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore magna"
          />
          <Textarea label="Label" comment="Comment без значения" />
          <Textarea
            label="Label"
            locked
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore magna"
          />
          <Textarea label="Label" error="Text about error here" />
          <Textarea
            label="Label"
            error="Text about error here"
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore magna"
          />
          <Textarea
            label="Label"
            error="Text about error here"
            locked
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore magna"
          />
          <Textarea label="Label" disabled />
          <Textarea
            label="Label"
            disabled
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore magna"
          />
        </div>
        <p className="mt-4 text-p3 text-muted-foreground">
          В отличие от Input, у Textarea нет S/L токенов, но label «плавает»
          так же: пустое поле показывает его как обычный плейсхолдер (16px),
          а при вводе/фокусе он превращается в маленькую (12px) подпись
          сверху — тогда же вертикальный паддинг сжимается с 16px до 8px,
          как и в макете. Высота поля задаётся атрибутом{" "}
          <code>rows</code> (по умолчанию 3); паддинг и радиус — 16px на
          обоих брейкпоинтах (сверено с ui/textarea/*.svg).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TextareaDemo }
