import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { Plan } from '../plans/plans.service'
import { getMatchId } from '../botUser/botUser.service'

export type PlanPeriods = 'yearly' | 'monthly'
export interface Analytics {
  id: number
  plan_id: string
  start_at: string
  end_at: string

  plan: Plan
  total_hits: number
  today_total_hits: number
  remaining_hits: number

  plan_status: PlanStatus
}


interface PlanStatus {

  name: string;
  remaining: number;
  current: number;
  end: number;
}


let timeOut: any
const path = '/users/myActiveSubscription'

const useAnalytic = create(
  combine(
    {
      analytic: {
        id: null as any,
        subscriptions: [] as Analytics[],
        user_id: null,
        total: 0,
        page: 1,
        size: 10,
        period: null as PlanPeriods | null,
        search: null as string | null,
        detail: undefined as Analytics | undefined,
        total_hits: 0,
        today_total_hits: 0,
        remaining_hits: 0,
        plan_status: {}
        // timeOut: null as any
      }
    },
    (set, get) => ({
      get: {
        list: async () => {
          const {
            analytic: { user_id }
          } = get()

          const game_id = getMatchId()

          toast.promise(Api.get(path, { query: { game_id } }), {
            loading: 'fetching...',
            success: res => {
              console.log(res.data)
              if (res) {
                set(prev => (
                  {
                    analytic: {
                      ...prev.analytic,
                      subscriptions: res?.data.subscriptions,
                      total: res?.data.total,
                      total_hits: res?.data.total_hits,
                      today_total_hits: res?.data.today_total_hits,
                      remaining_hits: res?.data.remaining_hits,

                    }
                  }))
              }

              return res?.message || 'fetched'
            },
            error: err => {
              return err
            }
          })
        },
      }
    })
  )
)

export default useAnalytic
