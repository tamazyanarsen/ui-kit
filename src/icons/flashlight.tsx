import type { IconProps } from "./types"

// icon / flashlight — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Flashlight({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2.197a6.95 6.95 0 0 1-1.168 3.858A4.96 4.96 0 0 0 17 12.803V20a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-7.197c0-.978-.29-1.934-.832-2.748A6.95 6.95 0 0 1 5 6.197zm3-1a1 1 0 0 0-1 1v2.197c0 .978.29 1.934.832 2.748A6.95 6.95 0 0 1 9 12.803V20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7.197c0-1.373.406-2.715 1.168-3.858.542-.814.832-1.77.832-2.748V4a1 1 0 0 0-1-1zm4 9a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12 1a2 2 0 0 1 2 2v1.697c0 .395-.117.781-.336 1.11L12 8.303V12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8.303L2.336 5.807A2 2 0 0 1 2 4.697V3a2 2 0 0 1 2-2zM4 4.697l1.664 2.496c.219.329.336.715.336 1.11V12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V8.303c0-.395.117-.781.336-1.11L12 4.697V3H4zM8 8a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1"/></svg>
  )
}
