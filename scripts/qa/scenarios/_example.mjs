// Образец сценария (файлы с «_» в начале не запускаются). Копируйте структуру в новый файл.
export default [
  {
    name: 'пример: ввод в поле',
    story: 'input--playground',
    run: async ({ page, expect, step }) => {
      step('набор')
      const input = page.locator('input').first()
      await input.fill('abc')
      expect.eq(await input.inputValue(), 'abc', 'значение поля')
    },
  },
]
