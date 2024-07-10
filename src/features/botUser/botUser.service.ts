import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getToken, handleApiError } from 'src/api/Api'
import toast from 'react-hot-toast'
import axios, { AxiosInstance } from 'axios'

import env from 'src/configs/api'

// Define your API base URL
const baseURL = env.baseUrl

// Create an Axios instance with custom configuration
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000, // You can adjust the timeout value as needed
  headers: {
    'Content-Type': 'application/json'
  }
});


export function getMatchId(): string | null {
  const game = JSON.parse(localStorage.getItem('app-utils-test-user') || '')

  const game_id = game?.state?.game?.id
  return game_id
}





export interface BotUser {
  id: number
  name: string
  role: string
  company: string
  email: string
  phone: string
  country_id: number
  state: string
  city: string
  gstn: string
  email_verified: number
  phone_verified: number
  remember_me_token: any
  subscription_id: number
  access_key: string
  created_at: string
  updated_at: string
}

let timeOut: any
const path = '/users'

const useBotUserStore = create<any>(
  persist(
    (set, get) => ({
      token: null as any,
      detail: undefined as BotUser | undefined,
      apiToken: null as any,
      accessKey: null as any,
      secretKey: null as any,

      getAccessKey: async () => {

        try {
          let game_id = getMatchId()
          let token_id = getToken()

          const data = await toast.promise(
            api.get(`${path}/accessKey`, { headers: { Authorization: `Bearer ${token_id}` }, params: { game_id: game_id } }),
            {
              loading: 'Getting Creds',
              success: (res: any) => {
                return res?.data?.message
              },
              error: err => {
                return handleApiError(err)
              }
            }
          )
          set({
            accessKey: data?.data?.data?.access_key,
            secretKey: data?.data?.data?.secret_key
          })

          return data
        }

        catch (err) {
          console.log(err)
        }

      },
      generateAccessKey: async () => {

        try {
          let game_id = getMatchId()
          let token_id = getToken()
          const data = await toast.promise(
            api.post(`${path}/accessKey`, {}, { headers: { Authorization: `Bearer ${token_id}` }, params: { game_id: game_id } }),
            {
              loading: 'Generating Creds',
              success: (res: any) => {
                return res?.data?.message
              },
              error: err => {

                return handleApiError(err)
              }
            }
          )
          // console.log('data?.data: ', data?.data)
          set({
            accessKey: data?.data?.data?.access_key,
            secretKey: data?.data?.data?.secret_key
          })

          return data
        }

        catch (err) {
          console.log(err)
        }

      },
      generateApiToken: async (bodyData: any) => {

        try {
          let token_id = getToken()
          const data = await toast.promise(
            api.post(`${path}/token`, { ...bodyData }, { headers: { Authorization: `Bearer ${token_id}` } }),
            {
              loading: 'Generating Token',
              success: (res: any) => {
                return res?.data?.message
              },
              error: err => {
                return handleApiError(err)
              }
            }
          )
          set({
            apiToken: data?.data?.data?.token
          })

          return data
        }
        catch (err) {
          console.log(err)
        }
      }

    }),
    {
      name: 'user-bot-storage', // unique name
      // (optional) by default, 'localStorage' is used
    }
  )
)

export default useBotUserStore
