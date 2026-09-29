import * as React from "react"
import { Star } from "@/icons"

import { Button } from "@/components/ui/button"
import { MenuItemContent, menuItemRowClass } from "@/components/ui/menu-item"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from "@/components/ui/modal"
import {
  SortableDropIndicator,
  SortableHandle,
  SortableList,
  sortableRowClass,
  useSortable,
} from "@/components/ui/sortable"

import type { HeaderMenuGroup, HeaderMenuLink } from "./header-menu"
import {
  moveFavourite,
  resolveFavouriteLinks,
  resolveRemainingLinks,
  toggleFavourite,
} from "./favourites"

/**
 * FavouritesSettings — «Настройка избранного» (MENU DOCS): модалка,
 * которая открывается кнопкой «Настроить
 * избранное» под раскрытым меню навигации.
 *
 * Состав по макету: `ELK / Modal` размера Small (592px) с `Modal Top: None`
 * — заголовок H2 стоит первым элементом тела и уезжает вместе с прокруткой,
 * — а внутри компонент «Настройка быстрого доступа»:
 * секции с интервалом 32, у секции заголовок H3 и список строк
 * `Menu Point (ELK)` (звезда 24px + название P1 Medium + иконка
 * перетаскивания 24px).
 *
 * Две секции и их правила — из комментариев на той же странице:
 *   «Добавлено»          — избранное в пользовательском порядке,
 *                          перетаскивается, звезда заполненная;
 *   «Остальные разделы»  — «остаются во второй группе „Остальные разделы“ и
 *                          сортируются по алфавиту», звезда контурная,
 *                          перетаскивать нечего.
 *
 * Изменения применяются по «Сохранить» — в отличие от звезды в самом меню,
 * которая работает сразу (подсказка пустого избранного говорит «нажмите ☆
 * справа, чтобы добавить его сюда»). Поэтому здесь своё черновое состояние.
 */
interface FavouritesSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groups: HeaderMenuGroup[]
  favourites: string[]
  onSave: (favourites: string[]) => void
}

function SettingsRow({
  link,
  favourite,
  onToggle,
  sortable,
  rowProps,
  handleProps,
}: {
  link: HeaderMenuLink
  favourite: boolean
  onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void
  sortable?: boolean
  rowProps?: Record<string, unknown>
  handleProps?: Record<string, unknown>
}) {
  return (
    <div
      data-slot="favourites-settings-row"
      // Заливка взятой строки и линия вставки — общие правила кита
      // (`sortableRowClass`, дизайн-чек от 08.09 про целевой вид drag&drop).
      // Ховер гасится на время перетаскивания: под курсором и так стоит
      // линия, а вторая подсветка читалась бы как ещё одна цель.
      className={sortableRowClass(
        menuItemRowClass(
          "not-data-dragging:hover:bg-[var(--menu-item-bg-highlighted)]",
          "rounded-2xl"
        )
      )}
      {...rowProps}
    >
      <MenuItemContent
        leading={
          <button
            type="button"
            data-slot="favourites-settings-star"
            data-value={link.value}
            aria-pressed={favourite}
            aria-label={favourite ? "Убрать из избранного" : "Добавить в избранное"}
            onClick={onToggle}
            className="flex shrink-0 cursor-pointer text-[var(--header-menu-star-fg)] outline-none focus-visible:focus-ring"
          >
            <Star size={24} filled={favourite} aria-hidden="true" className="size-6 shrink-0" />
          </button>
        }
        trailing={
          sortable ? (
            <SortableHandle
              label={`Переместить «${
                typeof link.label === "string" ? link.label : link.value
              }»`}
              {...handleProps}
            />
          ) : undefined
        }
      >
        {link.label}
      </MenuItemContent>
    </div>
  )
}

function FavouritesSettings({
  open,
  onOpenChange,
  groups,
  favourites,
  onSave,
}: FavouritesSettingsProps) {
  const [draft, setDraft] = React.useState(favourites)
  const [wasOpen, setWasOpen] = React.useState(open)

  // Черновик пересобирается на каждое ОТКРЫТИЕ (переход false → true): пока
  // модалка закрыта, избранное могло измениться звёздами в самом меню. От
  // идентичности `favourites` синхронизация намеренно не зависит: массив,
  // вычисленный у потребителя (`favs ?? []`), новый на каждом рендере, и
  // любой рендер родителя при открытой модалке молча стирал бы перестановки.
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setDraft(favourites)
  }

  const added = resolveFavouriteLinks(groups, draft)
  const remaining = resolveRemainingLinks(groups, draft)

  // Индексы приходят из видимого списка `added`, а в `draft` могут лежать
  // значения, которых в меню уже нет (`resolveFavouriteLinks` их
  // отбрасывает). Поэтому позиции переводятся в значения и ищутся в самом
  // черновике — иначе переставлялась бы не та строка.
  function move(from: number, to: number) {
    const fromValue = added[from]?.value
    const toValue = added[to]?.value
    if (fromValue === undefined || toValue === undefined) return
    setDraft((prev) =>
      moveFavourite(prev, prev.indexOf(fromValue), prev.indexOf(toValue))
    )
  }

  const sortable = useSortable({
    items: added.map((link) => ({ id: link.value })),
    onReorder: move,
  })

  // Звезда переносит строку между «Добавлено» и «Остальными разделами» —
  // это разные списки, узел строки пересоздаётся, и кнопка в фокусе
  // исчезала вместе с ним: фокус падал на body внутри модалки. Если фокус
  // был на звезде, он возвращается на звезду той же строки на новом месте.
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const refocusStar = React.useRef<string | null>(null)
  function toggle(value: string, event: React.MouseEvent<HTMLButtonElement>) {
    refocusStar.current = document.activeElement === event.currentTarget ? value : null
    setDraft((prev) => toggleFavourite(prev, value))
  }
  React.useLayoutEffect(() => {
    const value = refocusStar.current
    if (value === null) return
    refocusStar.current = null
    const stars = bodyRef.current?.querySelectorAll<HTMLElement>(
      '[data-slot="favourites-settings-star"]'
    )
    Array.from(stars ?? [])
      .find((star) => star.dataset.value === value)
      ?.focus()
  }, [draft])

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="m">
        {/* `Modal Top` у этой модалки — вариант без заголовка (пустой холдер
            48px), поэтому ModalHeader не используется, а заголовок стоит
            первым в теле и прокручивается вместе с содержимым. Сам холдер
            рисует `ModalContent`: дизайн-чек от 13.09, замечание 15 — под
            белую полосу контент уходит, и как только хоть что-то ушло,
            появляется серый разделитель (верхняя грань `ModalBody`). Свой
            `desktop:pt-12` тут больше не нужен — полоса его и заменяет. */}
        <ModalBody ref={bodyRef} className="flex flex-col gap-8">
          <ModalTitle className="text-h2-mobile desktop:text-h2">
            Настройка избранного
          </ModalTitle>

          <section className="flex flex-col gap-4">
            <h3 className="text-h4-mobile text-[var(--modal-title-fg)] desktop:text-h3">
              Добавлено
            </h3>
            {added.length === 0 ? (
              // Вариант «Настройка избранного — пусто»:
              // текст ровно такой и по центру.
              <p className="px-4 py-2 text-center text-p2-medium text-[var(--header-meta-fg)]">
                Включайте разделы из списка ниже, чтобы добавить их в избранное
              </p>
            ) : (
              <SortableList className="flex flex-col" {...sortable.listProps}>
                {added.map((link) => (
                  <SettingsRow
                    key={link.value}
                    link={link}
                    favourite
                    onToggle={(event) => toggle(link.value, event)}
                    sortable
                    rowProps={sortable.itemProps(link.value)}
                    handleProps={sortable.handleProps(link.value)}
                  />
                ))}
                <SortableDropIndicator indicator={sortable.indicator} />
              </SortableList>
            )}
          </section>

          {remaining.length > 0 && (
            <section className="flex flex-col gap-4">
              <h3 className="text-h4-mobile text-[var(--modal-title-fg)] desktop:text-h3">
                Остальные разделы
              </h3>
              <div className="flex flex-col">
                {remaining.map((link) => (
                  <SettingsRow
                    key={link.value}
                    link={link}
                    favourite={false}
                    onToggle={(event) => toggle(link.value, event)}
                  />
                ))}
              </div>
            </section>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary-grey" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Повторы не сохраняются; значения, которых сейчас нет в меню,
              // остаются (меню могло не догрузиться или зависеть от прав).
              onSave([...new Set(draft)])
              onOpenChange(false)
            }}
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { FavouritesSettings }
export type { FavouritesSettingsProps }
