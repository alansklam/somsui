import axios from './index'
import {getAdminToken} from '../../constants/token'

export function adminLoginApi(param) {
  return axios.post(`/admin/auth/login`, param, {
    headers: {
      'content-type': 'text/json',
    },
  })
}

export function fetchUniversitiesApi() {
  return axios.get(`/admin/fetchUniversities`, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
  })
}

export function fetchDashboardDataApi() {
  return axios.get(`/admin/fetchDashboardData`, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
  })
}

export function fetchClientNameApi() {
  return axios.get(`/admin/fetchClientName`, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
  })
}

export function fetchProductsApi() {
  return axios.get(`/admin/fetchProducts`, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
  })
}

export function fetchRefApi() {
  return axios.get(`/admin/fetchRef`, {
    headers: {
      'content-type': 'text/json',
      Authorization: `Bearer ${getAdminToken()}`,
    },
  })
}

export function fetchClientsApi(params) {
  return axios.post(
    `/admin/fetchClients`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function getClientApi(params) {
  return axios.post(
    `/admin/getClient`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deleteClientApi(params) {
  return axios.post(
    `/admin/deleteClient`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editClientApi(params) {
  return axios.post(
    `/admin/editClient`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchItemsApi(params) {
  return axios.post(
    `/admin/fetchItems`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editItemsApi(params) {
  return axios.post(
    `/admin/editItem`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deleteItemsApi(params) {
  return axios.post(
    `/admin/deleteItem`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchPeriodsApi(params) {
  return axios.post(
    `/admin/fetchPeriods`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editPeriodsApi(params) {
  return axios.post(
    `/admin/editPeriod`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editPeriodItemApi(params) {
  return axios.post(
    `/admin/editPeriodItem`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function getPeriodItemApi(params) {
  return axios.post(
    `/admin/getPeriodItem`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deletePeriodsApi(params) {
  return axios.post(
    `/admin/deletePeriod`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchSettingsApi(params) {
  return axios.post(
    `/admin/fetchSettings`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editSettingsApi(params) {
  return axios.post(
    `/admin/editSetting`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deleteSettingsApi(params) {
  return axios.post(
    `/admin/deleteSetting`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchPaymentsApi(params) {
  return axios.post(
    `/admin/fetchPayments`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deletePaymentsApi(params) {
  return axios.post(
    `/admin/deletePayment`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editPaymentsApi(params) {
  return axios.post(
    `/admin/editPayment`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function paymentPaidApi(params) {
  return axios.post(
    `/admin/payment/paid`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function paymentCancelledApi(params) {
  return axios.post(
    `/admin/payment/cancelled`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchPromotionsApi(params) {
  return axios.post(
    `/admin/fetchPromotions`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editPromotionApi(params) {
  return axios.post(
    `/admin/editPromotion`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editPromotionItemApi(params) {
  return axios.post(
    `/admin/editPromotionItem`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function getPromotionApi(params) {
  return axios.post(
    `/admin/getPromotion`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deletePromotionApi(params) {
  return axios.post(
    `/admin/deletePromotion`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchOrdersApi(params) {
  return axios.post(
    `/admin/fetchOrders`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editOrderApi(params) {
  return axios.post(
    `/admin/editOrder`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function getOrderApi(params) {
  return axios.post(
    `/admin/getOrder`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deleteOrderApi(params) {
  return axios.post(
    `/admin/deleteOrder`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchRetrievalOrdersApi(params) {
  return axios.post(
    `/admin/fetchRetrievalOrders`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editRetrievalOrderApi(params) {
  return axios.post(
    `/admin/editRetrievalOrder`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function getRetrievalOrderApi(params) {
  return axios.post(
    `/admin/getRetrievalOrder`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deleteRetrievalOrderApi(params) {
  return axios.post(
    `/admin/deleteRetrievalOrder`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function fetchRetrievalDatesApi(params) {
  return axios.post(
    `/admin/fetchRetrievalDates`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function editRetrievalDateApi(params) {
  return axios.post(
    `/admin/editRetrievalDate`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function deleteRetrievalDateApi(params) {
  return axios.post(
    `/admin/deleteRetrievalDate`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function sendInvoiceApi(params) {
  return axios.post(
    `/admin/sendInvoice`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}

export function searchClientApi(params) {
  return axios.post(
    `/admin/searchClient`,
    {...params},
    {
      headers: {
        'content-type': 'text/json',
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  )
}
