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
        <p className="mt-4 text-xs text-muted-foreground">
          В отличие от Input, у Textarea нет S/L токенов и label не
          «плавает» — это статичная подпись сверху, всегда видимая. Высота
          поля задаётся атрибутом <code>rows</code> (по умолчанию 3) и не
          меняется между пустым и заполненным состояниями — но, в отличие от
          более ранней версии этого компонента, всё же масштабируется
          mobile → desktop (сверено с ui/textarea/*.svg: 98px → 112px,
          padding <code>py-2 md:py-4</code>), как и L-размер Input.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { TextareaDemo }
