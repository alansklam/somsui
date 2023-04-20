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
import {useParams} from 'react-router-dom'
import {WithChildren} from '../../../../../_metronic/helpers'
import {RootState} from '../../../../store/reducers'
import {fetchPayments} from '../../../../store/actions/admin'
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
}

type order = {
  id?: number
  client?: client
}

type ListViewContextProps = {
  orderId?: string
  data: {
    id?: number | null
    name?: string
    email?: string
    contact?: number | null
    wechat?: string
    student_id?: string
    address1?: string
    order?: order
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
  filterData: {
    order_id: string
    amount: string
  }
  setFilterData: Dispatch<SetStateAction<any>>
  fetchPaymentsFunc: Function
}

const initialListView = {
  data: [
    {
      name: '',
      email: '',
      contact: null,
      wechat: '',
      student_id: '',
      address: '',
    },
  ],
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
    perPage: 20,
    page: 1,
    orderBy: undefined,
    sort: undefined,
    code: '',
  },
  setPagination: () => {},
  isAllSelected: false,
  isLoading: false,
  filterData: {
    order_id: '',
    amount: '',
  },
  setFilterData: () => {},
  fetchPaymentsFunc: () => {},
}

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const calculateIsAllDataSelected = (__data: any[], __selected: any[]) => {
  if (!__data) {
    return false
  }
  return __data.length > 0 && __data.length === __selected.length
}

const PaymentsListViewProvider: FC<WithChildren> = ({children, paymentRemarkId}) => {
  const dispatch = useDispatch()
  const {orderId} = useParams()
  const [searchParams] = useSearchParams()
  const order_id = searchParams.get('order_id')
  const retrieval_order_id = searchParams.get('retrieval_order_id')
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
  const data = useSelector((state: RootState) => state.admin.payments.data)
  const page = useSelector((state: RootState) => state.admin.payments.pagination)
  const filter = useSelector((state: RootState) => state.admin.filterData)
  // const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])
  const [filterData, setFilterData] = useState(initialListView.filterData)

  useEffect(() => {
    let __orderId = ''
    let __isOrder = false
    if (order_id) {
      __orderId = order_id
      __isOrder = true
    } else if (retrieval_order_id) {
      __orderId = retrieval_order_id
      __isOrder = false
    }
    let __filterData = filter
    if (__filterData.menu !== 'payments') {
      if (page.code !== paymentRemarkId) {
        __filterData = {
          ...initialListView.filterData,
          menu: 'payments',
        }
      } else {
        __filterData = {
          ...filterData,
          menu: 'payments',
        }
      }
      dispatch(updateFilterData(__filterData))
    } else {
      if (page.code !== paymentRemarkId) {
        __filterData = {
          ...initialListView.filterData,
          menu: 'payments',
        }
      } else {
        __filterData = {
          ...filterData,
          menu: 'payments',
        }
      }
      dispatch(updateFilterData(__filterData))
    }
    let __page = page
    if (__page.code !== paymentRemarkId) {
      __page = {
        ...initialListView.pagination,
        code: paymentRemarkId,
      }
    }
    dispatch(
      fetchPayments({
        filterData: __filterData,
        paymentRemarkId,
        orderId: __orderId,
        isOrder: __isOrder,
        ...__page,
      })
    )
    setFilterData({
      ...filterData,
      ...__filterData,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order_id, retrieval_order_id, paymentRemarkId])

  useEffect(() => {
    setPagination({
      ...pagination,
      ...page,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const fetchPaymentsFunc = () => {
    dispatch(
      fetchPayments({
        filterData,
        orderId,
        paymentRemarkId,
        ...pagination,
      })
    )
  }

  return (
    <ListViewContext.Provider
      value={{
        orderId,
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
        filterData,
        setFilterData,
        fetchPaymentsFunc,
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const usePaymentsListView = () => useContext(ListViewContext)

export {PaymentsListViewProvider, usePaymentsListView}
