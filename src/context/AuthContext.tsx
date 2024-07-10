// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType, Register, Reset, UpdatePass } from './types'
import useConstantStore from 'src/features/constants/constants.service'
import { toast } from 'react-hot-toast'
import { handleApiError } from 'src/api/Api'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  resetpass: () => Promise.resolve(),
  updatepass: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const getConstant = useConstantStore(state => state.get)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: 'Bearer ' + storedToken
            }
          })
          .then(async response => {
            console.log('response: ', response.data)
            await getConstant('all' as any)


            setLoading(false)
            setUser({ ...response.data.data })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {

              router.replace('/login')
            }
          })
      } else {
        // if (router.pathname.includes('reset-password/t') && localStorage.getItem('spzResetMail')) {
        //   const returnUrl = router.query

        //   console.log(returnUrl)
        //   router.replace('/reset-password')
        // }
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const json = response.data
        console.log('json: ', json)
        // window.localStorage.clear()

        if (json.message == 'Login Successfull.') {
          window.localStorage.setItem(authConfig.storageTokenKeyName, json.data.token)

          const returnUrl = router.query.returnUrl
          setUser({ ...json.data.user })
          window.localStorage.setItem('userData', JSON.stringify(json.data.user))
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';
          // const redirectURL = '/dashboards/analytics/'
          router.replace(redirectURL as string)
        }
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('bot-storage')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }



  const handleSignUp = async (params: Register, errorCallback?: ErrCallbackType) => {

    try {
      const data = await toast.promise(
        axios.post(authConfig.registerEndPoint, params),
        {
          loading: 'Creating New User ...',
          success: (res: any) => {
            return res?.data?.message
          },
          error: err => {
            return handleApiError(err)
          }
        }
      )
      router.replace('/login')
      return data

    }
    catch (err) {
      console.log(err)
    }


  }


  const handleResetPass = async (params: Reset, errorCallback?: ErrCallbackType) => {

    try {
      const data = await toast.promise(
        axios.post(authConfig.resetEndPoint, params),
        {
          loading: 'Sending Reset Link to email ...',
          success: (res: any) => {
            localStorage.setItem('spzResetMail', params.email)
            return res?.data?.message
          },
          error: err => {
            return err?.data?.errors[0]
          }
        }
      )
      router.replace('/login')
      return data

    }
    catch (err) {
      console.log(err)
    }
  }

  const handleUpdatePass = async (params: UpdatePass, errorCallback?: ErrCallbackType) => {

    try {
      const data = await toast.promise(
        axios.post(authConfig.resetEndPoint, params),
        {

          loading: 'Updating the password...',

          success: (res: any) => {
            return res?.data?.message
          },
          error: err => {
            return handleApiError(err)
          }
        }
      )
      router.replace('/login')
      return data

    }
    catch (err) {
      console.log(err)
    }
  }


  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignUp,
    resetpass: handleResetPass,
    updatepass: handleUpdatePass,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
