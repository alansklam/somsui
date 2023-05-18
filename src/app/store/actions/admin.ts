import {Dispatch} from 'redux'
import {AdminAction, AdminActionTypes} from '../types/admin'
import {
  fetchPeriodsApi,
  fetchItemsApi,
  fetchUniversitiesApi,
  fetchClientsApi,
  fetchPromotionsApi,
  fetchPaymentsApi,
  fetchOrdersApi,
  fetchRetrievalOrdersApi,
  fetchRetrievalDatesApi,
  fetchProductsApi,
  fetchRefApi,
} from '../apis/admin'

export const fetchUniversities = (): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchUniversitiesApi()
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_UNIVERSITIES, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_UNIVERSITIES,
        payload: [],
      })
    }
  }
}

export const fetchProducts = (): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchProductsApi()
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_PRODUCTS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_PRODUCTS,
        payload: [],
      })
    }
  }
}

export const fetchDashboardData = (): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchProductsApi()
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_DASHBOARD_DATA, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_DASHBOARD_DATA,
        payload: [],
      })
    }
  }
}

export const fetchRef = (): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchRefApi()
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_REF, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_REF,
        payload: [],
      })
    }
  }
}

export const fetchPeriods = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchPeriodsApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_PERIODS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_PERIODS,
        payload: [],
      })
    }
  }
}

export const fetchItems = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchItemsApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_ITEMS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_ITEMS,
        payload: [],
      })
    }
  }
}

export const fetchClients = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchClientsApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_CLIENTS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_CLIENTS,
        payload: [],
      })
    }
  }
}

export const fetchPromotions = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchPromotionsApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_PROMOTIONS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_PROMOTIONS,
        payload: [],
      })
    }
  }
}

export const fetchPayments = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchPaymentsApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_PAYMENTS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_PAYMENTS,
        payload: [],
      })
    }
  }
}

export const fetchOrders = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchOrdersApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_ORDERS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_ORDERS,
        payload: [],
      })
    }
  }
}

export const fetchRetrievalOrders = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchRetrievalOrdersApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_RETRIEVAL_ORDERS, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_RETRIEVAL_ORDERS,
        payload: [],
      })
    }
  }
}

export const fetchRetrievalDates = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.FETCH_DATA_ADMIN})
      const response = fetchRetrievalDatesApi(params)
      const payloadData = (await response).data
      dispatch({type: AdminActionTypes.FETCH_RETRIEVAL_DATES, payload: payloadData})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.FETCH_RETRIEVAL_DATES,
        payload: [],
      })
    }
  }
}

export const updateClientsFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_CLIENTS_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_CLIENTS_FILTER_DATA,
        payload: {},
      })
    }
  }
}

export const updateOrdersFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_ORDERS_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_ORDERS_FILTER_DATA,
        payload: {},
      })
    }
  }
}

export const updateRetrievalFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_RETRIEVAL_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_RETRIEVAL_FILTER_DATA,
        payload: {},
      })
    }
  }
}

export const updatePeriodsFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_PERIODS_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_PERIODS_FILTER_DATA,
        payload: {},
      })
    }
  }
}

export const updatePromotionsFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_PROMOTIONS_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_PROMOTIONS_FILTER_DATA,
        payload: {},
      })
    }
  }
}

export const updatePaymentsFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_PAYMENTS_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_PAYMENTS_FILTER_DATA,
        payload: {},
      })
    }
  }
}

export const updateItemsFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_ITEMS_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_ITEMS_FILTER_DATA,
        payload: {},
      })
    }
  }
}

export const updateFilterData = (params: any): any => {
  return async (dispatch: Dispatch<AdminAction>) => {
    try {
      dispatch({type: AdminActionTypes.UPDATE_FILTER_DATA, payload: params})
    } catch (e) {
      dispatch({
        type: AdminActionTypes.UPDATE_FILTER_DATA,
        payload: {},
      })
    }
  }
}
