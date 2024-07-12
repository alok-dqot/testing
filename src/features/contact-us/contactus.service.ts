import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'

export interface Contact {
  id: number
  name: string
  email: string
  message: string
}

let timeOut: any
const path = '/contact-us'

const useContactStore = create(
  combine(
    {
      contactus: {
        id: null as any,
        list: [] as Contact[],
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
            contactus: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                contactus: {
                  ...prev.contactus,
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
          set(prev => ({ contactus: { ...prev.contactus, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              contactus: {
                ...prev.contactus,
                page: page || prev.contactus.page,
                size: size || prev.contactus.size,
                search: search || prev.contactus.search,
                paginate: paginate ?? true
              }
            }))
            useContactStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ contactus: { ...prev.contactus, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ contactus: { ...prev.contactus, id: id } })),
      add: async (bodyData: any) => {
        let id = get().contactus.id

        toast.promise(
          id ? Api.put(`${path}/${id}`, bodyData, { formData: true }) : Api.post(path, bodyData, { formData: true }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useContactStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err
            }
          }
        )
      },
      delete: async () => {
        let id = get().contactus.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useContactStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },
      get_team_list: async () => {
        let id = get().contactus.id

        if (!id) return toast('New Competition')

        return await toast.promise(Api.get(`${path}/teams/${id}`), {
          loading: '',
          success: res => {
            console.log('res: ', res)
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

export default useContactStore
