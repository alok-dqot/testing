import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { } from '../competitions/competition.service'

export interface Venue {
  id: number
  name: string
  country_id: number
  city: string
  created_at: string
  updated_at: string
  country: any
}

let timeOut: any
const path = '/venues'

const useVenueStore = create(
  combine(
    {
      venue: {
        id: null as any,
        list: [] as Venue[],
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
            venue: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                venue: {
                  ...prev.venue,
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
          set(prev => ({ venue: { ...prev.venue, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              venue: {
                ...prev.venue,
                page: page || prev.venue.page,
                size: size || prev.venue.size,
                search: search || prev.venue.search,
                paginate: paginate ?? true
              }
            }))
            useVenueStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ venue: { ...prev.venue, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ venue: { ...prev.venue, id: id } })),
      add: async (bodyData: any) => {
        let id = get().venue.id

        toast.promise(
          id ? Api.put(`${path}/${id}`, bodyData, { formData: true }) : Api.post(path, bodyData, { formData: true }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useVenueStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err
            }
          }
        )
      },
      delete: async () => {
        let id = get().venue.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useVenueStore.getState().get.paginate({})
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

export default useVenueStore
