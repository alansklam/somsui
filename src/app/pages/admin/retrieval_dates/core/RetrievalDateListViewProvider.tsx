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
import {fetchRetrievalDates} from '../../../../store/actions/admin'
import {updateFilterData} from '../../../../store/actions/admin'
import {useSearchParams} from 'react-router-dom'

type pagination = {
  total: number
  perPage: number
  page: number
  orderBy: string | undefined
  sort: string | undefined
}

type ListViewContextProps = {
  uid: string | undefined | null
  data: {
    id?: number
    retrieval_date?: string
    day: number
    university_id?: number
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
    retrieval_date: string
    day: string
  }
  setFilterData: Dispatch<SetStateAction<any>>
  fetchRetrievalDatesFunc: Function
}

const initialListView = {
  uid: '',
  data: [
    {
      retrieval_date: '',
      day: 0,
      university_id: 0,
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
    perPage: 20,
    page: 1,
    orderBy: undefined,
    sort: undefined,
  },
  setPagination: () => {},
  isAllSelected: false,
  isLoading: false,
  filterData: {
    retrieval_date: '',
    day: '',
  },
  setFilterData: () => {},
  fetchRetrievalDatesFunc: () => {},
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
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid')

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
  const data = useSelector((state: RootState) => state.admin.retrievalDates.data)
  const page = useSelector((state: RootState) => state.admin.retrievalDates.pagination)
  const filter = useSelector((state: RootState) => state.admin.filterData)
  // const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])
  const [filterData, setFilterData] = useState(initialListView.filterData)
  useEffect(() => {
    let __filterData = filter
    if (__filterData.menu !== 'retrievalDate') {
      __filterData = {
        ...filterData,
        menu: 'retrievalDate',
      }
      dispatch(updateFilterData(__filterData))
    }
    dispatch(
      fetchRetrievalDates({
        filterData: __filterData,
        uid,
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

  const fetchRetrievalDatesFunc = () => {
    dispatch(
      fetchRetrievalDates({
        filterData,
        uid,
        ...pagination,
      })
    )
  }

  return (
    <ListViewContext.Provider
      value={{
        uid,
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
        fetchRetrievalDatesFunc,
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

export {ListViewProvider, useListView}
