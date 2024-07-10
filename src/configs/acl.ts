import { AbilityBuilder, Ability } from '@casl/ability'
import { Role } from 'src/features/roles/role.service'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: string, subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  can('manage', 'all')

  // if (role === 'ADMIN') {
  //   can('manage', 'all')
  // } else if (role === 'USER') {
  //   can(['manage'], 'all')
  // } else {
  //   can(['read', 'create', 'update', 'delete'], subject)
  // }

  return rules
}

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const _buildAbilityFor = (role: Role, moduleId: number, gameIds: number[]) => {

  console.log(role)
  if (role.id == 1) {
    return {
      ids: [],
      ability: [1, 2, 3, 4],
      moduleId: moduleId,
      gameIds: gameIds,
      can: (mId: number, gIds: number[]) => {
        return mId == moduleId && gIds.some((r: any) => gameIds.includes(parseInt(r)))
      },
      read: true,
      // write: true,
      // update: true,
      // del: true
    }
  }
  const permissionGames = Object.keys(role.permissions)

  const game = permissionGames.find(r => gameIds.includes(parseInt(r))) as number | undefined

  if (game) {
    const ability = role.permissions?.[game]?.[moduleId]

    if (ability) {
      return {
        ...ability,
        moduleId: moduleId,
        gameIds: gameIds,
        can: (mId: number, gIds: number[]) => {
          return mId == moduleId && gIds.some((r: any) => gameIds.includes(parseInt(r)))
        },
        read: ability.ability.includes(1),
        // write: ability.ability.includes(2),
        // update: ability.ability.includes(3),
        // del: ability.ability.includes(4)
      }
    }
  }
  return undefined
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
