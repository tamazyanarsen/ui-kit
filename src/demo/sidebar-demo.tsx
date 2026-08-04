import { useState } from "react"
import {
  Mail,
  CalendarDays as CalendarCheck,
  FileText as FileOutput,
  Wallet as CreditCard,
  Sbp,
  Copy as Database,
  Coins,
  Alarm,
  Wallet,
  Pencil as FileSignature,
  CircleUser as Users,
  Menu as PanelLeft,
} from "@/icons"

import { Sidebar, SidebarItem, SidebarGroup } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function SidebarDemo() {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState("payments-sbp")

  return (
    <AccordionItem value="sidebar">
      <AccordionTrigger>Sidebar — боковая панель для сотрудников</AccordionTrigger>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          <RowLabel>
            Открыто/свёрнуто — клик по кнопке или по группе в свёрнутом
            состоянии
          </RowLabel>
          <div className="flex items-start gap-3">
            <Button
              variant="secondary-grey"
              size="sm"
              icon={PanelLeft}
              iconPosition="only"
              aria-label="Свернуть / развернуть"
              onClick={() => setOpen((v) => !v)}
            />
            <div className="h-[560px] overflow-hidden rounded-lg border border-[#DEDEDE]">
              <Sidebar open={open} onOpenChange={setOpen} defaultExpandedGroups={["sbp"]}>
                <SidebarItem
                  icon={Mail}
                  label="Письма"
                  active={active === "mail"}
                  onClick={() => setActive("mail")}
                />
                <SidebarItem
                  icon={CalendarCheck}
                  label="Задачник"
                  active={active === "tasks"}
                  onClick={() => setActive("tasks")}
                />
                <SidebarItem
                  icon={FileOutput}
                  label="Справки"
                  active={active === "certificates"}
                  onClick={() => setActive("certificates")}
                />
                <SidebarItem
                  icon={CreditCard}
                  label="Реестр платежей"
                  active={active === "payments-registry"}
                  onClick={() => setActive("payments-registry")}
                />
                <SidebarGroup value="sbp" icon={Sbp} label="СБП">
                  <SidebarItem
                    nested
                    label="Платежи СБП"
                    active={active === "payments-sbp"}
                    onClick={() => setActive("payments-sbp")}
                  />
                  <SidebarItem
                    nested
                    label="QR-коды СБП"
                    active={active === "qr-sbp"}
                    onClick={() => setActive("qr-sbp")}
                  />
                </SidebarGroup>
                <SidebarItem
                  icon={Coins}
                  label="Заявки на выборку"
                  active={active === "requests"}
                  onClick={() => setActive("requests")}
                />
                <SidebarItem
                  icon={Alarm}
                  label="FRAUD мониторинг: очень длинное название, которое не помещается"
                  active={active === "fraud"}
                  onClick={() => setActive("fraud")}
                />
                <SidebarGroup value="placements" icon={Wallet} label="Размещения средств">
                  <SidebarItem
                    nested
                    label="Реестр депозитов"
                    active={active === "deposits"}
                    onClick={() => setActive("deposits")}
                  />
                  <SidebarItem
                    nested
                    label="Реестр НСО"
                    active={active === "nso"}
                    onClick={() => setActive("nso")}
                  />
                  <SidebarItem
                    nested
                    label="Продуктовый каталог"
                    active={active === "catalog"}
                    onClick={() => setActive("catalog")}
                  />
                </SidebarGroup>
                <SidebarGroup value="orders" icon={FileSignature} label="Распоряжения">
                  <SidebarItem
                    nested
                    label="Распоряжения"
                    active={active === "orders-list"}
                    onClick={() => setActive("orders-list")}
                  />
                  <SidebarItem
                    nested
                    label="Договоры"
                    active={active === "contracts"}
                    onClick={() => setActive("contracts")}
                  />
                </SidebarGroup>
                <SidebarGroup value="registries" icon={Database} label="Реестры данных">
                  <SidebarItem
                    nested
                    label="Физические лица"
                    active={active === "individuals"}
                    onClick={() => setActive("individuals")}
                  />
                  <SidebarItem
                    nested
                    label="Юридические лица"
                    active={active === "legal-entities"}
                    onClick={() => setActive("legal-entities")}
                  />
                  <SidebarItem
                    nested
                    icon={Users}
                    label="Сотрудники"
                    active={active === "employees"}
                    onClick={() => setActive("employees")}
                  />
                </SidebarGroup>
              </Sidebar>
            </div>
          </div>
        </div>

        <p className="mt-6 text-p3-regular text-muted-foreground">
          Свёрнутая панель — 56px, только иконки; развёрнутая — 312px,
          иконка + текст. Hover — <code>#EFEFEF</code>, Active —{" "}
          <code>#F4F4F4</code> (оба значения — из текста спека). Наведение на
          иконку в свёрнутой панели или на строку с обрезающимся текстом
          показывает тултип с полным названием (см. пункт FRAUD-мониторинга
          выше). Клик по группе (СБП, Размещения средств, Распоряжения,
          Реестры данных) в свёрнутом состоянии не тыкается в невидимую
          панель — он одновременно разворачивает сайдбар и раскрывает саму
          группу, как описано в спеке.
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { SidebarDemo }
