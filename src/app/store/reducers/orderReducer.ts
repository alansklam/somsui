import {OrderAction, OrderActionTypes, OrderState} from "../types/order";

const initialState: OrderState = {
    paymentMethod: [],
    todos: [],
    page: 1,
    error: null,
    limit: 10,
    loading: false
}

export const orderReducer = (state = initialState, action: OrderAction): OrderState => {
    switch (action.type) {
        case OrderActionTypes.FETCH_DATA:
            return {...state, loading: true}
        case OrderActionTypes.GET_PAYMENT_METHOD:
            return {...state, loading: false, paymentMethod: action.payload}
        default:
            return state
    }
}
