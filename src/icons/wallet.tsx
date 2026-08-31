import type { IconProps } from "./types"

// 24px drawing is Figma's `icon / wallet` as used in ELK / header's wallet
// slot (node 46154:63230): a 20×18 glyph at (2, 3) inside the 24 box per the
// component's 12.5%/8.33% insets. Unlike the 16px drawing below — a wallet
// with a card pocket — this one is an open wallet with a round clasp.
//
// Figma's export wraps these in a <mask> to render an inner stroke; the mask
// only contributes a sub-pixel edge refinement on top of the two real paths,
// so it is dropped here rather than carried in with generated IDs that would
// collide between instances.
const WALLET_24_BODY =
  "M2.56522 2C2.42249 2 2.28105 2.05775 2.17328 2.16792C2.06477 2.27884 2 2.43386 2 2.6C2 2.76614 2.06477 2.92116 2.17328 3.03208C2.28105 3.14225 2.42249 3.2 2.56522 3.2H18.2174C18.6973 3.2 19.1531 3.39511 19.4856 3.73502C19.8174 4.07419 20 4.52962 20 5V16.2C20 16.6704 19.8174 17.1258 19.4856 17.465C19.1531 17.8049 18.6973 18 18.2174 18H2.56522C1.8777 18 1.2229 17.7206 0.743607 17.2307C0.265044 16.7415 0 16.0826 0 15.4V2.6C0 1.91744 0.265044 1.25853 0.743607 0.769335C1.2229 0.27939 1.8777 0 2.56522 0H15.8696C16.4219 0 16.8696 0.447715 16.8696 1C16.8696 1.55228 16.4219 2 15.8696 2H2.56522ZM2 5.13613V15.4C2 15.5661 2.06477 15.7212 2.17328 15.8321C2.28105 15.9422 2.42249 16 2.56522 16H18V5.2H2.56522C2.37322 5.2 2.18378 5.17821 2 5.13613Z"

const WALLET_24_CLASP =
  "M14.5 12C15.3284 12 16 11.3284 16 10.5C16 9.67157 15.3284 9 14.5 9C13.6716 9 13 9.67157 13 10.5C13 11.3284 13.6716 12 14.5 12Z"

export function Wallet({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g transform="translate(2 3)" fill="currentColor">
          <path d={WALLET_24_BODY} fillRule="evenodd" clipRule="evenodd" />
          <path d={WALLET_24_CLASP} />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2 4.5A1.5 1.5 0 0 1 3.5 3h9A1.5 1.5 0 0 1 14 4.5V5h.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H14v.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5zm10.5.5v-.5h-9v7h9V11h-2A1.5 1.5 0 0 1 9 9.5v-3A1.5 1.5 0 0 1 10.5 5zm-2 1.5h3v3h-3z" clipRule="evenodd"/></svg>
  )
}
