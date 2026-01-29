import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {
      image: {
        loading: "eager",
      },
    },
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    // Handle CommonJS dagre dependency
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      "@dagrejs/dagre",
      "@dagrejs/graphlib",
    ];
    return config;
  },
};
export default config;
