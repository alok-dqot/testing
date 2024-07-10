import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router';

export interface Season {
  id: number
  name: string
  created_at: string
  updated_at: string
}

let timeOut: any


const useSeasonStore = create(
  combine(
    {
      season: {
        id: null as any,
        list: [] as Season[],
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
            season: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get('/seasons', { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                season: {
                  ...prev.season,
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
          set(prev => ({ season: { ...prev.season, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              season: {
                ...prev.season,
                page: page || prev.season.page,
                size: size || prev.season.size,
                search: search || prev.season.search,
                paginate: paginate ?? true
              }
            }))
            useSeasonStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ season: { ...prev.season, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ season: { ...prev.season, id: id } })),
      add: async (bodyData: any) => {
        let id = get().season.id

        toast.promise(id ? Api.put(`/seasons/${id}`, bodyData) : Api.post('/seasons', bodyData), {
          loading: id ? 'Updating' : 'Adding',
          success: res => {
            useSeasonStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },
      delete: async () => {
        let id = get().season.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`/seasons/${id}`), {
          loading: 'deleting',
          success: res => {
            useSeasonStore.getState().get.paginate({})
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

export default useSeasonStore
