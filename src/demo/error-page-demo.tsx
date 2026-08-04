import { ErrorPage } from "@/components/ui/error-page"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function ErrorPageDemo() {
  return (
    <AccordionItem value="error-page">
      <AccordionTrigger>Error Page</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>403 — доступ ограничен</RowLabel>
          <div className="rounded-lg border border-[#DEDEDE]">
            <ErrorPage
              code="403"
              title="Страница недоступна"
              description="У вас нет доступа для просмотра этой страницы. Вы можете вернуться на главную"
              buttonLabel="На главную"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <RowLabel>404 — страница не найдена</RowLabel>
          <div className="rounded-lg border border-[#DEDEDE]">
            <ErrorPage
              code="404"
              title="Страница не найдена"
              description="Возможно, она была удалена или вы перешли по неверной ссылке. Проверьте адрес ещё раз"
              buttonLabel="На главную"
            />
          </div>
        </div>

        <p className="mt-6 text-p3 text-muted-foreground">
          Иллюстрация в спеке — кастомный 3D-маскот (например, наушник в
          форме «0» в «403»). Здесь, как и с логотипом Госуслуг ранее в
          Button, вместо точной копии — плоские цифры кода: это
          demo/spec-verification кит, не место для копирования сложной
          иллюстративной графики.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ErrorPageDemo }
