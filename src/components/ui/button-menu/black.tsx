import * as React from "react"

import { cn } from "@/lib/utils"
import { useComposedRefs } from "@/lib/compose-refs"
import { flattenChildren } from "@/lib/flatten-children"
import { useIsDesktop } from "@/lib/use-is-desktop"
import { useViewportInsetBottom } from "@/lib/use-viewport-inset-bottom"
import { Button } from "@/components/ui/button"

import { ButtonMenuOverflow } from "./overflow"
import { ButtonMenuRow } from "./row"
import { PINNED_CLASS, barShapeClass } from "./pinning"
import {
  BLACK_EMPTY_ACTIONS_TEXT,
  BlackClose,
  BlackEmptyActions,
  BlackInfoDesktop,
  BlackInfoMobile,
  type ButtonMenuBlackInfoItem,
} from "./black-parts"
import { BAR_PLACEMENT_CLASS, barPlacementStyle } from "./placement"
import { useBlackPresence } from "./black-motion"
import type { ButtonMenuBlackProps } from "./black-props"

// ButtonMenuBlack — «ELK / button menu (black)» (v1.0.0). Макет описывает
// это как самостоятельный компонент, а не как вариант белого ButtonMenu:
// пока у пользователя выделены строки таблицы, эта панель *подменяет*
// собой белую, а её закрытие возвращает белую обратно («Когда пользователь
// выделяет один или несколько элементов таблицы, Button Menu заменяется
// черной панелью»).
//
// Геометрия снята с символа Button=Three: фиксированная высота 72px,
// px-24/py-16, скругление 16px только у верхних углов (панель стоит
// вплотную к нижнему краю, как и ButtonMenu), действия прижаты влево с
// зазором 8px, а информационная полоса и крестик — вправо с зазором 32px.
//
// v1.1.0 (релиз 70.37) добавил Size=Mobile — дизайн-чек от 08.10, замечание
// 3 («Добавить мобильную версию Button Menu Black»). Это карточка 360 в
// столбик: поля 16, сверху информация таблицей и крестик, под ней одна
// растянутая кнопка L и «…» с остальными (с двух кнопок). Кнопки — обычные
// `ELK / button` L Mobile: «Текст кнопок перейдёт в состояние по умолчанию»,
// то есть их подпись берёт стиль самой кнопки, панель его не переопределяет.
// Над карточкой — та же кнопка «Выбрать на всех страницах» с зазором 16.

// Закрепление у нижней края — поведение по умолчанию, а не опция «на
// всякий случай»: в макете так и написано — «Панель всегда закреплена в
// нижней части экрана» (Button Menu) и «Button Menu всегда закрепляется в
// нижней части контентной области и занимает всю ширину» (Black).
//
// Именно `sticky`, а не `fixed`: панель остаётся в потоке и упирается в
// низ своего контейнера, поэтому не наезжает на контент — макет отдельно
// оговаривает «Панель не должна перекрывать кнопку „Показать ещё“».
// `fixed` вырвал бы её из потока и как раз перекрыл бы. Из этого же
// следует, что закрепление работает относительно прокручиваемого
// контейнера: панель прижимается к низу контентной области, а не окна.

interface BlackViewProps extends Omit<ButtonMenuBlackProps, "open"> {
  /** Класс движения внешнего узла (выезд/уход, см. `./black-motion`). */
  motionClass?: string
  /** Узел самой панели — для перемера занятого низа после выезда. */
  panelRef?: React.Ref<HTMLDivElement>
}

const ButtonMenuBlackView = React.forwardRef<HTMLDivElement, BlackViewProps>(function ButtonMenuBlackView({
  className,
  info,
  onClose,
  pinned = true,
  detached = false,
  placement = "full",
  span = 12,
  showSelectAllPages = true,
  selectAllPagesCount,
  selectedCount,
  onSelectAllPages,
  emptyActionsText = BLACK_EMPTY_ACTIONS_TEXT,
  maxVisible = 3,
  motionClass,
  panelRef,
  children,
  style,
  ...props
}, forwardedRef) {
  // Desktop рисует все действия таблеткой 32px (`sm` у Button). Вариант
  // форсится, а не подставляется по умолчанию — дизайн-чек №12: «для button
  // menu black используются только белые кнопки».
  // Дети раскрываются вместе с фрагментами: `{canSign && <><Button/>…</>}`
  // иначе проходил мимо принудительного размера и варианта, и «Подписать»
  // снова становилась голубой на чёрной панели (дефект дизайн-чека №12).
  // Пары собирают условиями: `null`/`false` среди них отбрасываются.
  //
  // Мобильная форма (v1.1.0) — кнопки L: 48 по высоте, радиус 16, «…» 48×48.
  // Ветка в JS, а не через `desktop:`: у форм разная РАЗМЕТКА (строка против
  // столбика, колонки информации против таблицы), а не только оформление.
  const isDesktop = useIsDesktop()
  const infoItems = (info ?? []).filter((item): item is ButtonMenuBlackInfoItem => !!item)
  const sizedChildren = flattenChildren(children).map((child) => {
    if (React.isValidElement(child) && child.type === Button) {
      const element = child as React.ReactElement<{
        size?: string
        variant?: string
      }>
      return React.cloneElement(element, {
        size: isDesktop ? "sm" : "lg",
        variant: "secondary-white",
      })
    }
    // Меню «ещё» — такая же кнопка панели, значит тоже белая и того же
    // размера, что кнопки рядом: 32px на десктопе, 48 на мобильном. Без
    // размера «…» брал умолчание тёмного тона (`sm`) и на мобильном стоял
    // 32px рядом с кнопками L (ревью 10.10, п. 9).
    if (React.isValidElement(child) && child.type === ButtonMenuOverflow) {
      return React.cloneElement(
        child as React.ReactElement<{ tone?: "light" | "dark"; size?: "sm" | "lg" }>,
        { tone: "dark", size: isDesktop ? "sm" : "lg" }
      )
    }
    return child
  })

  const onlyButtons = sizedChildren.every(
    (child) =>
      React.isValidElement(child) &&
      (child.type === Button || child.type === ButtonMenuOverflow)
  )

  // Пока панель закреплена, она публикует занятую высоту в
  // `--viewport-inset-bottom`: горизонтальная полоса прокрутки таблицы липнет
  // к низу СВОБОДНОЙ части вьюпорта, а не к кромке экрана, — иначе она
  // уходила бы под панель ровно тогда, когда таблицей активно пользуются.
  // ⚠️ Занятый низ вьюпорта — это СПЛОШНАЯ ПОЛОСА, а не габарит блока.
  // Между кнопкой и панелью прозрачный зазор 32, и липкая полоса прокрутки
  // таблицы (8px) помещается в нём целиком. Меряя блок целиком, мы отрывали
  // полосу прокрутки от панели на 64 и подвешивали её в пустоте — поэтому
  // ref висит на ПАНЕЛИ, а не на внешнем узле. Сам узел панели стабилен (см.
  // возврат ниже), но хук всё равно отдаёт callback-ref и перемеряет любой
  // новый узел — например, после перемонтирования панели снаружи.
  const ownRef = useComposedRefs<HTMLDivElement>(forwardedRef, panelRef)
  const ref = useViewportInsetBottom(pinned && !detached, ownRef)

  // Кнопка пропадает, когда выбрано всё, и возвращается, как только снята
  // хотя бы одна галка.
  const allSelected =
    selectAllPagesCount !== undefined &&
    selectedCount !== undefined &&
    selectedCount >= selectAllPagesCount
  const withSelectAll = showSelectAllPages && !!onSelectAllPages && !allSelected

  // Размещение на сетке вешается на САМЫЙ ВНЕШНИЙ узел — на панель, когда она
  // возвращается одна, и на блок «кнопка + панель», когда он есть. Иначе
  // кнопка «Выбрать на всех страницах» центрировалась бы по всей полосе, а
  // панель под ней стояла бы в своих шести колонках.
  const outerPlacementClass = BAR_PLACEMENT_CLASS[placement]
  // Плавающим слоям (NPS, «Наверх») занятый низ — весь блок «кнопка +
  // панель», иначе они ложились на кнопку «Выбрать на всех страницах»
  // (аудит 21, на 320–700). Это отдельная переменная: полоса прокрутки
  // таблицы по-прежнему липнет к самой панели (см. ref выше).
  const blockRef = useViewportInsetBottom<HTMLDivElement>(
    pinned && !detached && withSelectAll,
    undefined,
    "--floating-inset-bottom"
  )
  const outerPlacementStyle = barPlacementStyle(placement, span)

  const hasActions = sizedChildren.length > 0
  const pinnedHere = pinned && !detached

  // Действия. Desktop — тот же ряд, что у белой панели: не поместившиеся
  // уходят в «…». Ряд берёт оставшееся место (`flex-1 min-w-0`), правая
  // группа — нет.
  // ⚠️ Ряд собирает сначала кнопки, потом прочих детей, потом «…» — то есть
  // переставляет их. Поэтому он берётся, только когда в действиях одни
  // кнопки (и переданное «…»): кнопка в своей обёртке (`<PermissionGate>`)
  // иначе уезжала бы в конец. Со «своими» детьми действия стоят как есть.
  // ⚠️ На узкой панели (375, сетка на 6 колонок) ряд сжимался до нуля, а
  // нулевую ширину хук ряда считает «ещё не померили» и показывает ВСЕ
  // кнопки. Поэтому у ряда есть минимум под «…» (32) и `minVisible={0}`.
  //
  // Mobile — одна растянутая кнопка и «…» со всеми остальными, даже если
  // место есть (`maxVisible={1}`), — символы Size=Mobile, Number Of
  // Buttons=2…4 одинаковые.
  let actions: React.ReactNode
  if (!hasActions) {
    actions = <BlackEmptyActions mobile={!isDesktop}>{emptyActionsText}</BlackEmptyActions>
  } else if (onlyButtons && isDesktop) {
    actions = (
      // Не больше `maxVisible` команд разом (по умолчанию 3) — Правки UI-Kit
      // от 25.10, «не больше трёх команд, остальные в „…“»: при широкой ленте
      // ряд раскладывал четыре и больше. Места меньше — видно меньше.
      <ButtonMenuRow
        size="sm"
        tone="dark"
        minVisible={0}
        maxVisible={maxVisible}
        data-slot="button-menu-black-actions"
        className="min-w-8 items-start"
      >
        {sizedChildren}
      </ButtonMenuRow>
    )
  } else if (onlyButtons) {
    actions = (
      <ButtonMenuRow
        size="lg"
        tone="dark"
        stretchFirst
        maxVisible={1}
        data-slot="button-menu-black-actions"
        className="w-full flex-none"
      >
        {sizedChildren}
      </ButtonMenuRow>
    )
  } else {
    actions = (
      <div
        data-slot="button-menu-black-actions"
        className={cn(
          "flex min-w-0 overflow-hidden",
          isDesktop ? "flex-1 items-start gap-2" : "w-full items-center gap-4"
        )}
      >
        {sizedChildren}
      </div>
    )
  }

  const panel = (
    <div
      ref={ref}
      data-slot="button-menu-black"
      data-pinned={pinnedHere || undefined}
      data-detached={detached || undefined}
      data-placement={placement}
      data-size={isDesktop ? "desktop" : "mobile"}
      className={cn(
        // Desktop: `@container/black` — от ширины панели (а не окна) зависит,
        // есть ли место под информацию. Зазор 32 между действиями и правой
        // группой — её `ml-8`: свой зазор контейнер по запросу менять не может.
        // Mobile (Panel 360): столбик, поля и зазоры 16.
        isDesktop
          ? "@container/black flex max-h-[72px] min-h-[72px] items-center justify-between px-6 py-4"
          : "flex flex-col gap-4 p-4",
        "bg-[var(--button-menu-black-bg)]",
        withSelectAll ? "w-full" : outerPlacementClass,
        barShapeClass({ detached }),
        // Приём указателя возвращается панели: внешний узел его не
        // принимает (см. ниже).
        withSelectAll && "pointer-events-auto",
        pinnedHere && !withSelectAll && PINNED_CLASS,
        !withSelectAll && motionClass,
        className
      )}
      style={
        withSelectAll ? style : { ...outerPlacementStyle, ...style }
      }
      {...props}
    >
      {isDesktop ? (
        <>
          {actions}
          {/* Правая группа сжимается ПОСЛЕ действий. Крестик виден всегда;
              совсем узкой панели зазор ужимается до 16, чтобы «…» и крестик
              помещались даже на 6 колонках при 375. */}
          <div className="ml-8 flex min-w-0 items-center justify-end gap-8 @max-[180px]/black:ml-4">
            {infoItems.length > 0 && <BlackInfoDesktop items={infoItems} />}
            {onClose && <BlackClose onClose={onClose} />}
          </div>
        </>
      ) : (
        <>
          {/* «Information (ELK)» Mobile: информация слева, крестик справа
              сверху с зазором 16. Без информации крестик остаётся на своём
              месте — в правом верхнем углу. */}
          {(infoItems.length > 0 || onClose) && (
            <div
              className={cn(
                "flex w-full gap-4",
                infoItems.length === 1 ? "items-center" : "items-start",
                infoItems.length === 0 && "justify-end"
              )}
            >
              {infoItems.length > 0 && <BlackInfoMobile items={infoItems} />}
              {onClose && <BlackClose onClose={onClose} />}
            </div>
          )}
          {actions}
        </>
      )}
    </div>
  )

  // ⚠️ Форма больше НЕ фиксируется десктопной. Дизайн-чек от 13.09, №2
  // («у панели не должно быть мобайл-версии») отменён мастером v1.1.0 и
  // дизайн-чеком от 08.10, №3: Size=Mobile теперь есть.
  //
  // ⚠️ Панель стоит на ОДНОМ месте дерева при любом `withSelectAll`: блок
  // «кнопка + панель» есть всегда, а без кнопки он `display: contents` и в
  // раскладке не участвует. Иначе React на каждом переключении (выбрали всё —
  // кнопка пропала, сняли одну — вернулась) пересоздавал панель вместе с
  // кнопками действий: фокус падал на <body>, открытое «…» закрывалось.
  return (
    // ⚠️ Прозрачный зазор ловил указатель: курсор до липкой полосы
    // прокрутки таблицы, которая живёт в зазоре, не доезжал. Поэтому ВНЕШНИЙ
    // узел указатель не принимает, а панель и обёртка кнопки (`w-fit`)
    // возвращают себе приём. Место в потоке при этом держится за ВЕСЬ блок,
    // а занятый низ вьюпорта публикует панель (см. ref выше).
    <div
      ref={blockRef}
      data-slot={withSelectAll ? "button-menu-black-block" : undefined}
      data-placement={withSelectAll ? placement : undefined}
      className={cn(
        withSelectAll
          ? [
              // Зазор до кнопки: 32 на Desktop, 16 на Mobile (мастер).
              "pointer-events-none flex flex-col items-center",
              isDesktop ? "gap-8" : "gap-4",
              outerPlacementClass,
              pinnedHere && PINNED_CLASS,
              motionClass,
            ]
          : "contents"
      )}
      style={withSelectAll ? outerPlacementStyle : undefined}
    >
      {withSelectAll && (
        <div className="pointer-events-auto w-fit">
          {/* Инстанс кнопки кита (`ELK / button`): `secondary-black` — это
              Dark blue 1412, `sm` даёт 32 по высоте, радиус 16 и кегль
              формы (P2 Medium на Desktop, 12/16 на Mobile, как в мастере). */}
          <Button
            variant="secondary-black"
            size="sm"
            data-slot="button-menu-black-select-all"
            onClick={onSelectAllPages}
          >
            Выбрать на всех страницах
            {selectAllPagesCount !== undefined && ` (${selectAllPagesCount})`}
          </Button>
        </div>
      )}
      {panel}
    </div>
  )
})

/**
 * Обёртка с появлением и уходом (`./black-motion`): держит панель в разметке
 * на время ухода с последним показанным составом. Узел внешнего блока и
 * панели при этом не пересоздаётся — пропсы подменяются, а не компонент.
 */
const ButtonMenuBlack = React.forwardRef<HTMLDivElement, ButtonMenuBlackProps>(function ButtonMenuBlack(
  { open, ...props },
  ref
) {
  const panelNode = React.useRef<HTMLDivElement | null>(null)
  const presence = useBlackPresence(open, props, () => {
    // Выезд доиграл — занятый низ вьюпорта перемеряется: на первом кадре
    // панель была сдвинута вниз на свою высоту и «не перекрывала» ничего.
    // Хук публикации слушает `scroll` в фазе захвата на window, поэтому
    // событие на самой панели доходит до него, никого больше не задевая.
    panelNode.current?.dispatchEvent(new Event("scroll"))
  })
  if (!presence.present) return null
  return (
    <ButtonMenuBlackView
      {...presence.props}
      ref={ref}
      panelRef={panelNode}
      motionClass={presence.motionClass}
    />
  )
})

export { ButtonMenuBlack }
export type { ButtonMenuBlackProps } from "./black-props"
export type { ButtonMenuBlackInfoItem }
