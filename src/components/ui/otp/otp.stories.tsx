import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"

import {
  StatesMatrix,
  StorySection,
  StoryShowcase,
  sizeArgType,
} from "@/stories/matrix"
import { ViewportScope, type Viewport } from "@/lib/viewport"

import { OtpConfirmCard } from "./confirm-card"
import { OtpInput } from "./input"
import { ResendCode } from "./resend-code"

type OtpConfirmCardProps = ComponentProps<typeof OtpConfirmCard>
type OtpInputProps = ComponentProps<typeof OtpInput>
type ResendCodeProps = ComponentProps<typeof ResendCode>

type PlaygroundArgs = OtpConfirmCardProps & { viewport?: Viewport }

// Дизайн-чек №4 №1: в Figma это один компонент `ELK / otp-code`, а
// `Input Code` и «отправить повторно» — его элементы (секция Elements на
// том же канвасе). Поэтому в Storybook тоже один раздел «OTP code»:
// Playground/Варианты использования показывают сам компонент, а элементы
// вынесены отдельными матрицами внутри этого же раздела.
const meta = {
  title: "Компоненты/OTP code",
  component: OtpConfirmCard,
  parameters: { layout: "centered" },
  // Карточка — это диалог (в макете она собрана из ELK / Modal), поэтому
  // Playground открывает её сразу, а не ждёт клика по триггеру.
  /* Панель повторяет свойства компонент-сета `ELK / otp-code`: у него
     единственная ось `Size` (Desktop / Mobile), а
     состояния поля — у вложенного `Input Code (Desktop/Mobile)`:
     Default / Focused / Filled / Error / Send Password. В
     коде это внутреннее поведение формы, поэтому контролов у них нет.

     Порядок ключей здесь задаёт порядок строк в панели Storybook. */
  args: {
    viewport: "desktop" as Viewport,
    defaultOpen: true,
    length: 6,
    resendSeconds: 60,
    title: "Подтвердите контактные данные",
    phone: "+7 900 000-00-00",
  },
  // title, subtitle и error объявлены как React.ReactNode, но везде
  // используются обычными строками: закрепляем текстовые контролы, чтобы
  // незаданное значение не откатывалось на заглушку JSON-редактора
  // «Set object» в Storybook.
  argTypes: {
    // Дизайн-чек №3 №19: форма Desktop/Mobile выбирается контролом в панели
    // истории, а не изменением ширины вьюпорта.
    viewport: sizeArgType,
    defaultOpen: { control: "boolean" },
    length: { control: { type: "number", min: 4, max: 8 } },
    resendSeconds: { control: "number" },
    title: { control: "text", table: { category: "Контент" } },
    subtitle: { control: "text", table: { category: "Контент" } },
    error: { control: "text", table: { category: "Контент" } },
    phone: { control: "text", table: { category: "Контент" } },
    defaultValue: { control: "text", table: { category: "Контент" } },
    // `trigger` принимает экземпляр JSX-элемента, а собрать такой из
    // значения JSON невозможно, поэтому понятный выбор отображается в
    // настоящий элемент (тот же приём, что и с `icon` у Button). «None»
    // оставляет карточку открытой через `defaultOpen`.
    trigger: {
      control: { type: "select", labels: { none: "None (открыта сразу)", button: "Кнопка" } },
      options: ["none", "button"],
      mapping: {
        none: undefined,
        button: <button type="button">Подтвердить контакты</button>,
      },
    },
  },
  // Дизайн-чек №3 №19: контрол `viewport` из панели истории форсирует
  // десктопную/мобильную форму, не трогая размер вьюпорта. Обёртка общая
  // для всех историй файла — в матрицах она не мешает: там форму задаёт
  // сама матрица (`responsive`), а этот скоуп остаётся в «auto».
  decorators: [
    (Story, context) => (
      <ViewportScope viewport={(context.args as { viewport?: Viewport }).viewport}>
        <Story />
      </ViewportScope>
    ),
  ],
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {}

/* Карточка — настоящее модальное окно (портал, подложка, ловушка фокуса),
   поэтому открытым может быть только одно за раз: варианты показаны
   отдельными триггерами, а не ячейками матрицы. */
export const Examples: Story = {
  name: "Варианты использования",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StoryShowcase>
      <StorySection
        title="С триггером"
        description="Обычный сценарий: карточка открывается по действию пользователя."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          trigger={<button type="button">Подтвердить контакты</button>}
        />
      </StorySection>
      <StorySection
        title="С ошибкой"
        description="Код введён неверно — под полем появляется текст ошибки."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          defaultValue="1234"
          error="Неверный код, попробуйте снова"
          trigger={<button type="button">Открыть с ошибкой</button>}
        />
      </StorySection>
      <StorySection
        title="Код из 4 знаков"
        description="Длина кода задаётся пропом `length`."
      >
        <OtpConfirmCard
          phone="+7 900 000-00-00"
          length={4}
          trigger={<button type="button">Открыть</button>}
        />
      </StorySection>
    </StoryShowcase>
  ),
}

/* Элемент Input Code — Figma рисует его отдельной таблицей состояний
   (Input Code Desktop/Mobile). */
export const InputCodeMatrix: Story = {
  name: "Элемент «Input Code»",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<OtpInputProps>
      responsive
      stretch
      cellClassName="min-w-[280px]"
      columns={[
        { label: "6 знаков", props: { length: 6 } },
        { label: "4 знака", props: { length: 4 } },
      ]}
      rows={[
        { label: "Пустой", props: {} },
        { label: "Focus", props: {}, pseudo: "focus-within" },
        { label: "Заполнен", props: { defaultValue: "123456" } },
        {
          label: "Error",
          props: { defaultValue: "1234", error: "Неверный код" },
        },
        { label: "Disabled", props: { defaultValue: "1234", disabled: true } },
      ]}
      // Подпись ошибки в мастере стоит абсолютно и высоты поля не меняет, так что
      // ряду матрицы под неё нужен свой запас — иначе она ложится на линию ряда.
      render={(props) => (
        <div className={props.error ? "pb-6" : undefined}>
          <OtpInput {...props} />
        </div>
      )}
    />
  ),
}

/* Элемент «отправить повторно» — счётчик и активная ссылка после нуля. */
export const ResendCodeMatrix: Story = {
  name: "Элемент «Resend Code»",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <StatesMatrix<ResendCodeProps>
      responsive
      columns={[{ label: "Resend Code" }]}
      rows={[
        { label: "Отсчёт (60 с)", props: { seconds: 60 } },
        { label: "Отсчёт (5 с)", props: { seconds: 5 } },
        // На нуле счётчик превращается в активную ссылку «отправить ещё раз».
        { label: "Готово (0 с)", props: { seconds: 0 } },
        { label: "Готово · Hover", props: { seconds: 0 }, pseudo: "hover" },
      ]}
      render={(props) => <ResendCode {...props} />}
    />
  ),
}
