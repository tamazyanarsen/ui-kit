export { HeaderMenu, distributeMenuGroups } from "./header-menu"
export type { HeaderMenuProps, HeaderMenuGroup, HeaderMenuLink } from "./header-menu"
/* Строка «Ссылка на страницу» — общая для раскрытого меню клиента и меню
   сотрудника: в макете это один и тот же символ со звездой, которая
   проявляется по наведению на строку. */
export { PageLink } from "./header-menu-parts"
export { CreateMenu } from "./create-menu"
export type { CreateMenuProps, CreateMenuItem } from "./create-menu"
export { MenuBanner } from "./menu-banner"
export type { MenuBannerProps, MenuBannerColor } from "./menu-banner"
export { FavouritesSettings } from "./favourites-settings"
export type { FavouritesSettingsProps } from "./favourites-settings"
export {
  collectMenuLinks,
  resolveFavouriteLinks,
  resolveRemainingLinks,
  toggleFavourite,
  moveFavourite,
} from "./favourites"
