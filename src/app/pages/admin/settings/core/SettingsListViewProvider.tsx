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
import {fetchSettings} from '../../../../store/actions/admin'
import {updateFilterData} from '../../../../store/actions/admin'

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
    code?: string
    value: string
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
    code: string
    value: string
  }
  setFilterData: Dispatch<SetStateAction<any>>
  fetchSettingsFunc: Function
}

const initialListView = {
  data: [
    {
      code: '',
      value: '',
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
    code: '',
    value: '',
  },
  setFilterData: () => {},
  fetchSettingsFunc: () => {},
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
  const data = useSelector((state: RootState) => state.admin.settings.data)
  const page = useSelector((state: RootState) => state.admin.settings.pagination)
  const filter = useSelector((state: RootState) => state.admin.filterData)
  // const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data])
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected])
  const [filterData, setFilterData] = useState(initialListView.filterData)
  useEffect(() => {
    let __filterData = filter
    if (__filterData.menu !== 'settings') {
      __filterData = {
        ...filterData,
        menu: 'settings',
      }
      dispatch(updateFilterData(__filterData))
    }
    dispatch(
      fetchSettings({
        filterData: __filterData,
        ...page,
      })
    )
    setFilterData({
      ...filterData,
      ...__filterData,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPagination({
      ...pagination,
      ...page,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const fetchSettingsFunc = () => {
    dispatch(
      fetchSettings({
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
        fetchSettingsFunc,
      }}
    >
      {children}
    </ListViewContext.Provider>
  )
}

const useListView = () => useContext(ListViewContext)

export {ListViewProvider, useListView}
