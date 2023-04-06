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
import {fetchItems} from '../../../../store/actions/admin'

type pagination = {
  total: number
  perPage: number
  page: number
  orderBy: string | undefined
  sort: string | undefined
}

type ListViewContextProps = {
  data: {
    id?: number
    name: string
    name_cn: string
    category: string
    description: string
    description_cn: string
    price: string
    delivery_fee: string
    qr_code: string
    top_state: number
    uri: string
  }[]
  selected: any[]
  setSelected: Dispatch<SetStateAction<any[]>>
  itemIdForUpdate: undefined | null | number
  setItemIdForUpdate: Dispatch<SetStateAction<undefined | null | number>>
  itemIdForDelete: undefined | null | number | any[]
  setItemIdForDelete: Dispatch<SetStateAction<undefined | null | number | any[]>>
  itemIdForEdit: undefined | number
  setItemIdForEdit: Dispatch<SetStateAction<undefined | number>>
  pagination: pagination
  setPagination: Dispatch<SetStateAction<pagination>>
  isAllSelected: boolean
  isLoading: boolean
  filterData: {
    name: string
    code: string
  }
  setFilterData: Dispatch<SetStateAction<any>>
  fetchItemsFunc: Function
}

const initialListView = {
  data: [
    {
      name: '',
      name_cn: '',
      category: '',
      description: '',
      description_cn: '',
      price: '',
      delivery_fee: '',
      qr_code: '',
      top_state: 0,
      uri: '',
    },
  ],
  selected: [],
  setSelected: () => {},
  itemIdForUpdate: undefined,
  setItemIdForUpdate: () => {},
  itemIdForDelete: undefined,
  setItemIdForDelete: () => {},
  itemIdForEdit: undefined,
  setItemIdForEdit: () => {},
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
  filterData: {
    name: '',
    code: '',
  },
  setFilterData: () => {},
  fetchItemsFunc: () => {},
}

const ListViewContext = createContext<ListViewContextProps>(initialListView)

const calculateIsAllDataSelected = (__data: any[], __selected: any[]) => {
  if (!__data) {
    return false
  }
  return __data.length > 0 && __data.length === __selected.length
}

const ListViewProvider: FC<WithChildren> = ({children}) => {
  const dispatch = useDispatch()

  const [selected, setSelected] = useState(Array(0))
  const [itemIdForUpdate, setItemIdForUpdate] = useState<undefined | null | number>(
    initialListView.itemIdForUpdate
  )
  const [itemIdForDelete, setItemIdForDelete] = useState<undefined | null | number | any[]>(
    initialListView.itemIdForDelete
  )
  const [itemIdForEdit, setItemIdForEdit] = useState<undefined | number>(
    initialListView.itemIdForEdit
  )
  const [pagination, setPagination] = useState<pagination>(initialListView.pagination)
  const isLoading = useSelector((state: RootState) => state.admin.loading)
  const data = useSelector((state: RootState) => state.admin.items)
  const page = useSelector((state: RootState) => state.admin.pagination)
  // const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])
  const [filterData, setFilterData] = useState(initialListView.filterData)

  useEffect(() => {
    dispatch(
      fetchItems({
        filterData,
        total: 10,
        perPage: 10,
        page: 1,
        orderBy: undefined,
        sort: undefined,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPagination({
      ...pagination,
      ...page,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const fetchItemsFunc = () => {
    dispatch(
      fetchItems({
        filterData,
        ...pagination,
      })
    )
  }

  return (
    <ListViewContext.Provider
      value={{
        data,
        selected,
        setSelected,
        itemIdForUpdate,
        setItemIdForUpdate,
        itemIdForDelete,
        setItemIdForDelete,
        itemIdForEdit,
        setItemIdForEdit,
        pagination,
        setPagination,
        isAllSelected,
        isLoading,
        filterData,
        setFilterData,
        fetchItemsFunc,
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

export {ListViewProvider, useListView}