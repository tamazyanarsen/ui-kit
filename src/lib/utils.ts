import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Без этого twMerge не распознаёт собственные типографские классы кита
// text-h1..h4 и text-p1..p4 (ключи @theme text-* из src/styles/theme.css)
// как утилиты размера шрифта: он откатывается и складывает их в корзину
// «text-color». Из-за этого сочетание такого класса с настоящим классом
// цвета (например, `cn("text-p1 font-medium", "text-[var(--x-fg)]")`) молча
// теряет класс размера во время выполнения вместо аккуратного слияния.
// Регистрация здесь чинит это сразу для всех потребителей.
// Составные утилиты text-pN-{regular,medium,heavy} (по одной на каждый
// именованный параграфный стиль макета) попадают в ту же группу, чтобы
// по-прежнему вытеснять голый text-h*/text-p* или более ранний составной
// класс, переданный через переопределения в cn().
// Параметр-generic объявляет ИМЕНА новых групп: без него tailwind-merge
// принимает в `extend.classGroups` только свои штатные идентификаторы.
const twMerge = extendTailwindMerge<"focus-ring">({
  extend: {
    classGroups: {
      "font-size": [
        "text-factoid", "text-factoid-mobile",
        "text-h1", "text-h2", "text-h3", "text-h4",
        "text-h1-mobile", "text-h2-mobile", "text-h3-mobile", "text-h4-mobile",
        "text-p1", "text-p2", "text-p3", "text-p4",
        "text-p1-regular", "text-p1-medium", "text-p1-heavy",
        "text-p2-regular", "text-p2-medium", "text-p2-heavy",
        "text-p3-regular", "text-p3-medium",
        "text-p4-regular", "text-p4-medium",
      ],
      // То же рассуждение и для единственного собственного ключа тени в
      // @theme («Universal shadow» в макете): незарегистрированным twMerge
      // читает это слово как *цвет* тени, а не как саму тень, и класс не
      // вытеснял бы настоящий класс тени, переданный через cn(), и не
      // вытеснялся бы им.
      shadow: ["shadow-universal", "shadow-big-blur"],
      // `.text-link` задаёт только оформление подчёркивания, но по имени
      // попал бы в корзину *цвета* текста и молча уцелел бы рядом с
      // настоящим цветом. Отнесён к text-decoration, чтобы конфликтовать с
      // underline и no-underline — как он себя и ведёт на деле.
      "text-decoration": ["text-link"],
      // Кольцо фокуса кита (base.css). Обе утилиты пишут один и тот же
      // `outline`, отличаясь только знаком отступа, поэтому должны вытеснять
      // друг друга; без своей группы twMerge прочитал бы `focus-ring` как
      // цвет и оставил бы рядом с `focus-ring-inset` обе.
      "focus-ring": ["focus-ring", "focus-ring-inset"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
