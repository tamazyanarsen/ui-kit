export type TopFixedMessageType = "blue" | "red"

export const TOP_FIXED_MESSAGE_BG: Record<TopFixedMessageType, string> = {
  blue: "var(--top-fixed-message-blue-bg)",
  red: "var(--top-fixed-message-red-bg)",
}

export const TOP_FIXED_MESSAGE_ICON_COLOR: Record<TopFixedMessageType, string> = {
  blue: "var(--top-fixed-message-blue-icon)",
  red: "var(--top-fixed-message-red-icon)",
}
