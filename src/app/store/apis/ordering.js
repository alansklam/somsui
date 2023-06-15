import axios from './index'
import { client_token } from '../../constants/token'

export function getProducts() {
  return axios.get(`/products`, {})
}

export function getStoragePeriodItem(month) {
  return axios.get(`/prices?months=` + month)
}

export function orderSubmit(params) {
  return axios.post(`/order`, params, {
    headers: {
      'content-type': 'text/json',
      'Authorization' : `Bearer ${client_token}`,
    },
  })
}

export function yedpayOrderSubmit(params) {
  return axios.post(`/yedpayOrder`, params, {
    headers: {
      'content-type': 'text/json',
      'Authorization' : `Bearer ${client_token}`,
    },
  })
}

export function promoCodeValidate(params) {
  return axios.post(`/promo-code`, params, {
    headers: {
      'content-type': 'text/json',
    },
  })
}

export function payConfirm(params) {
  return axios.post(`/yedpay`, params, {
    headers: {
      'content-type': 'text/json',
      'Authorization' : `Bearer ${client_token}`,
    },
  })
}

export function getPaymentMethodApi() {
  return axios.post(`/getPaymentMethod`, {
    headers: {
      'content-type': 'text/json',
    },
  })
}
