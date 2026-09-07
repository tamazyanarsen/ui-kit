import { useState } from "react"

import { Apps, Building, Info, Mail, Pencil, User, Users } from "@/icons"
import { Button } from "@/components/ui/button"
import { ButtonMenu } from "@/components/ui/button-menu"
import { SelectionButton } from "@/components/ui/selection-button"
import { Tag } from "@/components/ui/tag"
import { TitleRegistry } from "@/components/ui/title"
import { useToast } from "@/components/ui/toast-message"

import {
  SANDBOX_ORGANIZATIONS,
  SandboxBlock,
  SandboxCard,
  SandboxColumns,
  SandboxPage,
  SandboxSection,
  SandboxSectionTitle,
  SandboxSelect,
} from "../../shell"

import { SIGNATURE_RIGHTS, SIGNATURE_TYPES } from "./data"
import { SectionMenu } from "./section-menu"

// D10. «Профиль и настройки» — инстанс конструктора 70371:24923.
//
// ⚠️ Вкладок на экране НЕТ: нода вкладок в эталоне скрыта, разделы
// переключает боковое меню. Скрытые ноды видны только в метаданных, поэтому
// «вкладки» тут легко было бы собрать по ошибке — их нет намеренно.
//
// ⚠️ Боковая колонка стоит СЛЕВА: 584 + 24 + 1192, пролёты 4 и 8.
//
// ⚠️ Строка права — не компонент `Item`: справа стоит настоящий селект
// L/Desktop с лейблом «Допустимый тип подписи», а не шеврон 16. Часть прав
// задана договором и не меняется — у таких селект `readOnly`, и он рисует
// ЗАМОК вместо шеврона. Именно `readOnly`, а не `disabled`: выключенный
// селект гаснет целиком, а значение права читать всё равно нужно.

const GENERAL_SECTIONS = [
  { value: "personal", label: "Личные данные", icon: User },
  { value: "organizations", label: "Мои организации", icon: Building },
]

const ORG_SECTIONS = [
  { value: "about", label: "Об организации", icon: Info },
  { value: "signing", label: "Подписание документов", icon: Pencil },
  { value: "users", label: "Настройки пользователей", icon: Users },
  { value: "notifications", label: "Уведомления на почту", icon: Mail },
  { value: "services", label: "Подключаемые услуги", icon: Apps },
]

function ProfileScreen() {
  const toast = useToast()

  const [section, setSection] = useState("signing")
  const [organizationId, setOrganizationId] = useState(
    SANDBOX_ORGANIZATIONS[0]!.id
  )
  const [rights, setRights] = useState(() =>
    Object.fromEntries(SIGNATURE_RIGHTS.map((right) => [right.key, right.type]))
  )
  const [dirty, setDirty] = useState(false)

  return (
    <SandboxPage
      activeSection="profile"
      title={<TitleRegistry title="Профиль и настройки" helpLabel={null} />}
      bottomBar={
        <ButtonMenu>
          <Button
            variant="primary"
            disabled={!dirty}
            onClick={() => {
              setDirty(false)
              toast.add({
                type: "checked",
                title: "Права подписи сохранены",
                description: "Настройки действуют для всех пользователей",
              })
            }}
          >
            Подписать и сохранить
          </Button>
          <Button
            variant="secondary-grey"
            disabled={!dirty}
            onClick={() => {
              setRights(
                Object.fromEntries(
                  SIGNATURE_RIGHTS.map((right) => [right.key, right.type])
                )
              )
              setDirty(false)
            }}
          >
            Сбросить изменения
          </Button>
        </ButtonMenu>
      }
    >
      <SandboxColumns widths={[4, 8]}>
        <SandboxBlock padding={24}>
          <SandboxSection title="Общие разделы" gap={8}>
            <SectionMenu
              items={GENERAL_SECTIONS}
              value={section}
              onValueChange={setSection}
            />
          </SandboxSection>

          <SandboxSection title="Организация" gap={16}>
            <SandboxSelect
              size="sm"
              items={SANDBOX_ORGANIZATIONS.map((org) => ({
                value: org.id,
                label: org.name,
              }))}
              value={organizationId}
              onValueChange={(next) => next && setOrganizationId(next)}
            />
            <SectionMenu
              items={ORG_SECTIONS}
              value={section}
              onValueChange={setSection}
            />
          </SandboxSection>
        </SandboxBlock>

        <div className="flex flex-col gap-6">
          <SandboxBlock>
            <SandboxSection title="Тип подписи">
              <SandboxCard bordered>
                <h4 className="text-h4 text-[var(--grey-1514)]">
                  Единственная подпись
                </h4>
                <p className="text-p2-regular text-[var(--grey-284)]">
                  Тип вашей подписи определяется договором с банком. Вы можете
                  управлять типами подписи других пользователей вашей
                  организации — для этого перейдите на вкладку «Настройки
                  пользователей»
                </p>
              </SandboxCard>
            </SandboxSection>
          </SandboxBlock>

          <SandboxBlock>
            <SandboxSection title="Способ подписания">
              <SandboxCard bordered className="items-start">
                <Tag color="green">Активна</Tag>
                <h4 className="text-h4 text-[var(--grey-1514)]">
                  Простая электронная подпись (ПЭП)
                </h4>
                <p className="text-p2-regular text-[var(--grey-284)]">
                  Этим способом можно подписывать только операции до 1 млн.
                  Подписание происходит при помощи кода из СМС
                </p>
                {/* В макете кнопка подписана как `selection button`, но
                    текстовой формы в том сете нет вовсе — восемь квадратных
                    вариантов 32 × 32 / 56 × 56. Инстанс в макете
                    переопределён, поэтому здесь триггером выступает обычная
                    кнопка с подписью. */}
                <SelectionButton
                  trigger={
                    <Button variant="primary" size="sm">
                      Заменить подпись
                    </Button>
                  }
                  items={[
                    {
                      text: "На электронную подпись PayControl в приложении",
                      onSelect: () =>
                        toast.add({
                          type: "information",
                          title: "Заявка на смену подписи",
                          description: "PayControl в приложении",
                        }),
                    },
                    {
                      text: "На электронную подпись PayControl на токене",
                      onSelect: () =>
                        toast.add({
                          type: "information",
                          title: "Заявка на смену подписи",
                          description: "PayControl на токене",
                        }),
                    },
                  ]}
                />
              </SandboxCard>
            </SandboxSection>
          </SandboxBlock>

          <SandboxBlock>
            <div className="flex flex-col gap-2">
              <SandboxSectionTitle>Права подписи документов</SandboxSectionTitle>
              <p className="text-p2-regular text-[var(--grey-284)]">
                Допустимые типы подписей для подписания документов в личном
                кабинете. Данные настройки действуют для всех пользователей
                организации
              </p>
            </div>

            {/* Строка права: 352 + 24 + 752 при области 1128, шаг 80.
                Ширины выражением, а не числами — на 1440 доли те же. */}
            <div className="flex flex-col gap-6">
              {SIGNATURE_RIGHTS.map((right) => (
                <div
                  key={right.key}
                  className="grid items-center gap-6"
                  style={{ gridTemplateColumns: "352fr 752fr" }}
                >
                  <span className="text-p1-regular text-[var(--grey-1514)]">
                    {right.label}
                  </span>
                  <SandboxSelect
                    label="Допустимый тип подписи"
                    items={SIGNATURE_TYPES}
                    value={rights[right.key] ?? null}
                    readOnly={right.locked}
                    onValueChange={(next) => {
                      setRights((prev) => ({
                        ...prev,
                        [right.key]: next ?? "single",
                      }))
                      setDirty(true)
                    }}
                  />
                </div>
              ))}
            </div>
          </SandboxBlock>
        </div>
      </SandboxColumns>
    </SandboxPage>
  )
}

export { ProfileScreen }
