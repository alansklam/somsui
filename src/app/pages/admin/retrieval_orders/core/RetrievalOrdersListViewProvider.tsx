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
import {fetchRetrievalOrders} from '../../../../store/actions/admin'
import {useParams} from 'react-router-dom'
import {updateFilterData} from '../../../../store/actions/admin'

type pagination = {
  total: number
  perPage: number
  page: number
  orderBy: string | undefined
  sort: string | undefined
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
  uid?: string
  data: {
    id: number
    code: string
    checkout_location_other: string
    checkout_date_other: string
    checkout_time_other: string
    empty_return_date_other: string
    empty_return_time_other: string
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
    walkup: number
    order: any
    floor: string
  }[]
  selected: any[]
  setSelected: Dispatch<SetStateAction<any[]>>
  itemIdForUpdate: undefined | null | number
  setItemIdForUpdate: Dispatch<SetStateAction<undefined | null | number>>
  clientIdForUpdate: undefined | null | number
  setClientIdForUpdate: Dispatch<SetStateAction<undefined | null | number>>
  retrievalOrderIdForUpdate: undefined | null | number
  setRetrievalOrderIdForUpdate: Dispatch<SetStateAction<undefined | null | number>>
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
    checkoutDateStart: string
    checkoutDateEnd: string
    emptyReturnDateStart: string
    emptyReturnDateEnd: string
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
  }
  setFilterData: Dispatch<SetStateAction<any>>
}

const initialListView = {
  data: [],
  selected: [],
  setSelected: () => {},
  itemIdForUpdate: undefined,
  setItemIdForUpdate: () => {},
  clientIdForUpdate: undefined,
  setClientIdForUpdate: () => {},
  retrievalOrderIdForUpdate: undefined,
  setRetrievalOrderIdForUpdate: () => {},
  itemIdForDelete: undefined,
  setItemIdForDelete: () => {},
  pagination: {
    total: 10,
    perPage: 10,
    page: 1,
    orderBy: undefined,
    sort: undefined,
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
    checkoutDateStart: '',
    checkoutDateEnd: '',
    emptyReturnDateStart: '',
    emptyReturnDateEnd: '',
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

const RetrievalOrdersListViewProvider: FC<WithChildren> = ({children}) => {
  const {uid, clientName} = useParams()
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
  const [retrievalOrderIdForUpdate, setRetrievalOrderIdForUpdate] = useState<
    undefined | null | number
  >(initialListView.retrievalOrderIdForUpdate)
  const [pagination, setPagination] = useState<pagination>(initialListView.pagination)
  const isLoading = useSelector((state: RootState) => state.admin.loading)
  const data = useSelector((state: RootState) => state.admin.retrievalOrders.data)
  const page = useSelector((state: RootState) => state.admin.retrievalOrders.pagination)
  const filter = useSelector((state: RootState) => state.admin.filterData)
  // const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])
  const [filterData, setFilterData] = useState(
    clientName ? {...initialListView.filterData, name: clientName} : initialListView.filterData
  )
  const fetchOrdersFunc = () => {
    dispatch(
      fetchRetrievalOrders({
        filterData,
        uid,
        ...pagination,
      })
    )
  }

  useEffect(() => {
    let __filterData = filter
    if (__filterData.menu !== 'retrieval_orders') {
      __filterData = {
        ...filterData,
        menu: 'retrieval_orders',
      }
      dispatch(updateFilterData(__filterData))
    }
    dispatch(
      fetchRetrievalOrders({
        filterData: __filterData,
        uid: uid,
        ...page,
      })
    )
    setFilterData({
      ...filterData,
      ...__filterData,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

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
        data,
        selected,
        setSelected,
        itemIdForUpdate,
        setItemIdForUpdate,
        clientIdForUpdate,
        setClientIdForUpdate,
        retrievalOrderIdForUpdate,
        setRetrievalOrderIdForUpdate,
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

const useRetrievalOrdersListView = () => useContext(ListViewContext)

export {RetrievalOrdersListViewProvider, useRetrievalOrdersListView}
