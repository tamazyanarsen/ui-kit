// Чип «Сумма» на экране аккредитивов.
//
// Сумму вводят так, как видят её в колонке: «1 200 000,00», «1 200 000»,
// «1200000». Раньше из ввода выбрасывалось всё, кроме цифр, и «1 200 000,00»
// превращалось в «120000000» — ни одна строка не совпадала. Ввод без цифр
// («абв») давал пустой образец: фильтр пропускал все строки, а чип при
// этом считался применённым.
//
// ⚠️ Целая часть сравнивается ТОЧНО, как только ввод похож на полную сумму:
// есть разделитель разрядов («2 000 000»), запятая/точка или четыре цифры и
// больше. Сравнение по началу строки цифр находило «2 000 000» в
// 20 000 000, а «300 000» — в 300 000 000: сумма, набранная ровно как в
// колонке, отбирала суммы на порядок больше. По началу ищется только
// короткий набор без разделителей («12», «300») — пока пользователь ещё
// печатает.

/**
 * Образец для сравнения. `"1200000"` — поиск по началу целой части;
 * `"1200000,"` и `"1200000,5"` — целая часть точно, копейки по началу.
 * `null` — во вводе нет ни одной цифры, фильтра нет.
 */
function amountQuery(input: string | null | undefined): string | null {
  if (!input) return null
  const [integer = "", fraction] = input.split(/[,.]/, 2)
  const whole = integer.replace(/\D/g, "")
  const cents = fraction?.replace(/\D/g, "") ?? ""
  if (!whole && !cents) return null
  const exact =
    fraction !== undefined || whole.length >= 4 || /\d\s+\d/.test(integer)
  return exact ? `${whole},${cents}` : whole
}

/** Целая часть и копейки суммы строки: «1200000», «00». */
function amountParts(amount: number): [string, string] {
  const [whole, cents = "00"] = Math.abs(amount).toFixed(2).split(".")
  return [whole, cents]
}

/** Совпадает ли сумма строки с введённым образцом, см. {@link amountQuery}. */
function matchesAmount(amount: number, query: string): boolean {
  const [whole, cents] = amountParts(amount)
  const comma = query.indexOf(",")
  if (comma < 0) return whole.startsWith(query)
  const queryWhole = query.slice(0, comma)
  const queryCents = query.slice(comma + 1)
  return (queryWhole === "" || whole === queryWhole) && cents.startsWith(queryCents)
}

export { amountQuery, matchesAmount }
