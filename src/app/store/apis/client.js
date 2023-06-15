import axios from './index'
import {client_token} from '../../constants/token'

export function updateAccountApi(params) {
  return axios.post(`/client/account/update`, params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function fetchAccountApi(params) {
  return axios.post(`/client/getUser`, params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function changePasswordApi(params) {
  return axios.post('/client/changePassword', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function updateOrderApi(params) {
  return axios.post('/client/updateOrder', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function fetchOrdersApi(params) {
  return axios.post('/client/getOrders', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function fetchCurrentOrderApi(params) {
  return axios.post('/client/fetchCurrentOrder', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function SendEmailforgotPassword(params) {
  return axios.post('/client/emailOtpForgotPassword', params, {
    headers: {
      'content-type': 'text/json',
    },
  })
}

export function SendCodeResetPassword(params) {
  return axios.post('/client/resetPassword', params, {
    headers: {
      'content-type': 'text/json',
    },
  })
}

export function outstandPayApi(params) {
  return axios.post('/client/outstand-pay', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function retrievalPayApi(params) {
  return axios.post('/client/retrieval-pay', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function extendDateApi(params) {
  return axios.post('client/extend-date', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function fetchRetrievalDatesApi() {
  return axios.get('client/retrieval-dates', {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}

export function fetchRetrievalLimitApi(params) {
  return axios.post('client/retrieval-limit', params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${client_token}`,
    },
  })
}
