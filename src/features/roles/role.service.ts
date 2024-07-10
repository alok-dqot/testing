import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'

export interface Role {
  id: number
  name: string
  order: number
  permissions: Permission
  created_at: string
  updated_at: string
}

export type Abilities = 1 | 2 | 3 | 4

export type Ability = Abilities[]

export interface Permission {
  [game: number]: GamePermission
}

export interface GamePermission {
  [module: number]: ModulePermission
}

export interface ModulePermission {
  ids: Array<number | string>
  ability: Ability
  can?: (mId: number, gIds: number[]) => boolean
  moduleId?: number
  gameIds?: number[]
  read?: boolean
  write?: boolean
  update?: boolean
  del?: boolean
}

let timeOut: any

const path = '/roles'

const useRoleStore = create(
  combine(
    {
      role: {
        id: null as any,
        list: [] as Role[],
        total: 0,
        page: 1,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        detail: undefined as Role | undefined,
        isUser: false as boolean
        // timeOut: null as any
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            role: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              console.log('res: ', res)
              set(prev => ({
                role: {
                  ...prev.role,
                  list: paginate ? res?.data : res,
                  total: res?.meta?.total
                }
              }))
              return res?.message || 'fetched'
            },
            error: err => {
              return err
            }
          })
        },
        paginate: ({
          page,
          size,
          search,
          paginate
        }: {
          page?: number
          size?: number
          search?: string
          paginate?: boolean
        }) => {
          set(prev => ({ role: { ...prev.role, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              role: {
                ...prev.role,
                page: page || prev.role.page,
                size: size || prev.role.size,
                search: search || prev.role.search,
                paginate: paginate ?? true
              }
            }))
            useRoleStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ role: { ...prev.role, search: search } }))
            return
          }
          init()
        },
        detail: async (id?: number, data?: Role, isUser?: boolean) => {
          set(prev => ({
            ...prev,
            role: {
              ...prev.role,
              detail: data,
              id: data?.id,
              isUser: !!isUser
            }
          }))
        }
      },
      select: (id: any) => set(prev => ({ role: { ...prev.role, id: id } })),
      add: async (bodyData: any) => {
        let id = get().role.id
        let isUser = get().role.isUser

        toast.promise(
          id
            ? Api.put(
                `${path}/${id}${isUser ? '/update-user-permission' : ''}`,
                isUser ? { permissions: bodyData.permissions } : bodyData
              )
            : Api.post(path, bodyData),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useRoleStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err
            }
          }
        )
      },
      delete: async () => {
        let id = get().role.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useRoleStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      }
    })
  )
)

export default useRoleStore
