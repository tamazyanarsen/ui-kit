// Статьи сводно-сметного расчёта — данные экрана «Перераспределение ССР»
// (секция 70371:36100, кадр «Начальное состояние» 70371:36101).
//
// Дерево трёхуровневое и с нумерацией «1.», «2.1.», «2.2.1.1.» — номер живёт в
// самой строке, а не выводится из вложенности: в эталоне у главы 3 пункты
// пронумерованы «3.1» без точки на конце, а у остальных с точкой, и подгонять
// это правилом дороже, чем хранить как есть.
//
// Суммы: у РОДИТЕЛЬСКИХ строк они складываются из детей и не редактируются
// (в эталоне такие поля залиты серым), у листьев — вводятся. Поэтому в данных
// хранятся только листья, а суммы глав считаются на лету — иначе первая же
// правка суммы разошлась бы с итогом главы.

interface CostItem {
  id: string
  /** Номер статьи ровно как в эталоне. */
  number: string
  title: string
  children?: CostItem[]
  /** Заёмные средства, ₽. Только у листьев. */
  borrowed?: number
  /** Собственные средства, ₽. Только у листьев. */
  own?: number
}

const COST_ITEMS: CostItem[] = [
  {
    id: "1",
    number: "1.",
    title: "Глава 1. Стоимость земельного участка и расходы по его содержанию",
    children: [
      {
        id: "1.1",
        number: "1.1.",
        title: "Затраты на приобретение прав на ЗУ",
        borrowed: 90_000_000,
        own: 10_000_000,
      },
      {
        id: "1.2",
        number: "1.2.",
        title:
          "Договор освоения территории в целях строительства стандартного жилья и связанные с его исполнением",
        borrowed: 120_000_000,
        own: 20_000_000,
      },
      {
        id: "1.3",
        number: "1.3.",
        title: "Договор о развитии застроенной территории",
        borrowed: 25_000_000,
        own: 5_000_000,
      },
      {
        id: "1.4",
        number: "1.4.",
        title:
          "Договор о комплексном развитии территории по инициативе правообладателей (по инициативе органов местного самоуправления)",
        borrowed: 35_000_000,
        own: 5_000_000,
      },
    ],
  },
  {
    id: "2",
    number: "2.",
    title: "Глава 2. Стоимость строительства",
    children: [
      {
        id: "2.1",
        number: "2.1.",
        title: "Подготовительный период",
        children: [
          {
            id: "2.1.1",
            number: "2.1.1.",
            title: "Подготовка территории строительства",
            borrowed: 90_000_000,
            own: 10_000_000,
          },
          {
            id: "2.1.2",
            number: "2.1.2.",
            title: "Освобождение территории строительства (в т.ч. снос)",
            borrowed: 80_000_000,
            own: 10_000_000,
          },
        ],
      },
      {
        id: "2.2",
        number: "2.2.",
        title: "Основные объекты строительства",
        children: [
          {
            id: "2.2.1",
            number: "2.2.1.",
            title: "Подземная часть (общестроительные работы)",
            children: [
              {
                id: "2.2.1.1",
                number: "2.2.1.1.",
                title: "Земляные работы",
                borrowed: 30_000_000,
                own: 5_000_000,
              },
              {
                id: "2.2.1.2",
                number: "2.2.1.2.",
                title: "Свайное основание",
                borrowed: 40_000_000,
                own: 10_000_000,
              },
              {
                id: "2.2.1.3",
                number: "2.2.1.3.",
                title: "Фундамент",
                borrowed: 55_000_000,
                own: 15_000_000,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    number: "3.",
    title: "Глава 3. Коммерческие расходы",
    children: [
      {
        id: "3.1",
        number: "3.1",
        title: "Реклама",
        borrowed: 10_000_000,
        own: 5_000_000,
      },
      {
        id: "3.2",
        number: "3.2",
        title: "Риэлтерские",
        borrowed: 20_000_000,
        own: 10_000_000,
      },
      {
        id: "3.3",
        number: "3.3",
        title: "Прочие",
        borrowed: 30_000_000,
        own: 10_000_000,
      },
      {
        id: "3.4",
        number: "3.4",
        title: "Регистрация ДДУ",
        borrowed: 15_000_000,
        own: 5_000_000,
      },
    ],
  },
]

/** Суммы всех листьев ветки. Родительские строки показывают именно их. */
function totals(item: CostItem): { borrowed: number; own: number } {
  if (!item.children?.length) {
    return { borrowed: item.borrowed ?? 0, own: item.own ?? 0 }
  }
  return item.children.reduce(
    (sum, child) => {
      const inner = totals(child)
      return { borrowed: sum.borrowed + inner.borrowed, own: sum.own + inner.own }
    },
    { borrowed: 0, own: 0 }
  )
}

/** Итог по всему расчёту — он же стоит в шапке столбцов. */
function grandTotals(items: CostItem[]) {
  return items.reduce(
    (sum, item) => {
      const inner = totals(item)
      return { borrowed: sum.borrowed + inner.borrowed, own: sum.own + inner.own }
    },
    { borrowed: 0, own: 0 }
  )
}

/** Плоский список идентификаторов листьев — по ним идёт правка сумм. */
function leafIds(items: CostItem[]): string[] {
  return items.flatMap((item) =>
    item.children?.length ? leafIds(item.children) : [item.id]
  )
}

export { COST_ITEMS, grandTotals, leafIds, totals }
export type { CostItem }
