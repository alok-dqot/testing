import axios from 'axios'

import api from 'src/configs/api';
const API_URL = api.baseUrl;

// Login user
const getAll = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const u = new URLSearchParams(data).toString();
  const response = await axios.get(API_URL + '/faqs?' + u, config)
  return response.data
}

const create = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL + '/faqs', data, config)
  console.log('response', response);
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
  const response = await axios.put(API_URL + '/faqs/' + id, data, config)
  return response.data
}

const deleteRow = async (token, id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.delete(API_URL + '/faqs/' + id, config)
  console.log('response', response);
  return response.data
}

const faqsService = {
  getAll, create, update, deleteRow
}

export default faqsService
