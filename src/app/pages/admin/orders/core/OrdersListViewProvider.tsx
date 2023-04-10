import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  Dispatch,
  SetStateAction,
} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {WithChildren} from '../../../../../_metronic/helpers'
import {RootState} from '../../../../store/reducers'
import {fetchOrders} from '../../../../store/actions/admin'
import {useSearchParams} from 'react-router-dom'
import {updateFilterData} from '../../../../store/actions/admin'

type pagination = {
  total: number
  perPage: number
  page: number
  orderBy: string | undefined
  sort: string | undefined
  code: string
}

type client = {
  id?: number
  name?: string
  email?: string
  contact?: number | null
  wechat?: string
  student_id?: string
  address1?: string
  university_id?: string
}

type paymentStatus = {
  code?: string
}

type ListViewContextProps = {
  uid: string | undefined | null
  clientId: string | undefined | null
  data: {
    id: number
    code: string
    emptyout_location_other: string
    emptyout_date_other: string
    emptyout_time_other: string
    checkin_location_other: string
    checkin_date_other: string
    checkin_time_other: string
    checkout_location_other: string
    checkout_date_other: string
    checkout_time_other: string
    paid_fee: string
    special_instruction: string
    payment_status_id: number
    payment_type_id: number
    order_status_id: number
    total_fee: string
    storage_month: string
    client: client
    status: paymentStatus
    items: any[]
  }[]
  selected: any[]
  setSelected: Dispatch<SetStateAction<any[]>>
  itemIdForUpdate: undefined | null | number
  setItemIdForUpdate: Dispatch<SetStateAction<undefined | null | number>>
  clientIdForUpdate: undefined | null | number
  setClientIdForUpdate: Dispatch<SetStateAction<undefined | null | number>>
  orderIdForUpdate: undefined | null | number
  setOrderIdForUpdate: Dispatch<SetStateAction<undefined | null | number>>
  itemIdForDelete: undefined | null | number | any[]
  setItemIdForDelete: Dispatch<SetStateAction<undefined | null | number | any[]>>
  pagination: pagination
  setPagination: Dispatch<SetStateAction<pagination>>
  isAllSelected: boolean
  isLoading: boolean
  fetchOrdersFunc: Function
  filterData: {
    name: string
    email: string
    contact: string
    wechat: string
    student_id: string
    code: string
    emptyDateStart: string
    emptyDateEnd: string
    checkinDateStart: string
    checkinDateEnd: string
    checkoutDateStart: string
    checkoutDateEnd: string
    status: {
      new: boolean
      inProgress: boolean
      emptyDelivery: boolean
      schedCheckin: boolean
      checkin: boolean
      schedCheckout: boolean
      checkout: boolean
      schedEmptyReturn: boolean
      completed: boolean
      hold: boolean
      cancelled: boolean
    }
    menu: string
  }
  setFilterData: Dispatch<SetStateAction<any>>
}

const initialListView = {
  uid: '',
  clientId: '',
  data: [],
  selected: [],
  setSelected: () => {},
  itemIdForUpdate: undefined,
  setItemIdForUpdate: () => {},
  clientIdForUpdate: undefined,
  setClientIdForUpdate: () => {},
  orderIdForUpdate: undefined,
  setOrderIdForUpdate: () => {},
  itemIdForDelete: undefined,
  setItemIdForDelete: () => {},
  pagination: {
    total: 10,
    perPage: 10,
    page: 1,
    orderBy: undefined,
    sort: undefined,
    code: '',
  },
  setPagination: () => {},
  isAllSelected: false,
  isLoading: false,
  fetchOrdersFunc: () => {},
  filterData: {
    name: '',
    email: '',
    contact: '',
    wechat: '',
    student_id: '',
    code: '',
    emptyDateStart: '',
    emptyDateEnd: '',
    checkinDateStart: '',
    checkinDateEnd: '',
    checkoutDateStart: '',
    checkoutDateEnd: '',
    status: {
      new: false,
      inProgress: false,
      emptyDelivery: false,
      schedCheckin: false,
      checkin: false,
      schedCheckout: false,
      checkout: false,
      schedEmptyReturn: false,
      completed: false,
      hold: false,
      cancelled: false,
    },
    menu: 'orders',
  },
  setFilterData: () => {},
}

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const calculateIsAllDataSelected = (__data: any[], __selected: any[]) => {
  if (!__data) {
    return false
  }
  return __data.length > 0 && __data.length === __selected.length
}

const OrdersListViewProvider: FC<WithChildren> = ({children}) => {
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid')
  const statusId = searchParams.get('order_status_id')
  const clientId = searchParams.get('client_id')
  const dispatch = useDispatch()
  const [selected, setSelected] = useState(Array(0))
  const [itemIdForUpdate, setItemIdForUpdate] = useState<undefined | null | number>(
    initialListView.itemIdForUpdate
  )
  const [itemIdForDelete, setItemIdForDelete] = useState<undefined | null | number | any[]>(
    initialListView.itemIdForUpdate
  )
  const [clientIdForUpdate, setClientIdForUpdate] = useState<undefined | null | number>(
    initialListView.clientIdForUpdate
  )
  const [orderIdForUpdate, setOrderIdForUpdate] = useState<undefined | null | number>(
    initialListView.orderIdForUpdate
  )
  const [pagination, setPagination] = useState<pagination>(initialListView.pagination)
  const isLoading = useSelector((state: RootState) => state.admin.loading)
  const data = useSelector((state: RootState) => state.admin.orders.data)
  const page = useSelector((state: RootState) => state.admin.orders.pagination)
  const filter = useSelector((state: RootState) => state.admin.filterData)
  // const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])
  const [filterData, setFilterData] = useState({
    ...initialListView.filterData,
    status: {
      ...initialListView.filterData.status,
      new: statusId === '1' ? true : false,
      checkin: statusId === '16' ? true : false,
      schedCheckout: statusId === '20' ? true : false,
    },
  })

  const fetchOrdersFunc = () => {
    dispatch(
      fetchOrders({
        filterData,
        uid,
        clientId: clientId ? clientId : '',
        ...pagination,
      })
    )
  }

  useEffect(() => {
    let __filterData = {
      ...filter,
      status: {
        ...initialListView.filterData.status,
        new: statusId === '1' ? true : false,
        checkin: statusId === '16' ? true : false,
        schedCheckout: statusId === '20' ? true : false,
      },
    }
    if (__filterData.menu !== 'orders') {
      __filterData = {
        ...filterData,
        status: {
          ...initialListView.filterData.status,
          new: statusId === '1' ? true : false,
          checkin: statusId === '16' ? true : false,
          schedCheckout: statusId === '20' ? true : false,
        },
        menu: 'orders',
      }
      dispatch(updateFilterData(__filterData))
    } else {
      if (page.code !== uid) {
        __filterData = {
          ...initialListView.filterData,
          status: {
            ...initialListView.filterData.status,
            new: statusId === '1' ? true : false,
            checkin: statusId === '16' ? true : false,
            schedCheckout: statusId === '20' ? true : false,
          },
          menu: 'orders',
        }
        dispatch(updateFilterData(__filterData))
      }
    }
    let __page = page
    if (__page.code !== uid) {
      __page = {
        ...initialListView.pagination,
        code: uid,
      }
    }
    dispatch(
      fetchOrders({
        filterData: __filterData,
        uid: uid,
        clientId: clientId ? clientId : '',
        ...__page,
      })
    )
    setFilterData({
      ...filterData,
      ...__filterData,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, clientId, statusId])

  useEffect(() => {
    setPagination({
      ...pagination,
      ...page,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <ListViewContext.Provider
      value={{
        uid,
        clientId,
        data,
        selected,
        setSelected,
        itemIdForUpdate,
        setItemIdForUpdate,
        clientIdForUpdate,
        setClientIdForUpdate,
        orderIdForUpdate,
        setOrderIdForUpdate,
        itemIdForDelete,
        setItemIdForDelete,
        pagination,
        setPagination,
        isAllSelected,
        isLoading,
        fetchOrdersFunc,
        filterData,
        setFilterData,
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useOrdersListView = () => useContext(ListViewContext)

export {OrdersListViewProvider, useOrdersListView}
