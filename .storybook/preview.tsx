import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'

import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    // Плоский алфавитный список вместо прежних разделов (Content /
    // Interaction / Navigation / Pattern / Status / Template / Sandbox):
    // все истории лежат в одной группе «Компоненты», группировка осталась
    // только у Preview. Без явного storySort Storybook раскладывает истории
    // в порядке импорта файлов (т.е. по пути на диске), а не по заголовку,
    // поэтому алфавит нужно задать явно.
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Preview', 'Компоненты'],
      },
    },
  },

  globalTypes: {
    product: {
      description: 'Цветовая тема продукта (ЕЛК / Старый_ЕЛК / тестовая монохромная)',
      toolbar: {
        title: 'Тема',
        icon: 'paintbrush',
        items: [
          { value: 'elk', title: 'ЕЛК — новые цвета' },
          { value: 'odl-elk', title: 'Старые цвета' },
          // Дизайн-чек №5: одноцветная «лакмусовая» палитра. В ней перекрашен
          // каждый цветовой токен, включая не зависящие от бренда и статуса,
          // поэтому всё, что осталось серым или синим, держит цвет
          // захардкоженным литералом. Подробности — в комментарии над блоком
          // [data-product="test-mono"] в src/index.css.
          { value: 'test-mono', title: 'Тест — монохром' },
        ],
        dynamicTitle: true,
      },
    },
    canvas: {
      description: 'Подложка вьюпорта (дизайн-чек №32)',
      toolbar: {
        title: 'Подложка',
        icon: 'contrast',
        items: [
          { value: 'grey', title: 'Серая подложка' },
          { value: 'white', title: 'Белая подложка' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    product: 'elk',
    canvas: 'grey',
  },

  decorators: [
    (Story, context) => {
      useEffect(() => {
        document.documentElement.setAttribute('data-product', context.globals.product)
      }, [context.globals.product])

      // Дизайн-чек №32: «невозможно проверять компоненты белого цвета на
      // белой подложке… необходимо централизованно по всей сборке задать
      // такие свойства, чтобы когда компонент с белым фоном без
      // дополнительных границ показывался во вьюпорте, он показывался,
      // например, на сером фоне. Иначе проверить наличие правильной заливки
      // и правильных скруглений просто нельзя».
      //
      // Красим само тело превью, а не оборачиваем историю в <div>: обёртка
      // сломала бы истории с layout: "fullscreen" и позиционированием, а
      // фон на body виден под любой раскладкой. Переключатель оставлен —
      // белая подложка иногда нужна, чтобы посмотреть компонент так, как он
      // ляжет на белую страницу.
      useEffect(() => {
        const grey = context.globals.canvas !== 'white'
        document.body.style.background = grey ? 'var(--card-bg)' : ''
      }, [context.globals.canvas])

      return <Story />
    },
  ],
};

export default preview;
