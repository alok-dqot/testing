import { ModulePermission } from 'src/features/roles/role.service'

declare global {
  interface GlobalProps extends ModulePermission {
    // Add more global props as needed
  }
}
