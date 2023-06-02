export interface AdminState {
  universities: any[]
  products: any[]
  ref: any
  periods: any
  settings: any
  items: any
  clients: any
  promotions: any
  payments: any
  orders: any
  retrievalOrders: any
  retrievalDates: any
  filterData: any
  pagination: any
  loading: boolean
  error: null | string
}

export enum AdminActionTypes {
  FETCH_DATA_ADMIN = 'FETCH_DATA_ADMIN',
  FETCH_UNIVERSITIES = 'FETCH_UNIVERSITIES',
  FETCH_DASHBOARD_DATA = 'FETCH_DASHBOARD_DATA',
  FETCH_PRODUCTS = 'FETCH_PRODUCTS',
  FETCH_PERIODS = 'FETCH_PERIODS',
  UPDATE_PERIODS_FILTER_DATA = 'UPDATE_PERIODS_FILTER_DATA',
  FETCH_SETTINGS = 'FETCH_SETTINGS',
  UPDATE_SETTINGS_FILTER_DATA = 'UPDATE_SETTINGS_FILTER_DATA',
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
  FETCH_RETRIEVAL_DATES = 'FETCH_RETRIEVAL_DATES',
  UPDATE_RETRIEVAL_DATE_FILTER_DATA = 'UPDATE_RETRIEVAL_DATE_FILTER_DATA',
  FETCH_REF = 'FETCH_REF',
  UPDATE_FILTER_DATA = 'UPDATE_FILTER_DATA',
}
interface FetchDataAdminAction {
  type: AdminActionTypes.FETCH_DATA_ADMIN
}
interface FetchUniversities {
  type: AdminActionTypes.FETCH_UNIVERSITIES
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
interface fetchSettings {
  type: AdminActionTypes.FETCH_SETTINGS
  payload: any
}
interface UpdateSettingsFilterData {
  type: AdminActionTypes.UPDATE_SETTINGS_FILTER_DATA
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
interface UpdatePromotionsFilterData {
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
interface fetchRetrievalDates {
  type: AdminActionTypes.FETCH_RETRIEVAL_DATES
  payload: any
}
interface UpdateRetrievalDateFilterData {
  type: AdminActionTypes.UPDATE_RETRIEVAL_DATE_FILTER_DATA
  payload: any
}
interface UpdateFilterData {
  type: AdminActionTypes.UPDATE_FILTER_DATA
  payload: any
}

export type AdminAction =
  | FetchDataAdminAction
  | FetchUniversities
  | fetchDashboardData
  | FetchProducts
  | fetchPeriods
  | UpdatePeriodsFilterData
  | fetchSettings
  | UpdateSettingsFilterData
  | fetchItems
  | UpdateItemsFilterData
  | fetchClients
  | UpdateClientsFilterData
  | fetchPromotions
  | UpdatePromotionsFilterData
  | fetchPayments
  | UpdatePaymentsFilterData
  | fetchOrders
  | UpdateOrdersFilterData
  | fetchRetrievalOrders
  | UpdateRetrievalFilterData
  | fetchRetrievalDates
  | UpdateRetrievalDateFilterData
  | FetchRef
  | UpdateFilterData
