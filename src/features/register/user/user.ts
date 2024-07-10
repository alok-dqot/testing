import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'

import { format } from 'date-fns'
import { Country } from 'src/features/players/player.service'

export interface Register {

  //register

  name: string
  company: string
  email: string
  password: string
  confirm_pass: string
  phone: number
  countries: Country[]
  state: Country
  city: Country
  gst: string

}

let timeOut: any
const path = '/register'


const useMatchStore = create(
  combine(
    {
      match: {
        id: null as any,
        list: [] as Register[],
        total: 0,
        page: 1,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        detail: undefined as Register | undefined,

      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            match: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                match: {
                  ...prev.match,
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


      },
      select: (id: any) => set(prev => ({ match: { ...prev.match, id: id } })),
      add: async (bodyData: any) => {
        let id = get().match.id
        if (id) {
          bodyData.starting_at = format(new Date(bodyData.starting_at), 'yyyy-MM-dd HH:mm:ss')
        }
        const response = await toast.promise(id ? Api.put(`${path}/${id}`, bodyData) : Api.post(path, bodyData), {
          loading: id ? 'Updating' : 'Adding',
          success: res => {
            return res?.message
          },
          error: err => {
            return err
          }
        })
        return response
      },
      delete: async () => {
        let id = get().match.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },

      lineup: async (bodyData: any) => {
        let id = get().match.id

        return await toast.promise(Api.post(`${path}/${id}/lineup`, bodyData), {
          loading: id ? 'Updating' : 'Adding',
          success: res => {

            return res?.message
          },
          error: err => {
            return err
          }
        })
      },





    })
  )
)

export default useMatchStore
