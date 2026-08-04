import { useState } from "react"

import { Item } from "@/components/ui/item"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function ItemDemo() {
  const [toggleOn, setToggleOn] = useState(true)
  const [checked, setChecked] = useState(true)

  return (
    <AccordionItem value="item">
      <AccordionTrigger>Item</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <RowLabel>Value / Right — Navigation</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <Item
                value="Уведомления"
                rightElement="navigation"
                onClick={() => console.log("navigate")}
              />
              <Item
                value="Безопасность"
                comment="Двухфакторная аутентификация выключена"
                commentColor="red"
                rightElement="navigation"
                divider={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Text + Value + Comment, Sub Category (indent)</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <Item
                text="Категория"
                value="Продукты питания"
                comment="Обновлено сегодня"
                rightElement="navigation"
              />
              <Item
                text="Подкатегория"
                value="Молочные продукты"
                comment="12 операций"
                subCategory
                rightElement="navigation"
                divider={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Thumbnail + Comment (grey/red/yellow)</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <Item
                thumbnail
                value="Иванов Иван Иванович"
                comment="Оплата за услуги"
                rightElement="navigation"
              />
              <Item
                thumbnail
                value="Платёж отклонён"
                comment="Недостаточно средств на счёте"
                commentColor="red"
                rightElement="navigation"
              />
              <Item
                thumbnail
                value="Требуется подтверждение"
                comment="Проверьте реквизиты перевода"
                commentColor="yellow"
                rightElement="navigation"
                divider={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Right Element — все типы</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <Item value="Без правого элемента" comment="None" rightElement="none" />
              <Item value="Перейти в раздел" comment="Navigation" rightElement="navigation" />
              <Item
                value="Курс обмена"
                comment="Information"
                rightElement="information"
                informationText="Курс обновляется каждые 15 минут"
              />
              <Item value="Развернуть детали" comment="Accordion / Select" rightElement="accordion" />
              <Item value="Операция выполнена" comment="Check" rightElement="check" />
              <Item
                value="Изменение за месяц"
                comment="Text"
                rightElement="text"
                rightText="+1,5 %"
              />
              <Item
                value="Push-уведомления"
                comment="Toggle"
                rightElement="toggle"
                toggleChecked={toggleOn}
                onToggleChange={setToggleOn}
              />
              <Item
                value="Выбрать элемент"
                comment="Checkbox"
                rightElement="checkbox"
                checkboxChecked={checked}
                onCheckboxChange={setChecked}
                divider={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <RowLabel>Disabled</RowLabel>
            <div className="rounded-lg border border-[#DEDEDE]">
              <Item
                value="Недоступно"
                comment="Функция временно отключена"
                rightElement="navigation"
                disabled
                divider={false}
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Элемент всегда интерактивен — вся строка кликабельна. Information/
          Toggle/Checkbox имеют собственную изолированную область клика (не
          всплывают к строке), Navigation/Accordion/Check/Text — чисто
          декоративные, клик проходит через всю строку.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ItemDemo }
