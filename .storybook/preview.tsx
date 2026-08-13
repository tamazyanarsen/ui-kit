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
      description: 'Цветовая тема продукта (ЕЛК / Старый_ЕЛК)',
      toolbar: {
        title: 'Тема',
        icon: 'paintbrush',
        items: [
          { value: 'elk', title: 'ЕЛК — новые цвета' },
          { value: 'odl-elk', title: 'Старые цвета' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    product: 'elk',
  },

  decorators: [
    (Story, context) => {
      useEffect(() => {
        document.documentElement.setAttribute('data-product', context.globals.product)
      }, [context.globals.product])

      return <Story />
    },
  ],
};

export default preview;
