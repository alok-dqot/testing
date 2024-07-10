import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { Season } from '../seasons/season.service'

export interface Competition {
  id: number
  name: string
  code: string
  format: string
  status: string
  season_id: number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  season: Season
  image: any
}

let timeOut: any
const path = '/competitions'

const useCompetitionsStore = create(
  combine(
    {
      competition: {
        id: null as any,
        list: [] as Competition[],
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
            competition: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                competition: {
                  ...prev.competition,
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
          set(prev => ({ competition: { ...prev.competition, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              competition: {
                ...prev.competition,
                page: page || prev.competition.page,
                size: size || prev.competition.size,
                search: search || prev.competition.search,
                paginate: paginate ?? true
              }
            }))
            useCompetitionsStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ competition: { ...prev.competition, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ competition: { ...prev.competition, id: id } })),
      add: async (bodyData: any) => {
        let id = get().competition.id

        toast.promise(
          id ? Api.put(`${path}/${id}`, bodyData, { formData: true }) : Api.post(path, bodyData, { formData: true }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useCompetitionsStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err
            }
          }
        )
      },
      delete: async () => {
        let id = get().competition.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useCompetitionsStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },
      get_team_list: async () => {
        let id = get().competition.id

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

export default useCompetitionsStore
