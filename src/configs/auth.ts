import api from './api'


export default {
  meEndpoint: api.baseUrl + '/users/me',
  loginEndpoint: api.baseUrl + '/users/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'userAccessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  registerEndPoint: api.baseUrl + '/users/register/otp',
  resetEndPoint: api.baseUrl + '/users/forgotPassword',
}
