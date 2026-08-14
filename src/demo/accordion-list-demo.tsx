import { AccordionList, AccordionListItem } from "@/components/ui/accordion-list"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

function AccordionListDemo() {
  return (
    <>
      <AccordionItem value="accordion-list-anatomy">
        <AccordionTrigger>
          Content Accordion — checkbox / description / buttons
        </AccordionTrigger>
        <AccordionPanel>
          <AccordionList>
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              showCheckbox
              description="Description"
              showButtons
              defaultOpen
            >
              Content
            </AccordionListItem>
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              showCheckbox
              description="Description"
              showButtons
              buttonsType="button"
            />
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              showCheckbox
              description="Description"
              showButtons
              buttonsType="dropdown"
            />
            <AccordionListItem title="Title H4" titleAs="h4" subtitle="Subtitle" />
            <AccordionListItem title="Без checkbox/description/кнопок" />
          </AccordionList>
          <p className="mt-4 text-p3-regular text-muted-foreground">
            Checkbox, Description, Button и «···» (kebab) — независимо
            включаемые элементы (<code>showCheckbox</code>,{" "}
            <code>description</code>, <code>showButtons</code> +{" "}
            <code>buttonsType</code>). Клик по всей строке
            открывает/закрывает панель; клик по чекбоксу, кнопке или kebab не
            триггерит открытие (<code>stopPropagation</code>) — тот же
            приём, что и в клавише очистки у SelectTrigger:{" "}
            <code>nativeButton=&#123;false&#125;</code> +{" "}
            <code>render=&#123;&lt;div /&gt;&#125;</code>.
          </p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="accordion-list-statuses">
        <AccordionTrigger>Content Accordion — статусы Description</AccordionTrigger>
        <AccordionPanel>
          <AccordionList>
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              description="Description"
              descriptionType="default"
              showButtons
              buttonsType="button"
            />
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              description="Description"
              descriptionType="success"
              showButtons
              buttonsType="button"
            />
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              description="Description"
              descriptionType="attention"
              showButtons
              buttonsType="button"
            />
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              description="Description"
              descriptionType="error"
              showButtons
              buttonsType="button"
            />
            <AccordionListItem
              title="Title"
              subtitle="Subtitle"
              description="Description"
              descriptionType="information"
              showButtons
              buttonsType="button"
            />
          </AccordionList>
          <p className="mt-4 text-p3-regular text-muted-foreground">
            Цвета статусов Description (кроме error) не удалось сверить с
            пикселями макета — картинки этого компонента пришли инлайном без
            file-пути, в отличие от простого Accordion. Приблизительно по
            смыслу названия (success — зелёный, attention — жёлтый/оранжевый,
            information — серый); стоит сверить с исходником в Figma перед
            релизом.
          </p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="accordion-list-usage">
        <AccordionTrigger>Content Accordion — пример «Мои организации»</AccordionTrigger>
        <AccordionPanel>
          <AccordionList>
            <AccordionListItem
              title="Мои организации"
              subtitle="Текущая организация: ООО «СевероСтрой»"
              description="4 организации"
            >
              <AccordionList className="border-0">
                <AccordionListItem title="ООО «СевероСтрой»" subtitle="ИНН 7425678993" />
                <AccordionListItem title="ООО «Стройтех»" subtitle="ИНН 5029384756" />
                <AccordionListItem title="ИП Иванов И.И." subtitle="ИНН 6312345678" />
              </AccordionList>
            </AccordionListItem>
          </AccordionList>
        </AccordionPanel>
      </AccordionItem>
    </>
  )
}

export { AccordionListDemo }
