import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { getMatchId } from '../botUser/botUser.service'

export type PlanPeriods = 'yearly' | 'monthly'
export interface Plan {
  id: number
  plans: string
  plan_id: string
  match_format: string
  coverage: string
  matches_access: string
  api_access: string
  fantasy_player_credits: number
  fantasy_points_api: number
  api_calls: number
  api_format: string
  delivery: string
  period: string
  description: string
  amount: number
  currency: string
  created_at: string
  updated_at: string
  status: string
  is_active: boolean
  is_purchased: boolean
  detail: Plan
  payDetail: PlanPayDetail
}

interface PlanPayDetail {
  amount: number;
  api_calls: number;
  duration: string;
  tax: number;
  tax_amount: number;
  discount: number;
  total_amount: number;
}

let timeOut: any
const path = '/users'

const usePlanStore = create(
  combine(
    {
      plan: {
        id: null as any,
        list: [] as Plan[],
        total: 0,
        page: 1,
        size: 10,
        period: null as PlanPeriods | null,
        search: null as string | null,
        detail: undefined as Plan | undefined,
        payDetail: {} as PlanPayDetail
        // timeOut: null as any
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            plan: { page, period, size, search }
          } = get()

          try {
            const game_id = getMatchId()
            toast.promise(Api.get(path + '/plans', { query: { page, period, size, game_id } }), {
              loading: 'fetching...',
              success: res => {
                set(prev => ({
                  plan: {
                    ...prev.plan,
                    list: res?.data,
                    total: res?.meta?.total
                  }
                }))
                return res?.message || 'fetched'
              },
              error: err => {
                // return handleApiError(err)
                return err
              }
            })
          }
          catch (err) {
            console.log(err)
          }

        },
        paginate: ({
          page,
          size,
          period,
          search
        }: {
          page?: number
          size?: number
          period?: PlanPeriods
          search?: string
        }) => {

          try {
            set(prev => ({ plan: { ...prev.plan, search: search || '' } }))

            clearTimeout(timeOut)

            const init = () => {
              set(prev => ({
                plan: {
                  ...prev.plan,

                  page: page || prev.plan.page,
                  size: size || prev.plan.size,
                  period: period || prev.plan.period,
                  search: search || prev.plan.search
                }
              }))
              usePlanStore.getState().get.list()
            }

            if (search) {
              timeOut = setTimeout(() => {
                init()
              }, 1000)
              set(prev => ({ plan: { ...prev.plan, search: search } }))
              return
            }
            init()
          }
          catch (err) {
            console.log(err)
          }
        }
      },

      select: (detail: any) => set((prev: any) => ({ plan: { ...prev.plan, detail: detail } })),

      selectPayment: (detail: any) => {

        const game_id = getMatchId()
        const plan_id = detail.id
        // console.log(detail)
        try {
          toast.promise(Api.get(path + '/billinginfo', { query: { plan_id, game_id } }), {
            loading: 'fetching...',
            success: res => {
              // console.log(res)
              set(prev => ({
                plan: {
                  ...prev.plan,
                  payDetail: res?.data,
                  total: res?.meta?.total
                }
              }))
              return res?.message || 'fetched'
            },
            error: err => {
              // return handleApiError(err)
              return err
            }
          })
        }
        catch (err) {
          console.log(err)
        }

        set((prev: any) => ({ plan: { ...prev.plan, detail: detail } }))
      },

      pay: (bodyData: any) => {
        try {
          toast.promise(Api.post(path + '/subscriptions', bodyData, { formData: true }), {
            loading: 'Requesting...',
            success: res => {
              usePlanStore.getState().get.paginate({})
              return res?.message
            },
            error: err => {
              // console.log(err)
              // return handleApiError(err)
              return err
            }
          })
        }
        catch (err) {
          console.log(err)
        }
      }



    })
  )
)

export default usePlanStore
