import type { StorybookConfig } from '@storybook/react-vite';

// Истории для проверок в браузере (npm run qa) лежат в src/qa-stories и в каталог не входят:
// подключаются только при STORYBOOK_QA=1, его выставляет `npm run qa -- build`.
const qa = process.env.STORYBOOK_QA === '1'

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/sandbox/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ...(qa ? ["../src/qa-stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"] : []),
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
    "storybook-addon-pseudo-states"
  ],
  "framework": "@storybook/react-vite"
};
export default config;