import { AccordionCard } from "@/components/ui/accordion-card"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

function AccordionCardDemo() {
  return (
    <AccordionItem value="accordion-card-states">
      <AccordionTrigger>Accordion — состояния</AccordionTrigger>
      <AccordionPanel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AccordionCard title="Title" subtitle="Subtitle" />
          <AccordionCard title="Title" subtitle="Subtitle" blocked />

          <AccordionCard title="Title" subtitle="Subtitle" defaultOpen>
            Content
          </AccordionCard>
          <AccordionCard title="Title" subtitle="Subtitle" blocked defaultOpen>
            Content
          </AccordionCard>

          <AccordionCard title="Title" subtitle="Subtitle без контента" />
          <AccordionCard title="Без subtitle" defaultOpen>
            Content
          </AccordionCard>
        </div>
        <p className="mt-4 text-p3 text-muted-foreground">
          Type <code>blocked</code> — цветовой вариант (розовый фон вместо
          серого), не влияет на доступность взаимодействия — карточка
          по-прежнему открывается/закрывается по клику. При наведении
          подсвечивается только шапка (Title/Subtitle), а не вся карточка.
          Каждая карточка — независимый аккордеон (несколько штук на
          странице открываются друг от друга не завися), при укладке в
          стопку между блоками оставляйте 16px (<code>gap-4</code>).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { AccordionCardDemo }
