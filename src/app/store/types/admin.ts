export interface AdminState {
  universities: any[];
  products: any[],
  ref: any,
  periods: any[],
  items: any[],
  clients: any[],
  promotions: any[],
  payments: any[],
  orders: any[],
  retrievalOrders: any[],
  pagination: any,
  loading: boolean;
  error: null | string;
}

export enum AdminActionTypes {
  FETCH_DATA_ADMIN = 'FETCH_DATA_ADMIN',
  FETCH_UNVERSITIES = 'FETCH_UNVERSITIES',
  FETCH_DASHBOARD_DATA = 'FETCH_DASHBOARD_DATA',
  FETCH_PRODUCTS = 'FETCH_PRODUCTS',
  FETCH_PERIODS = 'FETCH_PERIODS',
  FETCH_ITEMS = 'FETCH_ITEMS',
  FETCH_CLIENTS = 'FETCH_CLIENTS',
  FETCH_PROMOTIONS = 'FETCH_PROMOTIONS',
  FETCH_PAYMENTS = 'FETCH_PAYMENTS',
  FETCH_ORDERS = 'FETCH_ORDERS',
  FETCH_RETRIEVAL_ORDERS = 'FETCH_RETRIEVAL_ORDERS',
  FETCH_REF = 'FETCH_REF',
}
interface FetchDataAdminAction {
  type: AdminActionTypes.FETCH_DATA_ADMIN;
}
interface FetchUniversities {
  type: AdminActionTypes.FETCH_UNVERSITIES;
  payload: any;
}
interface fetchDashboardData {
  type: AdminActionTypes.FETCH_DASHBOARD_DATA;
  payload: any;
}
interface FetchProducts {
  type: AdminActionTypes.FETCH_PRODUCTS;
  payload: any;
}
interface FetchRef {
  type: AdminActionTypes.FETCH_REF;
  payload: any;
}
interface fetchPeriods {
  type: AdminActionTypes.FETCH_PERIODS;
  payload: any;
}
interface fetchItems {
  type: AdminActionTypes.FETCH_ITEMS;
  payload: any;
}
interface fetchClients {
  type: AdminActionTypes.FETCH_CLIENTS;
  payload: any;
}
interface fetchPromotions {
  type: AdminActionTypes.FETCH_PROMOTIONS;
  payload: any;
}
interface fetchPayments {
  type: AdminActionTypes.FETCH_PAYMENTS;
  payload: any;
}
interface fetchOrders {
  type: AdminActionTypes.FETCH_ORDERS;
  payload: any;
}
interface fetchRetrievalOrders {
  type: AdminActionTypes.FETCH_RETRIEVAL_ORDERS;
  payload: any;
}


export type AdminAction =
  FetchDataAdminAction
  | FetchUniversities
  | fetchDashboardData
  | FetchProducts
  | fetchPeriods
  | fetchItems
  | fetchClients
  | fetchPromotions
  | fetchPayments
  | fetchOrders
  | fetchRetrievalOrders
  | FetchRef