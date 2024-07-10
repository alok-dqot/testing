import axios from 'axios'

import api from 'src/configs/api';
const API_URL = api.baseUrl;

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + '/users/login', userData)
  console.log('response', response);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('token', JSON.stringify(response.data.data.token));
    localStorage.setItem('role', JSON.stringify(response.data.data.user.role));
  }

  return response.data
}
const signup = async (userData) => {
  const response = await axios.post(API_URL + '/users/register/otp', userData)
  console.log('response', response);
  if (response.data) {

  }

  return response.data
}

const signupOTP = async (userData) => {
  const response = await axios.post(API_URL + '/users/register', userData)
  console.log('response', response);
  if (response.data) {

  }

  return response.data
}

const me = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + '/me', config)
  return response.data
}

const update = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  let id = data.id;
  delete data.id;
  const response = await axios.post(API_URL + '/users/update/' + id, data, config)
  if (response.data) {
    console.log('response', response)
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('role', JSON.stringify(response.data.data.user.role));
  }
  return response.data
}

const changepassword = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + '/users/changePassword', data, config)
  console.log('response', response)
  return response.data
}

const forgotPassword = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + '/users/forgotPassword', data, config)
  console.log('response', response)
  return response.data
}
const resetPassword = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + '/users/resetPassword', data, config)
  console.log('response', response)
  return response.data
}
const generateKey = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + '/users/accessKey', data, config)
  console.log('response', response)
  return response.data
}
const generateToken = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + '/users/token', data, config)
  if (response && response.data && response.data.data && response.data.data.token) {
    localStorage.setItem('subscription_token', JSON.stringify(response.data.data.token));
  }
  console.log('response', response)
  return response.data
}
const getAccessKeys = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + '/users/accessKey', config)
  return response.data
}
const getSubscriptions = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  let id = data.id;
  const response = await axios.get(API_URL + '/users/subscriptions/' + id, config)
  return response.data
}
// Logout user
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}

const authService = {
  logout,
  login,
  signup,
  signupOTP,
  me,
  update,
  changepassword,
  forgotPassword,
  resetPassword,
  generateKey,
  generateToken,
  getAccessKeys,
  getSubscriptions
}

export default authService
