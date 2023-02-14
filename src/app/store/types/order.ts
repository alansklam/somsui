export interface OrderState {
    paymentMethod: any;
    todos: any[];
    loading: boolean;
    error: null | string;
    page: number;
    limit: number;
}

export enum OrderActionTypes {
    FETCH_DATA = 'FETCH_DATA',
    GET_PAYMENT_METHOD = 'GET_PAYMENT_METHOD',
}

interface FetchData {
    type: OrderActionTypes.FETCH_DATA,
}
interface GetPaymentMethod {
    type: OrderActionTypes.GET_PAYMENT_METHOD,
    payload: any;
}

export enum TodoActionTypes {
    FETCH_TODOS= 'FETCH_TODOS',
    FETCH_TODOS_SUCCESS= 'FETCH_TODOS_SUCCESS',
    FETCH_TODOS_ERROR= 'FETCH_TODOS_ERROR',
    SET_TODO_PAGE = 'SET_TODO_PAGE'
}
interface FetchTodoAction {
    type: TodoActionTypes.FETCH_TODOS
}
interface FetchTodoSuccessAction {
    type: TodoActionTypes.FETCH_TODOS_SUCCESS;
    payload: any[];
}
interface FetchTodoErrorAction {
    type: TodoActionTypes.FETCH_TODOS_ERROR;
    payload: string;
}
interface SetTodoPage {
    type: TodoActionTypes.SET_TODO_PAGE;
    payload: number;
}

export type TodoAction =
    FetchTodoAction
    | FetchTodoErrorAction
    | FetchTodoSuccessAction
    | SetTodoPage

export type OrderAction = 
    GetPaymentMethod
    | FetchData