import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { Player } from '../players/player.service'

export interface Team {
  id: number
  name: string
  code: string
  image: any
  country_id: number
  national_team: number
  created_at: string
  updated_at: string
  country_name: string
  players?: Player[]
}

let timeOut: any
const path = '/teams'

const useTeamStore = create(
  combine(
    {
      team: {
        id: null as any,
        list: [] as Team[],
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
            team: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                team: {
                  ...prev.team,
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
          set(prev => ({ team: { ...prev.team, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              team: {
                ...prev.team,
                page: page || prev.team.page,
                size: size || prev.team.size,
                search: search || prev.team.search,
                paginate: paginate ?? true
              }
            }))
            useTeamStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ team: { ...prev.team, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ team: { ...prev.team, id: id } })),
      add: async (bodyData: any) => {
        let id = get().team.id

        toast.promise(
          id ? Api.put(`${path}/${id}`, bodyData, { formData: true }) : Api.post(path, bodyData, { formData: true }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              useTeamStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err
            }
          }
        )
      },
      delete: async () => {
        let id = get().team.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useTeamStore.getState().get.paginate({})
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

export default useTeamStore
