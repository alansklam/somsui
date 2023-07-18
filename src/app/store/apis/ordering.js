import {getClientToken} from '../../constants/token'
import axios from './index'

export function getIsLoggedIn() {
  return axios.get(`/is_login`, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${getClientToken()}`,
    },
  })
}

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
      Authorization: `Bearer ${getClientToken()}`,
    },
  })
}

export function yedpayOrderSubmit(params) {
  return axios.post(`/yedpayOrder`, params, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${getClientToken()}`,
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
      Authorization: `Bearer ${getClientToken()}`,
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
