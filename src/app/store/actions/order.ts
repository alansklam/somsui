import {Dispatch} from "redux";
import axios from "axios";
import {TodoAction, TodoActionTypes, OrderAction, OrderActionTypes} from "../types/order";
import { getPaymentMethodApi } from "../apis/ordering";

export const fetchTodos = (page = 1, limit = 10) => {
    return async (dispatch: Dispatch<TodoAction>) => {
        try {
            dispatch({type: TodoActionTypes.FETCH_TODOS})
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos', {
                params: {_page: page, _limit: limit}
            })
            setTimeout(() => {
                dispatch({type: TodoActionTypes.FETCH_TODOS_SUCCESS, payload: response.data})
            }, 500)
        } catch (e) {
            dispatch({
                type: TodoActionTypes.FETCH_TODOS_ERROR,
                payload: 'Произошла ошибка при загрузке списка дел'
            })
        }
    }
}
export function setTodoPage(page: number): TodoAction {
    return {type: TodoActionTypes.SET_TODO_PAGE, payload: page}
}

export const getPaymentMethod = () => {
    return async(dispatch: Dispatch<OrderAction>) => {
        try {
            // dispatch({type: OrderActionTypes.FETCH_DATA})
            const response = getPaymentMethodApi();
            const payloadData = (await response).data;
            dispatch({
                type: OrderActionTypes.GET_PAYMENT_METHOD,
                payload: payloadData,
            })
        } catch {
            dispatch({
                type: OrderActionTypes.GET_PAYMENT_METHOD,
                payload: [],
            })
        }
    }
}