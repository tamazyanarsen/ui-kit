// Чип «Сумма» на экране аккредитивов.
//
// Сумму вводят так, как видят её в колонке: «1 200 000,00», «1 200 000»,
// «1200000». Раньше из ввода выбрасывалось всё, кроме цифр, и «1 200 000,00»
// превращалось в «120000000» — ни одна строка не совпадала. Ввод без цифр
// («абв») давал пустой образец: фильтр пропускал все строки, а чип при
// этом считался применённым.

/**
 * Образец для сравнения: цифры целой части и, если введены, цифры после
 * запятой (точки). `null` — во вводе нет ни одной цифры, фильтра нет.
 */
function amountQuery(input: string | null | undefined): string | null {
  if (!input) return null
  const [integer = "", fraction] = input.split(/[,.]/, 2)
  const whole = integer.replace(/\D/g, "")
  const cents = fraction?.replace(/\D/g, "") ?? ""
  if (!whole && !cents) return null
  return cents ? `${whole},${cents}` : whole
}

/** Ключ суммы строки в том же виде: «1200000,00». */
function amountKey(amount: number): string {
  const [whole, cents = "00"] = Math.abs(amount).toFixed(2).split(".")
  return `${whole},${cents}`
}

/** Совпадает ли сумма строки с введённым образцом (по началу, как и прежде). */
function matchesAmount(amount: number, query: string): boolean {
  return amountKey(amount).startsWith(query)
}

export { amountQuery, matchesAmount }
