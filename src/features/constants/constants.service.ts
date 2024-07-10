import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import Api from 'src/api/Api'

const initials = {
  FORMATS: [],
  COMPETITION_STATUSES: [],
  MATCH_STATUSES: [],
  INNING_STATUSES: [],
  INNING_RESULTS: [],
  ROUND_TYPES: [],
  GENDERS: [],
  ROLES: [],
  OUT_TYPES: [],
  COVERAGE: [],
  FTB_ROLES: [],
  KBD_ROLES: []
}

const useConstantStore = create(
  combine(initials, (set, get) => ({
    get: async (type: keyof typeof initials) => {
      // const res = await Api.get(`/contants/${type}`)
      // console.log('res: ', res)
      // if ((type as any) == 'all') {
      //   set({
      //     ...res
      //   })
      //   return
      // }
      // set({
      //   [type]: res
      // })
    },
    getAll: async (type: keyof typeof initials) => {
      // const res = await Api.get(`/contants/all`)
      // console.log('res: ', res)
      // set({
      //   [type]: res
      // })
    }
  }))
)

export default useConstantStore
