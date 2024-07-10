import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'
import toast from 'react-hot-toast'
import { getMatchId } from '../botUser/botUser.service'

export type PlanPeriods = 'yearly' | 'monthly'

export interface Billing {
  subscription: any
  id: number;
  game_id: number;
  plan_id: number;
  razorpay_subscription_id: string;
  status: string;
  user_id: number;
  start_at: number;
  end_at: number;
  payment_id: number | null;
  payment_img: string;
  created_at: string;
  updated_at: string;
  list: Billing;
  plan: {
    id: number;
    plans: string;
    plan_id: string;
    match_format: string;
    coverage: string;
    matches_access: string;
    api_access: string;
    fantasy_player_credits: number;
    fantasy_points_api: number;
    api_calls: number;
    api_format: string;
    delivery: string;
    period: string;
    description: string;
    amount: number;
    currency: string;
    created_at: string;
    updated_at: string;
  };
  user: {
    name: string;
    id: number;
  };

  detail: Billing;


  period: string;
  amount: number;
  invoice_id: number;
  type: string;
  billing_date: string;
  price: number;
  tax: number;
  total: number;
  total_hits: number;
  tax_amount: number;

}

let timeOut: any
const path = 'users/subscriptions'

const useBillingStore = create(
  combine(
    {
      plan: {
        id: null as any,
        list: [] as Billing[],
        total: 0,
        page: 1,
        size: 10,
        period: null as PlanPeriods | null,
        search: null as string | null,
        detail: undefined as Billing | undefined,
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
            toast.promise(Api.get('users/transactions', { query: { page, period, size, game_id, search } }), {
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
              useBillingStore.getState().get.list()
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


      verify: (bodyData: any) => {
        try {
          toast.promise(Api.post('admin/verify-payment', bodyData), {
            loading: 'Requesting...',
            success: res => {
              useBillingStore.getState().get.paginate({})
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

export default useBillingStore
