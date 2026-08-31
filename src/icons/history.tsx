import type { IconProps } from "./types"

// icon / history — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function History({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m11-5.545a1 1 0 0 1 1 1v4.867l3.559 1.987a1 1 0 1 1-.975 1.746l-4.071-2.273a1 1 0 0 1-.513-.873V7.455a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-68 -888)"><defs><clipPath id="history-16-clip9_70326_26"><path fill="#fff" d="M68 888h16v16H68z"/></clipPath></defs><g fill="currentColor" clipPath="url(#history-16-clip9_70326_26)"><path d="M76 891.811c-.56 0-1.013.454-1.013 1.013v3.811c0 .367.199.706.519.885l2.845 1.588a1.015 1.015 0 0 0 1.379-.391 1.015 1.015 0 0 0-.391-1.379l-2.326-1.298v-3.216c0-.559-.454-1.013-1.013-1.013"/><path fillRule="evenodd" d="M76 888a8 8 0 1 0 0 16 8 8 0 0 0 0-16m-5.974 8a5.974 5.974 0 1 1 11.949 0 5.974 5.974 0 0 1-11.949 0" clipRule="evenodd"/></g></g></svg>
  )
}
