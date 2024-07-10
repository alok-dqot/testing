import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { } from '../competitions/competition.service'

export interface Official {
  id: number
  name: string
  country_id: number
  date_of_birth: string
  gender: string
  created_at: string
  updated_at: string
}

let timeOut: any
const path = '/officials'

const useOfficialStore = create(
  combine(
    {
      official: {
        id: null as any,
        list: [] as Official[],
        total: 0,
        page: 1,
        size: 10,
        search: null as string | null,
        paginate: true as boolean
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            official: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                official: {
                  ...prev.official,
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
          set(prev => ({ official: { ...prev.official, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              official: {
                ...prev.official,
                page: page || prev.official.page,
                size: size || prev.official.size,
                search: search || prev.official.search,
                paginate: paginate ?? true
              }
            }))
            useOfficialStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ official: { ...prev.official, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ official: { ...prev.official, id: id } })),
      add: async (bodyData: any) => {
        let id = get().official.id

        toast.promise(
          id ? Api.put(`${path}/${id}`, bodyData, { formData: true }) : Api.post(path, bodyData, { formData: true }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useOfficialStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err
            }
          }
        )
      },
      delete: async () => {
        let id = get().official.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useOfficialStore.getState().get.paginate({})
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

export default useOfficialStore
