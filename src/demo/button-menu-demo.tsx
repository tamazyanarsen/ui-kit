import {
  ButtonMenu,
  ButtonMenuBlack,
  ButtonMenuOverflow,
  ButtonMenuOverflowItem,
} from "@/components/ui/button-menu"
import { Button } from "@/components/ui/button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/demo/scaffold"

import { RowLabel } from "./shared"

function ButtonMenuDemo() {
  return (
    <AccordionItem value="button-menu">
      <AccordionTrigger>Button Menu</AccordionTrigger>
      <AccordionPanel>
        <div className="space-y-8">
          <div>
            <p className="mb-3 text-p2-medium text-[#252628]">
              Black — панель выделения строк таблицы
            </p>
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <RowLabel>3 кнопки + информационный бар</RowLabel>
                <ButtonMenuBlack
                  onClose={() => {}}
                  info={[
                    { label: "Выбрано", value: "10", className: "w-16" },
                    { label: "На сумму", value: "1 847 540,00 ₽" },
                    { label: "Списания", value: "- 3 847 540 ₽" },
                  ]}
                >
                  <Button>Подписать</Button>
                  <Button>Отправить</Button>
                  <Button>Удалить</Button>
                </ButtonMenuBlack>
              </div>
              <div className="space-y-1.5">
                <RowLabel>Без информационного бара</RowLabel>
                <ButtonMenuBlack onClose={() => {}}>
                  <Button>Подписать</Button>
                  <Button>Удалить</Button>
                </ButtonMenuBlack>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-3 text-p2-medium text-[#252628]">
              With Primary
            </p>
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <RowLabel>1 кнопка</RowLabel>
                <ButtonMenu>
                  <Button size="lg">Экспорт</Button>
                </ButtonMenu>
              </div>
              <div className="space-y-1.5">
                <RowLabel>2 кнопки</RowLabel>
                <ButtonMenu>
                  <Button size="lg">Экспорт</Button>
                  <Button size="lg" variant="secondary-grey">
                    Печать
                  </Button>
                </ButtonMenu>
              </div>
              <div className="space-y-1.5">
                <RowLabel>3 кнопки + Overflow</RowLabel>
                <ButtonMenu>
                  <Button size="lg">Экспорт</Button>
                  <Button size="lg" variant="secondary-grey">
                    Печать
                  </Button>
                  <Button size="lg" variant="secondary-grey">
                    Архивировать
                  </Button>
                  <ButtonMenuOverflow>
                    <ButtonMenuOverflowItem
                      text="Дублировать"
                      description="Создать копию элемента"
                    />
                    <ButtonMenuOverflowItem
                      text="Переместить"
                      description="Перенести в другую папку"
                    />
                    <ButtonMenuOverflowItem
                      text="Удалить"
                      description="Действие нельзя отменить"
                    />
                  </ButtonMenuOverflow>
                </ButtonMenu>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-p2-medium text-[#252628]">
              Only Secondary
            </p>
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <RowLabel>1 кнопка</RowLabel>
                <ButtonMenu>
                  <Button size="lg" variant="secondary-grey">
                    Печать
                  </Button>
                </ButtonMenu>
              </div>
              <div className="space-y-1.5">
                <RowLabel>3 кнопки + Overflow</RowLabel>
                <ButtonMenu>
                  <Button size="lg" variant="secondary-grey">
                    Печать
                  </Button>
                  <Button size="lg" variant="secondary-grey">
                    Скачать
                  </Button>
                  <Button size="lg" variant="secondary-grey">
                    Архивировать
                  </Button>
                  <ButtonMenuOverflow>
                    <ButtonMenuOverflowItem
                      text="Дублировать"
                      description="Создать копию элемента"
                    />
                    <ButtonMenuOverflowItem
                      text="Удалить"
                      description="Действие нельзя отменить"
                    />
                  </ButtonMenuOverflow>
                </ButtonMenu>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-p3-regular text-muted-foreground">
          Панель на всю ширину контейнера, кнопки прижаты слева (по мокапам
          использования в Figma) — прижимается к нижнему краю экрана/области
          контента. Primary-кнопка (если есть) всегда идёт первой/слева;
          кнопка «...» появляется только когда уже показаны три кнопки и
          открывает Menu, стилизованное как Select.Dropdown. Заменяется
          чёрной Selection Bar при выборе строк таблицы (см. Table).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ButtonMenuDemo }
