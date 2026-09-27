import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { Loader } from "@/components/ui/loader"
import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/lib/use-is-desktop"

import { GosuslugiLogo } from "./gosuslugi-logo"

// ⚠️ У каждого типа рядом с `enabled:active:` стоит `enabled:data-popup-open:`
// с ТЕМ ЖЕ цветом.
//
// Дизайн-чек «Storybook 3», замечание 6: «при выборе действия со строкой
// состояние кнопки selection button должно быть Active по компоненту button».
// Пока список раскрыт, кнопка остаётся нажатой — иначе связь «этот список
// принадлежит этой кнопке» держится только положением всплывашки, а курсор к
// этому моменту уже ушёл с кнопки на список, и даже ховер с неё снят.
//
// Атрибут ставит Base UI на любой триггер всплывающего элемента, поэтому
// правило действует для всех кнопок-триггеров кита разом (Selection Button,
// «Скачать», меню шапки), а не только у таблицы. `active:` при этом остаётся:
// это разные события — «палец на кнопке» и «список раскрыт».
const buttonVariants = cva(
  // Насыщенность теперь живёт в суффиксе text-pN-medium у каждого
  // размерного варианта ниже (все Medium, как в макете), а не здесь:
  // отдельный класс font-medium тут лишь продублировал бы насыщенность,
  // уже зашитую в составной класс.
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:focus-ring active:not-aria-[haspopup]:translate-y-px disabled:cursor-not-allowed disabled:!bg-[var(--btn-muted-bg)] disabled:!text-[var(--btn-muted-fg)] disabled:!border-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] enabled:hover:bg-[var(--btn-primary-bg-hover)] enabled:active:bg-[var(--btn-primary-bg-active)] enabled:data-popup-open:bg-[var(--btn-primary-bg-active)]",
        "secondary-black":
          "bg-[var(--btn-secondary-black-bg)] text-[var(--btn-secondary-black-fg)] enabled:hover:bg-[var(--btn-secondary-black-bg-hover)] enabled:active:bg-[var(--btn-secondary-black-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-black-bg-active)]",
        "secondary-grey":
          "bg-[var(--btn-secondary-grey-bg)] text-[var(--btn-secondary-grey-fg)] enabled:hover:bg-[var(--btn-secondary-grey-bg-hover)] enabled:active:bg-[var(--btn-secondary-grey-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-grey-bg-active)]",
        "secondary-white":
          "bg-[var(--btn-secondary-white-bg)] text-[var(--btn-secondary-white-fg)] enabled:hover:bg-[var(--btn-secondary-white-bg-hover)] enabled:active:bg-[var(--btn-secondary-white-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-white-bg-active)]",
        "secondary-outline":
          "border-[var(--btn-secondary-outline-border)] bg-[var(--btn-secondary-outline-bg)] text-[var(--btn-secondary-outline-fg)] enabled:hover:bg-[var(--btn-secondary-outline-bg-hover)] enabled:active:bg-[var(--btn-secondary-outline-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-outline-bg-active)] disabled:!border-[var(--btn-muted-border)]",
        destructive:
          "bg-[var(--btn-destructive-bg)] text-[var(--btn-destructive-fg)] enabled:hover:bg-[var(--btn-destructive-bg-hover)] enabled:active:bg-[var(--btn-destructive-bg-active)] enabled:data-popup-open:bg-[var(--btn-destructive-bg-active)]",
        // Типы «Secondary Logo» всегда идут в паре с фиксированным глифом
        // Госуслуг (см. GosuslugiLogo ниже), а не со сменным значком.
        // Black, Border-White и White попиксельно совпадают со своими
        // обычными парами secondary-*, поэтому берут те же токены; новый
        // цвет вводит только Grey.
        "secondary-logo-black":
          "bg-[var(--btn-secondary-black-bg)] text-[var(--btn-secondary-black-fg)] enabled:hover:bg-[var(--btn-secondary-black-bg-hover)] enabled:active:bg-[var(--btn-secondary-black-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-black-bg-active)]",
        "secondary-logo-border-white":
          "border-[var(--btn-secondary-outline-border)] bg-[var(--btn-secondary-outline-bg)] text-[var(--btn-secondary-outline-fg)] enabled:hover:bg-[var(--btn-secondary-outline-bg-hover)] enabled:active:bg-[var(--btn-secondary-outline-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-outline-bg-active)]",
        "secondary-logo-white":
          "bg-[var(--btn-secondary-white-bg)] text-[var(--btn-secondary-white-fg)] enabled:hover:bg-[var(--btn-secondary-white-bg-hover)] enabled:active:bg-[var(--btn-secondary-white-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-white-bg-active)]",
        "secondary-logo-grey":
          "bg-[var(--btn-secondary-logo-grey-bg)] text-[var(--btn-secondary-logo-grey-fg)] enabled:hover:bg-[var(--btn-secondary-logo-grey-bg-hover)] enabled:active:bg-[var(--btn-secondary-logo-grey-bg-active)] enabled:data-popup-open:bg-[var(--btn-secondary-logo-grey-bg-active)]",
      },
      size: {
        // Сначала мобильный: классы без префикса — мобильная форма,
        // `desktop:` переключает на десктопную на брейкпоинте 768px.
        // Радиусы заданы литеральными px (а не rounded-xl/2xl), потому что
        // макет кнопки (16px, и 12px только у M-mobile) не ложится на общую
        // множительную шкалу --radius, по которой живут карточки, поля и
        // прочее.
        //
        // Исправление второго прохода: горизонтальные отступы были неверны
        // на всех размерах — систематический +1px против литеральных
        // значений мастера «ELK / button», а у мобильного `default`
        // расхождение было куда больше: стоявший там px-17 выглядел как
        // случайная копия значения `sm` вместо настоящих 24px. Макет вдобавок
        // задаёт отступы рядом со значком (has-icon) действительно разной
        // парой чисел по сторонам, а не только со стороны значка. Оказалось
        // также, что `default` и мобильный `lg` совпадают по отступам друг с
        // другом и с `sm` там, где совпадают и сами инстансы макета, поэтому
        // переопределение отступов под desktop: больше не нужно ни `sm`, ни
        // `default` — только `lg`.
        //
        // Третий проход: обе стороны обязаны двигаться вместе, и меньшее
        // значение принадлежит стороне *значка*. По анатомии у каждого
        // размера ряд Icon Left — это 16px до значка и 20px после текста
        // (24 и 32 у десктопного L высотой 56px), зеркально для Icon Right.
        // Раньше переопределялась только одна сторона, и у кнопки со значком
        // в конце сторона значка получала 20, а сторона текста оставалась
        // базовой — то есть асимметрия шла наоборот.
        sm: "h-8 gap-2 rounded-[16px] px-4 text-p3-medium desktop:text-p2-medium has-data-[icon=inline-start]:pl-4 has-data-[icon=inline-start]:pr-5 has-data-[icon=inline-end]:pl-5 has-data-[icon=inline-end]:pr-4",
        default:
          "h-10 gap-2 rounded-[12px] px-6 text-p2-medium has-data-[icon=inline-start]:pl-4 has-data-[icon=inline-start]:pr-5 has-data-[icon=inline-end]:pl-5 has-data-[icon=inline-end]:pr-4 desktop:h-12 desktop:rounded-[16px] desktop:text-p1-medium",
        lg: "h-12 gap-2 rounded-[16px] px-6 text-p2-medium has-data-[icon=inline-start]:pl-4 has-data-[icon=inline-start]:pr-5 has-data-[icon=inline-end]:pl-5 has-data-[icon=inline-end]:pr-4 desktop:h-14 desktop:px-8 desktop:text-p1-medium desktop:has-data-[icon=inline-start]:pl-6 desktop:has-data-[icon=inline-start]:pr-8 desktop:has-data-[icon=inline-end]:pl-8 desktop:has-data-[icon=inline-end]:pr-6 desktop:[&_svg:not([class*='size-'])]:size-6",
        icon: "size-10 rounded-[12px] desktop:size-12 desktop:rounded-[16px]",
        "icon-sm": "size-8 rounded-[16px]",
        "icon-lg":
          "size-12 rounded-[16px] desktop:size-14 desktop:[&_svg:not([class*='size-'])]:size-6",
      },
    },
    // ⚠️ Умолчание `default` — это размер **Medium**, и в продукте он почти
    // не применяется. Дизайн-чек от 08.09, замечание 3: «Корневое правило —
    // в продукте почти никогда не используются кнопки Medium, кроме разве
    // что модальных окон. Везде проверяй». Умолчание оставлено как в мастере
    // Figma (менять его — значит молча переразмерить и модалки), поэтому на
    // экранах и в виджетах размер задаётся ЯВНО, а ряды команд
    // (`ButtonMenuRow`, `ButtonMenuBlack`) проставляют его сами: панель — L,
    // ряд в карточке и чёрная панель — S.
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

// iconPosition="only" подменяет обычный размер его квадратной парой для
// кнопки-значка.
const ICON_ONLY_SIZE: Record<"sm" | "default" | "lg", "icon-sm" | "icon" | "icon-lg"> = {
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
}

type IconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { "data-icon"?: string; size?: 16 | 24 }
>

interface ButtonOwnProps {
  icon?: IconComponent
  iconPosition?: "left" | "right" | "only"
  isLoading?: boolean
}

type ButtonProps = Omit<ButtonPrimitive.Props, "children" | "ref"> &
  Omit<VariantProps<typeof buttonVariants>, "size"> & {
    size?: "sm" | "default" | "lg"
  } & ButtonOwnProps & {
    children?: React.ReactNode
  }

// Собственный <Button> из Base UI обёрнут в forwardRef (ему нужен узел DOM
// для своей работы с фокусом и нажатием), и эта обёртка обязана быть такой
// же — иначе ref, проброшенный через неё, просто не доедет до нижележащего
// элемента. Так бывает, например, у триггеров Base UI через
// `render={<Button />}`: см. TableRowMenu, ButtonMenuOverflow и кнопку
// закрытия по умолчанию в ModalContent. На React 19 это случайно работает и
// без forwardRef (там функциональные компоненты принимают `ref` обычным
// пропсом), поэтому недочёт и уехал незамеченным; в React 18 такого
// запасного пути нет, и всё падает сразу («Function components cannot be
// given refs»).
const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    icon: Icon,
    iconPosition,
    isLoading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
  // Варианты «Secondary Logo» всегда несут глиф Госуслуг как ведущий
  // значок: это фиксированный фирменный знак, а не сменный пропс `icon`.
  const isLogoVariant =
    typeof variant === "string" && variant.startsWith("secondary-logo")

  const resolvedIconPosition =
    iconPosition ?? (Icon || isLogoVariant ? "left" : undefined)
  // Дизайн-чек №10: раньше `isLoading` тоже попадал сюда, и кнопка на время
  // загрузки схлопывалась в квадратную icon-кнопку. Теперь загрузка не влияет
  // на геометрию — только на содержимое (см. ниже).
  const iconOnly = resolvedIconPosition === "only"

  if (import.meta.env.DEV && iconOnly && !isLoading && !props["aria-label"]) {
    console.warn(
      'Button: `aria-label` is required when `iconPosition="only"`.'
    )
  }

  const resolvedSize = iconOnly ? ICON_ONLY_SIZE[size ?? "default"] : size

  const Glyph = isLogoVariant ? GosuslugiLogo : Icon

  // `lg` и `icon-lg` от брейкпоинта desktop: и выше рисуют глиф в 24px
  // (см. размерные варианты выше), а в макете для большинства значков
  // нарисована отдельная 24-пиксельная графика, а не увеличенная
  // 16-пиксельная. Выбор рисунка делается здесь, чтобы вызывающему коду не
  // приходилось помнить про `size={24}` — он продолжает писать просто
  // `<Button size="lg" icon={Mail}>`. Это должен быть медиазапрос, а не
  // класс `desktop:`, потому что выбирается сам *контур*, а не коробка.
  const isDesktop = useIsDesktop()
  const glyphSize =
    isDesktop && (resolvedSize === "lg" || resolvedSize === "icon-lg") ? 24 : 16

  const content = iconOnly ? (
    Glyph && <Glyph size={glyphSize} aria-hidden="true" />
  ) : (
    <>
      {resolvedIconPosition === "left" && Glyph && (
        <Glyph size={glyphSize} data-icon="inline-start" aria-hidden="true" />
      )}
      {children}
      {resolvedIconPosition === "right" && Glyph && (
        <Glyph size={glyphSize} data-icon="inline-end" aria-hidden="true" />
      )}
    </>
  )

  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        buttonVariants({ variant, size: resolvedSize, className }),
        isLoading && "relative"
      )}
      {...props}
    >
      {isLoading ? (
        // Дизайн-чек №10: «кнопка в состоянии лоудинг не должна менять свою
        // ширину и должна сохранять размер, исходя из содержащегося внутри
        // текста и иконки при наличии». Поэтому обычное содержимое остаётся в
        // потоке и продолжает задавать ширину, просто становится невидимым, а
        // спиннер кладётся поверх по центру.
        //
        // Всё остальное в этом состоянии взято из макета один в один:
        // заливка grey-114 (--btn-muted-bg), высота и паддинги те же, что у
        // обычной кнопки, спиннер 24px на размере L.
        // Расходится только ширина: символы Loading в Figma уже обычных
        // (L/Desktop/Text — 118px в Default против 88px в Loading).
        // Это ограничение документации, а не правило:
        // дизайнер отдельно оговорил, что «на продукте при переходе кнопки в
        // состояние загрузки она не должна менять свой размер», и просил
        // прописать это в корне компонента.
        <>
          <span
            aria-hidden="true"
            className="invisible inline-flex items-center gap-2"
          >
            {content}
          </span>
          <Loader
            size={glyphSize === 24 ? "md" : "sm"}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </>
      ) : (
        content
      )}
    </ButtonPrimitive>
  )
})

export { Button, buttonVariants }
export type { ButtonProps }
