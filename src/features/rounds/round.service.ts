import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { Competition } from '../competitions/competition.service'

export interface Round {
  id: number
  order: number
  name: string
  type: string
  format: string
  start_date: string
  end_date: string
  competition_id: number
  created_at: string
  updated_at: string
  competition: Competition
}

let timeOut: any
const path = '/rounds'

const useRoundStore = create(
  combine(
    {
      round: {
        id: null as any,
        list: [] as Round[],
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
            round: { page, size, search, paginate }
          } = get()

          toast.promise(Api.get(path, { query: { page, size, search, paginate: paginate ? 'YES' : 'NO' } }), {
            loading: 'fetching...',
            success: res => {
              set(prev => ({
                round: {
                  ...prev.round,
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
          set(prev => ({ round: { ...prev.round, search: search || '' } }))

          clearTimeout(timeOut)

          const init = () => {
            set(prev => ({
              round: {
                ...prev.round,
                page: page || prev.round.page,
                size: size || prev.round.size,
                search: search || prev.round.search,
                paginate: paginate ?? true
              }
            }))
            useRoundStore.getState().get.list()
          }

          if (search) {
            timeOut = setTimeout(() => {
              init()
            }, 1000)
            set(prev => ({ round: { ...prev.round, search: search } }))
            return
          }
          init()
        }
      },
      select: (id: any) => set(prev => ({ round: { ...prev.round, id: id } })),
      add: async (bodyData: any) => {
        let id = get().round.id

        toast.promise(id ? Api.put(`${path}/${id}`, bodyData) : Api.post(path, bodyData), {
          loading: id ? 'Updating' : 'Adding',
          success: res => {
            useRoundStore.getState().get.paginate({})
            return res?.message
          },
          error: err => {
            return err
          }
        })
      },
      delete: async () => {
        let id = get().round.id

        if (!id) return toast.error('No plan to delete')

        toast.promise(Api.del(`${path}/${id}`), {
          loading: 'deleting',
          success: res => {
            useRoundStore.getState().get.paginate({})
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

export default useRoundStore
