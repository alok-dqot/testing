import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

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
})

// Define the response and error types for your API calls
interface ApiResponse<T> {
  data: T
}

interface ApiError {
  message: string
  status?: number
  [key: string]: any
}

// const games = [
//   'ftb'
// ]

// function useAvlableGame(route: any, endpoint: any) {
//   if (games.includes(route)) {
//     return '/ftb' + endpoint
//   }
//   else {
//     return endpoint
//   }
// }

// Helper function to get the authorization token (adjust as needed)
export function getToken(): string | null {
  return localStorage.getItem('userAccessToken') || null
}

// Set up request headers with authorization token
api.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Helper function to handle API errors
export function handleApiError(error: AxiosError<ApiError>): any {
  if (error.response) {
    console.error('API Error:', error.response.status, error.response.data)
    if (error?.response?.data) {
      if (error?.response?.data?.error) {
        return error?.response?.data?.error
      }

      if (Array.isArray(error?.response?.data)) {
        return error?.response?.data
          ?.map((e, i) => (`${i + 1}. ${e?.code} - ${e?.message}` as string).substring(0, 100))
          .join('\n')
      } else if (Array.isArray(error?.response?.data?.errors)) {
        return error?.response?.data?.errors
          ?.map((e, i) => (`${i + 1}. ${e?.rule} - ${e?.message}` as string).substring(0, 100))
          .join('\n')
      } else if (typeof error?.response?.data == 'object') {
        return `${error?.response?.data?.code} - ${error?.response?.data?.message}`?.substring(0, 100)
      }
    }
  } else {
    console.error('Network Error:', error.message)
    return error?.message
  }
}

interface GetParams {
  query?: any
}

// Define API methods

export async function get<T>(endpoint: string, options?: GetParams): Promise<T | any> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(endpoint, { params: options?.query })
    return response.data as any
  } catch (error: any) {
    throw handleApiError(error)
  }
}

export async function post<T>(endpoint: string, data: any, opt?: PostPutOpt): Promise<T | any> {
  try {
    if (opt?.formData) {
      api.interceptors.request.use(config => {
        config.headers['Content-Type'] = 'multipart/form-data'
        return config
      })
    }
    const response: AxiosResponse<ApiResponse<T>> = await api.post(endpoint, data)
    return response.data as any
  } catch (error: any) {
    console.log(error)

    throw handleApiError(error)
  }
}

export interface PostPutOpt {
  formData?: boolean
}
export async function put<T>(endpoint: string, data: any, opt?: PostPutOpt): Promise<T | any> {
  try {
    if (opt?.formData) {
      api.interceptors.request.use(config => {
        config.headers['Content-Type'] = 'multipart/form-data'
        return config
      })
    }

    const response: AxiosResponse<ApiResponse<T>> = await api.put(endpoint, data)
    return response.data as any
  } catch (error: any) {
    console.log(error)
    throw handleApiError(error)
  }
}

export async function patch<T>(endpoint: string, data: any, opt?: PostPutOpt): Promise<T> {
  try {
    if (opt?.formData) {
      api.interceptors.request.use(config => {
        config.headers['Content-Type'] = 'multipart/form-data'
        return config
      })
    }
    const response: AxiosResponse<ApiResponse<T>> = await api.patch(endpoint, data)
    return response.data as any
  } catch (error: any) {
    console.log(error)
    throw handleApiError(error)
  }
}

export async function del<T>(endpoint: string): Promise<T | any> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.delete(endpoint)
    return response.data as any
  } catch (error: any) {
    console.log(error)
    throw handleApiError(error)
  }
}

const Api = {
  get,
  post,
  put,
  patch,
  del
}

export default Api
// You can add an upload function if needed

// Example usage:
// const responseData = await get<MyDataType>('/endpoint');
// const postDataResponse = await post<MyResponseType>('/postEndpoint', { key: 'value' });
