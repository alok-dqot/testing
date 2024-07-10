import { createContext } from 'react'
import { AnyAbility } from '@casl/ability'
import { createContextualCan } from '@casl/react'
import { GamePermission, ModulePermission, Permission, Role } from 'src/features/roles/role.service'

export const AbilityContext = createContext<{ module: ModulePermission; role: Role }>(undefined!)

export default createContext(AbilityContext.Consumer)
