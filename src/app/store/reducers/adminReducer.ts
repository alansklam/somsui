import {AdminAction, AdminActionTypes, AdminState} from '../types/admin'

const initialState: AdminState = {
  universities: [],
  products: [],
  ref: {},
  periods: {
    data: [],
    pagination: {
      total: 10,
      perPage: 10,
      page: 1,
      orderBy: undefined,
      sort: undefined,
    },
    filterData: {},
  },
  items: {
    data: [],
    pagination: {
      total: 10,
      perPage: 10,
      page: 1,
      orderBy: undefined,
      sort: undefined,
    },
    filterData: {},
  },
  clients: {
    data: [],
    pagination: {
      total: 10,
      perPage: 10,
      page: 1,
      orderBy: undefined,
      sort: undefined,
    },
    filterData: {},
  },
  promotions: {
    data: [],
    pagination: {
      total: 10,
      perPage: 10,
      page: 1,
      orderBy: undefined,
      sort: undefined,
    },
    filterData: {},
  },
  payments: {
    data: [],
    pagination: {
      total: 10,
      perPage: 10,
      page: 1,
      orderBy: undefined,
      sort: undefined,
    },
    filterData: {},
  },
  orders: {
    data: [],
    pagination: {
      total: 10,
      perPage: 10,
      page: 1,
      orderBy: undefined,
      sort: undefined,
      code: '',
    },
    filterData: {},
  },
  retrievalOrders: {
    data: [],
    pagination: {
      total: 10,
      perPage: 10,
      page: 1,
      orderBy: undefined,
      sort: undefined,
    },
    filterData: {},
  },
  pagination: {},
  filterData: {},
  error: null,
  loading: false,
}

export const adminReducer = (state = initialState, action: AdminAction): AdminState => {
  switch (action.type) {
    case AdminActionTypes.FETCH_DATA_ADMIN:
      return {...state, loading: true}
    case AdminActionTypes.FETCH_UNVERSITIES:
      return {...state, loading: false, universities: action.payload}
    case AdminActionTypes.FETCH_REF:
      return {...state, loading: false, ref: action.payload}
    case AdminActionTypes.FETCH_PRODUCTS:
      return {...state, loading: false, products: action.payload}
    case AdminActionTypes.FETCH_PERIODS:
      return {
        ...state,
        loading: false,
        periods: {
          ...state.periods,
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
        // periods: action.payload.data,
        // pagination: action.payload.pagination,
      }
    case AdminActionTypes.UPDATE_PERIODS_FILTER_DATA:
      return {
        ...state,
        periods: {
          ...state.periods,
          filterData: action.payload,
        },
      }
    case AdminActionTypes.FETCH_ITEMS:
      return {
        ...state,
        loading: false,
        items: {
          ...state.items,
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
        // items: action.payload.data,
        // pagination: action.payload.pagination,
      }
    case AdminActionTypes.UPDATE_ITEMS_FILTER_DATA:
      return {
        ...state,
        items: {
          ...state.items,
          filterData: action.payload,
        },
      }
    case AdminActionTypes.FETCH_CLIENTS:
      return {
        ...state,
        loading: false,
        clients: {
          ...state.clients,
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
        // clients: action.payload.data,
        // pagination: action.payload.pagination,
      }
    case AdminActionTypes.UPDATE_CLIENTS_FILTER_DATA:
      return {
        ...state,
        clients: {
          ...state.clients,
          filterData: action.payload,
        },
      }
    case AdminActionTypes.FETCH_PROMOTIONS:
      return {
        ...state,
        loading: false,
        promotions: {
          ...state.promotions,
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
        // promotions: action.payload.data,
        // pagination: action.payload.pagination,
      }
    case AdminActionTypes.UPDATE_PROMOTIONS_FILTER_DATA:
      return {
        ...state,
        promotions: {
          ...state.promotions,
          filterData: action.payload,
        },
      }
    case AdminActionTypes.FETCH_PAYMENTS:
      return {
        ...state,
        loading: false,
        payments: {
          ...state.payments,
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
        // payments: action.payload.data,
        // pagination: action.payload.pagination,
      }
    case AdminActionTypes.UPDATE_PAYMENTS_FILTER_DATA:
      return {
        ...state,
        payments: {
          ...state.payments,
          filterData: action.payload,
        },
      }
    case AdminActionTypes.FETCH_ORDERS:
      return {
        ...state,
        loading: false,
        orders: {
          ...state.orders,
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
        // orders: action.payload.data,
        // pagination: action.payload.pagination
      }
    case AdminActionTypes.UPDATE_ORDERS_FILTER_DATA:
      return {
        ...state,
        orders: {
          ...state.orders,
          filterData: action.payload,
        },
      }
    case AdminActionTypes.FETCH_RETRIEVAL_ORDERS:
      return {
        ...state,
        loading: false,
        retrievalOrders: {
          ...state.retrievalOrders,
          data: action.payload.data,
          pagination: action.payload.pagination,
        },
        // retrievalOrders: action.payload.data,
        // pagination: action.payload.pagination,
      }
    case AdminActionTypes.UPDATE_RETRIEVAL_FILTER_DATA:
      return {
        ...state,
        retrievalOrders: {
          ...state.retrievalOrders,
          filterData: action.payload,
        },
      }
    default:
      return state
  }
}
