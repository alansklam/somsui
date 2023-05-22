import React from 'react'
import {useDispatch} from 'react-redux'
import {Pagination} from 'antd'
import {useListView} from '../../core/RetrievalDateListViewProvider'
import {fetchRetrievalDates} from '../../../../../store/actions/admin'

export const RetrievalDatePagination: React.FC = () => {
  const dispatch = useDispatch()
  const {uid, pagination, filterData} = useListView()

  const onChangeHandler = (page: number, pageSize: number) => {
    dispatch(
      fetchRetrievalDates({
        filterData,
        uid,
        ...pagination,
        page: page,
        perPage: pageSize,
      })
    )
  }

  const showTotalHandler = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} of ${total} items`
  }

  return (
    <>
      <Pagination
        defaultCurrent={1}
        total={pagination.total}
        current={pagination.page}
        pageSize={pagination.perPage}
        showSizeChanger
        pageSizeOptions={[20, 50, 100, 200]}
        onChange={onChangeHandler}
        showTotal={showTotalHandler}
      />
    </>
  )
}
