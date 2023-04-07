export interface AdminState {
  universities: any[]
  products: any[]
  ref: any
  periods: any
  items: any
  clients: any
  promotions: any
  payments: any
  orders: any
  retrievalOrders: any
  filterData: any
  pagination: any
  loading: boolean
  error: null | string
}

export enum AdminActionTypes {
  FETCH_DATA_ADMIN = 'FETCH_DATA_ADMIN',
  FETCH_UNVERSITIES = 'FETCH_UNVERSITIES',
  FETCH_DASHBOARD_DATA = 'FETCH_DASHBOARD_DATA',
  FETCH_PRODUCTS = 'FETCH_PRODUCTS',
  FETCH_PERIODS = 'FETCH_PERIODS',
  UPDATE_PERIODS_FILTER_DATA = 'UPDATE_PERIODS_FILTER_DATA',
  FETCH_ITEMS = 'FETCH_ITEMS',
  UPDATE_ITEMS_FILTER_DATA = 'UPDATE_ITEMS_FILTER_DATA',
  FETCH_CLIENTS = 'FETCH_CLIENTS',
  UPDATE_CLIENTS_FILTER_DATA = 'UPDATE_CLIENTS_FILTER_DATA',
  FETCH_PROMOTIONS = 'FETCH_PROMOTIONS',
  UPDATE_PROMOTIONS_FILTER_DATA = 'UPDATE_PROMOTIONS_FILTER_DATA',
  FETCH_PAYMENTS = 'FETCH_PAYMENTS',
  UPDATE_PAYMENTS_FILTER_DATA = 'UPDATE_PAYMENTS_FILTER_DATA',
  FETCH_ORDERS = 'FETCH_ORDERS',
  UPDATE_ORDERS_FILTER_DATA = 'UPDATE_ORDERS_FILTER_DATA',
  FETCH_RETRIEVAL_ORDERS = 'FETCH_RETRIEVAL_ORDERS',
  UPDATE_RETRIEVAL_FILTER_DATA = 'UPDATE_RETRIEVAL_FILTER_DATA',
  FETCH_REF = 'FETCH_REF',
}
interface FetchDataAdminAction {
  type: AdminActionTypes.FETCH_DATA_ADMIN
}
interface FetchUniversities {
  type: AdminActionTypes.FETCH_UNVERSITIES
  payload: any
}
interface fetchDashboardData {
  type: AdminActionTypes.FETCH_DASHBOARD_DATA
  payload: any
}
interface FetchProducts {
  type: AdminActionTypes.FETCH_PRODUCTS
  payload: any
}
interface FetchRef {
  type: AdminActionTypes.FETCH_REF
  payload: any
}
interface fetchPeriods {
  type: AdminActionTypes.FETCH_PERIODS
  payload: any
}
interface UpdatePeriodsFilterData {
  type: AdminActionTypes.UPDATE_PERIODS_FILTER_DATA
  payload: any
}
interface fetchItems {
  type: AdminActionTypes.FETCH_ITEMS
  payload: any
}
interface UpdateItemsFilterData {
  type: AdminActionTypes.UPDATE_ITEMS_FILTER_DATA
  payload: any
}
interface fetchClients {
  type: AdminActionTypes.FETCH_CLIENTS
  payload: any
}
interface UpdateClientsFilterData {
  type: AdminActionTypes.UPDATE_CLIENTS_FILTER_DATA
  payload: any
}
interface fetchPromotions {
  type: AdminActionTypes.FETCH_PROMOTIONS
  payload: any
}
interface UpdatePromotioinsFilterData {
  type: AdminActionTypes.UPDATE_PROMOTIONS_FILTER_DATA
  payload: any
}
interface fetchPayments {
  type: AdminActionTypes.FETCH_PAYMENTS
  payload: any
}
interface UpdatePaymentsFilterData {
  type: AdminActionTypes.UPDATE_PAYMENTS_FILTER_DATA
  payload: any
}
interface fetchOrders {
  type: AdminActionTypes.FETCH_ORDERS
  payload: any
}
interface UpdateOrdersFilterData {
  type: AdminActionTypes.UPDATE_ORDERS_FILTER_DATA
  payload: any
}
interface fetchRetrievalOrders {
  type: AdminActionTypes.FETCH_RETRIEVAL_ORDERS
  payload: any
}
interface UpdateRetrievalFilterData {
  type: AdminActionTypes.UPDATE_RETRIEVAL_FILTER_DATA
  payload: any
}

export type AdminAction =
  | FetchDataAdminAction
  | FetchUniversities
  | fetchDashboardData
  | FetchProducts
  | fetchPeriods
  | UpdatePeriodsFilterData
  | fetchItems
  | UpdateItemsFilterData
  | fetchClients
  | UpdateClientsFilterData
  | fetchPromotions
  | UpdatePromotioinsFilterData
  | fetchPayments
  | UpdatePaymentsFilterData
  | fetchOrders
  | UpdateOrdersFilterData
  | fetchRetrievalOrders
  | UpdateRetrievalFilterData
  | FetchRef
