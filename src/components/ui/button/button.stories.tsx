import type { Meta, StoryObj } from "@storybook/react-vite"
import { Download } from "@/icons"

import {
  PseudoBox,
  RESPONSIVE_NOTE,
  StatesMatrix,
  stateArgType,
  type PlaygroundState,
} from "@/stories/matrix"

import { Button, type ButtonProps } from "./button"

const VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "primary",
  "secondary-black",
  "secondary-grey",
  "secondary-white",
  "secondary-outline",
  "destructive",
]

const LOGO_VARIANTS: NonNullable<ButtonProps["variant"]>[] = [
  "secondary-logo-black",
  "secondary-logo-border-white",
  "secondary-logo-white",
  "secondary-logo-grey",
]

type PlaygroundArgs = ButtonProps & { state?: PlaygroundState }

const meta = {
  title: "Interaction/Button/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    // Mirrors Figma's own "Current variant" panel for ELK / button (Size /
    // State / Type / Style dropdowns) as closely as Storybook's mechanisms
    // allow, so a designer can compare against Figma control-for-control:
    // - Size/Type map 1:1 onto the real `size`/`variant` props below.
    // - Style (Text / Icon Left / Icon Right / Icon Only) is `icon` +
    //   `iconPosition` together — `icon` can't be a plain select on its own
    //   (its real type is a component reference, which no control widget
    //   can represent), so it uses `mapping` to translate a friendly
    //   "None"/"Download" label to the actual component reference/`undefined`
    //   behind the scenes.
    // - State (Default / Hover / Pressed / Focus) is a CSS pseudo-class, not
    //   a prop — the shared `state` control below forces it through
    //   storybook-addon-pseudo-states. Disabled/Loading are real props.
    variant: { control: "select", options: [...VARIANTS, ...LOGO_VARIANTS] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    icon: {
      control: { type: "select", labels: { none: "None", download: "Download (пример)" } },
      options: ["none", "download"],
      mapping: { none: undefined, download: Download },
    },
    iconPosition: { control: "inline-radio", options: ["left", "right", "only"] },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
    state: stateArgType,
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "default",
    isLoading: false,
    disabled: false,
    state: "default" as PlaygroundState,
  },
} satisfies Meta<PlaygroundArgs>

export default meta
type Story = StoryObj<PlaygroundArgs>

export const Playground: Story = {
  render: ({ state, ...args }) => (
    <PseudoBox state={state}>
      <Button {...args} />
    </PseudoBox>
  ),
}

export const Matrix: Story = {
  name: "Matrix (все состояния)",
  parameters: { layout: "fullscreen", controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <StatesMatrix<ButtonProps>
        baseProps={{ children: "Button" }}
        columns={VARIANTS.map((variant) => ({
          label: variant.replace("secondary-", "sec. "),
          props: { variant },
        }))}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Pressed", props: {}, pseudo: "active" },
          { label: "Focus", props: {}, pseudo: "focus-visible" },
          { label: "Disabled", props: { disabled: true } },
          { label: "Loading", props: { isLoading: true } },
          { label: "Icon left", props: { icon: Download, iconPosition: "left" } },
          {
            label: "Icon right",
            props: { icon: Download, iconPosition: "right" },
          },
          {
            label: "Icon only",
            props: { icon: Download, iconPosition: "only", "aria-label": "Скачать" },
          },
          { label: "S", props: { size: "sm" } },
          { label: "M (default)", props: { size: "default" } },
          { label: "L", props: { size: "lg" } },
        ]}
        render={(props) => <Button {...props} />}
      />
      {/* Secondary Logo types always carry the fixed Госуслуги glyph, so
          they have no icon/icon-only rows of their own. */}
      <StatesMatrix<ButtonProps>
        rowHeader={RESPONSIVE_NOTE}
        baseProps={{ children: "Button" }}
        columnGroups={[
          {
            label: "Secondary Logo (Госуслуги)",
            columns: LOGO_VARIANTS.map((variant) => ({
              label: variant.replace("secondary-logo-", ""),
              props: { variant },
            })),
          },
        ]}
        rows={[
          { label: "Default", props: {} },
          { label: "Hover", props: {}, pseudo: "hover" },
          { label: "Pressed", props: {}, pseudo: "active" },
          { label: "Disabled", props: { disabled: true } },
        ]}
        render={(props) => <Button {...props} />}
      />
    </div>
  ),
}

// Sizes are mobile-first responsive per ui/button/button.png's redline sheet
// (default/lg switch height+padding at the `md:` breakpoint — 40->48px and
// 48->56px). `md:` is a viewport media query, not a container one, so this
// story pins the viewport to see the mobile form.
//
// The viewport is pinned through `globals`, not the old
// `parameters.viewport.defaultViewport` — that form stopped being honoured in
// Storybook 9+, and the story silently rendered at desktop width.
export const SizesMobile: Story = {
  name: "Размеры — Mobile (< 768px)",
  globals: { viewport: { value: "mobile1", isRotated: false } },
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
