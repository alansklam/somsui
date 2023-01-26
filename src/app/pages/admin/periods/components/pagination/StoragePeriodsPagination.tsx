import React from "react"
import { useDispatch } from "react-redux"
import { Pagination } from "antd"
import { useListView } from "../../core/PeriodsListViewProvider"
import { fetchPeriods } from "../../../../../store/actions/admin"

export const StoragePeriodPagination: React.FC = () => {

  const dispatch = useDispatch();
  const { pagination, filterData } = useListView();

  const onChangeHandler = (page: number, pageSize:number) => {
    dispatch(fetchPeriods({
      filterData,
      ...pagination,
      page: page,
      perPage: pageSize,
    }))
  };

  const showTotalHandler = (total:number, range:[number, number]) => {
    return `${range[0]}-${range[1]} of ${total} items`
  };

  return (
    <>
      <Pagination 
        defaultCurrent={1} 
        total={pagination.total} 
        current={pagination.page}
        pageSize={pagination.perPage}
        showSizeChanger 
        pageSizeOptions={[10, 15, 20, 30]}
        onChange={onChangeHandler}
        showTotal={showTotalHandler}
      />
    </>
  )
}