import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { Role } from '../roles/role.service'

export interface Admin {
  id: number
  name: string
  email: string
  role_id: number
  role: Role
  permissions: Permissions
  created_at: string
  updated_at: string
}
////
let timeOut: any

const path = '/admins'

const useAdminStore = create(
  combine(
    {
      admin: {
        id: null as any,
        list: [] as Admin[],
        total: 0,
        page: 1,
        size: 10,
        search: null as string | null,
        paginate: true as boolean
        // timeOut: null as any
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            admin: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                admin: {
                  ...prev.admin,
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
          set(prev => ({ admin: { ...prev.admin, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              admin: {
                ...prev.admin,
                page: page || prev.admin.page,
                size: size || prev.admin.size,
                search: search || prev.admin.search,
                paginate: paginate ?? true
              }
            }))
            useAdminStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ admin: { ...prev.admin, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ admin: { ...prev.admin, id: id } })),
      add: async (bodyData: any) => {
        let id = get().admin.id

        toast.promise(id ? Api.put(`${path}/${id}`, bodyData) : Api.post(path, bodyData), {
          loading: id ? 'Updating' : 'Adding',
          success: res => {
            useAdminStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },
      delete: async () => {
        let id = get().admin.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useAdminStore.getState().get.paginate({})
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

export default useAdminStore
