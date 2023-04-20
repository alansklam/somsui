import React from 'react'
import {useDispatch} from 'react-redux'
import {Pagination} from 'antd'
import {usePaymentsListView} from '../../core/PaymentsListViewProvider'
import {fetchPayments} from '../../../../../store/actions/admin'

type propState = {
  paymentRemarkId: number
}

export const PaymentsPagination = (props: propState) => {
  const dispatch = useDispatch()
  const {orderId, pagination, filterData} = usePaymentsListView()
  const {paymentRemarkId} = props

  const onChangeHandler = (page: number, pageSize: number) => {
    dispatch(
      fetchPayments({
        filterData,
        orderId,
        ...pagination,
        paymentRemarkId,
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
