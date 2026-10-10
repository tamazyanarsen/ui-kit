import * as React from "react"

import type { ProfileMenuOrganization } from "./profile-menu"

/**
 * Выбранная организация шапки — общая для плитки профиля (десктоп) и
 * карточки организации в мобильном меню.
 *
 * Без `organizationId` выбор живёт здесь же: иначе клик по другой
 * организации вызывал колбэк, а триггер и галочка навсегда оставались на
 * первой. Свой выбор учитывается, только пока такая организация есть в
 * списке: после смены `organizations` устаревший id уходил в меню как
 * `value`, триггер откатывался на первую, а галочки в списке не было ни у
 * кого.
 */
function useOrganization(
  organizations: ProfileMenuOrganization[],
  organizationId: string | undefined,
  onOrganizationChange: ((id: string) => void) | undefined
) {
  const [ownOrganizationId, setOwnOrganizationId] = React.useState<string>()
  const ownOrganizationListed = organizations.some(
    (organization) => organization.id === ownOrganizationId
  )
  const activeOrganizationId =
    organizationId ??
    (ownOrganizationListed ? ownOrganizationId : undefined) ??
    organizations[0]?.id
  function changeOrganization(id: string) {
    if (organizationId === undefined) setOwnOrganizationId(id)
    onOrganizationChange?.(id)
  }
  return { activeOrganizationId, changeOrganization }
}

export { useOrganization }
