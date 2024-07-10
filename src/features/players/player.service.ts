import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { Competition } from '../competitions/competition.service'

export interface Player {
  id: number
  name: string
  short_name: string
  date_of_birth: string
  gender: string
  country_id: number
  image: string
  playing_role: string
  batting_style: string
  bowling_style: string
  credit: string
  nationality: any
  created_at: string
  updated_at: string
  country: Country
}


export interface CompTeam {
  competition: object
  player: object
}

export interface Country {
  id: number
  name: string
  created_at: string
  updated_at: string
}

let timeOut: any
const path = '/players'

const usePlayerStore = create(
  combine(
    {
      player: {
        id: null as any,
        list: [] as Player[],
        total: 0,
        page: 1,
        size: 10,
        search: null as string | null,
        paginate: true as boolean,
        filter: null as string | null
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            player: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                player: {
                  ...prev.player,
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
          paginate,
          filter
        }: {
          page?: number
          size?: number
          search?: string
          paginate?: boolean
          filter?: string
        }) => {
          set(prev => ({ player: { ...prev.player, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              player: {
                ...prev.player,
                page: page || prev.player.page,
                size: size || prev.player.size,
                search: search || prev.player.search,
                paginate: paginate ?? true,
                filter: filter || null
              }
            }))
            usePlayerStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ player: { ...prev.player, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ player: { ...prev.player, id: id } })),
      add: async (bodyData: any) => {
        let id = get().player.id

        if (id) {
          if (typeof bodyData.image == 'string') {
            delete bodyData.image
          }
        }

        toast.promise(
          id ? Api.put(`${path}/${id}`, bodyData, { formData: true }) : Api.post(path, bodyData, { formData: true }),
          {
            loading: id ? 'Updating' : 'Adding',
            success: res => {
              usePlayerStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              return err
            }
          }
        )
      },
      delete: async () => {
        let id = get().player.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            usePlayerStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },
      select_competition: async () => {
        let id = get().player.id

        if (!id) return toast('New Player')

        return await toast.promise(Api.get(`${path}/comp-teams/${id}`), {
          loading: 'fetching',
          success: res => {
            console.log(res)
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

export default usePlayerStore
