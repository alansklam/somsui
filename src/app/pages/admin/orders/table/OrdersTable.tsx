import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {KTCardBody} from '../../../../../_metronic/helpers'

import {OrdersTableBody} from './OrdersTableBody'
import {useOrdersListView} from '../core/OrdersListViewProvider'
import {OrdersPagination} from '../components/pagination/OrdersPagination'
import {fetchOrders} from '../../../../store/actions/admin'
import {RootState} from '../../../../store/reducers'

const OrdersTable = () => {
  const dispatch = useDispatch()
  const {uid, clientId, data, setSelected, isAllSelected, pagination, filterData} =
    useOrdersListView()
  const [listData, setListData] = useState(Array(0))
  const products = useSelector((state: RootState) => state.admin.products)
  const materialItems = useSelector((state: RootState) => state.admin.ref.materialItems)

  const onSortHandler = (order: string) => {
    let __sort: string | undefined = undefined
    if (pagination.orderBy === order) {
      if (pagination.sort) {
        pagination.sort === 'desc' ? (__sort = 'asc') : (__sort = undefined)
      } else {
        __sort = 'desc'
      }
    } else {
      __sort = 'desc'
    }
    dispatch(
      fetchOrders({
        filterData,
        uid,
        clientId,
        ...pagination,
        sort: __sort,
        orderBy: order,
      })
    )
  }

  useEffect(() => {
    let __data = data
    if(!__data) return;
    __data.length > 0 &&
      __data.forEach((element: any, index: number) => {
        element = {
          ...element,
          checked: false,
        }
      })
    setListData(__data)
  }, [data])

  useEffect(() => {
    let __checked = []
    __checked = listData.filter((data) => data.checked === true)
    setSelected(__checked)
  }, [listData, setSelected])

  return (
    <KTCardBody className='py-4 px-0'>
      <div className='card-body py-3 px-0' style={{position: 'relative'}}>
        <div className='table-responsive min-h-300px'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-3 gx-1'>
            <thead>
              <tr className='fw-bold text-muted align-middle fs-6'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      data-kt-check='true'
                      data-kt-check-target='.widget-9-check'
                      checked={isAllSelected}
                      onChange={(e) => {
                        let __listData = listData
                        __listData.forEach((data: any) => {
                          data.checked = e.target.checked
                        })
                        setListData([...__listData])
                      }}
                    />
                  </div>
                </th>
                <th className=''>
                  <div
                    className={
                      pagination.orderBy === 'name'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('name')}
                    style={{cursor: 'pointer'}}
                  >
                    Name
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'student_id'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('student_id')}
                    style={{cursor: 'pointer'}}
                  >
                    Student ID
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'email'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('email')}
                    style={{cursor: 'pointer'}}
                  >
                    Email
                  </div>
                </th>
                <th className=' text-center'>
                  <div
                    className={
                      pagination.orderBy === 'contact'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('contact')}
                    style={{cursor: 'pointer'}}
                  >
                    Contact Number
                  </div>
                </th>
                <th className=' text-center'>
                  <div
                    className={
                      pagination.orderBy === 'mobile_phone_cn'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('mobile_phone_cn')}
                    style={{cursor: 'pointer'}}
                  >
                    Phone CN
                  </div>
                </th>
                <th className=' text-center'>
                  <div
                    className={
                      pagination.orderBy === 'wechat'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('wechat')}
                    style={{cursor: 'pointer'}}
                  >
                    WeChat
                  </div>
                </th>

                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'code'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('code')}
                    style={{cursor: 'pointer'}}
                  >
                    Order ID
                  </div>
                </th>
                {products &&
                  products.length > 0 &&
                  products.map((item, index) =>
                    item.top_state === 1 ? (
                      <th className=' text-center' key={index}>
                        <div
                          className={
                            pagination.orderBy === 'paperBoxes'
                              ? pagination.sort
                                ? pagination.sort === 'asc'
                                  ? 'table-sort-asc'
                                  : 'table-sort-desc'
                                : ''
                              : ''
                          }
                          // onClick={() => onSortHandler('paperBoxes')}
                          // style={{cursor: 'pointer'}}
                        >
                          {item.name}
                        </div>
                      </th>
                    ) : (
                      <th key={index} style={{padding: '0px'}}></th>
                    )
                  )}
                {materialItems &&
                  materialItems.length > 0 &&
                  materialItems.map((item: any, index: number) =>
                    item.top_state === 1 ? (
                      <th className='text-center' key={index}>
                        <div
                          className={
                            pagination.orderBy === 'paperBoxes'
                              ? pagination.sort
                                ? pagination.sort === 'asc'
                                  ? 'table-sort-asc'
                                  : 'table-sort-desc'
                                : ''
                              : ''
                          }
                          // onClick={() => onSortHandler('paperBoxes')}
                          // style={{cursor: 'pointer'}}
                        >
                          {item.name}
                        </div>
                      </th>
                    ) : (
                      <th key={index} style={{padding: '0px'}}></th>
                    )
                  )}
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'storage_month'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('storage_month')}
                    style={{cursor: 'pointer'}}
                  >
                    Storage period (month)
                  </div>
                </th>
                <th className='text-center min-w-60px'>
                  <div
                    className={
                      pagination.orderBy === 'emptyout_date_other'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('emptyout_date_other')}
                    style={{cursor: 'pointer'}}
                  >
                    Empty box date
                  </div>
                </th>
                <th className='text-center min-w-60px'>
                  <div
                    className={
                      pagination.orderBy === 'checkin_date_other'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('checkin_date_other')}
                    style={{cursor: 'pointer'}}
                  >
                    Storage date
                  </div>
                </th>
                <th className='text-center min-w-60px'>
                  <div
                    className={
                      pagination.orderBy === 'checkout_date_other'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('checkout_date_other')}
                    style={{cursor: 'pointer'}}
                  >
                    Pick-up date
                  </div>
                </th>
                <th className='text-center min-w-60px'>
                  <div
                    className={
                      pagination.orderBy === 'storage_expired_date'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('storage_expired_date')}
                    style={{cursor: 'pointer'}}
                  >
                    Storage expire date
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'updated_at'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    // onClick={() => onSortHandler("updated_at")}
                    // style={{cursor: 'pointer'}}
                  >
                    Pick-up location
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'special_instruction'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('special_instruction')}
                    style={{cursor: 'pointer'}}
                  >
                    Special requirement
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'remark_qrcode'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('remark_qrcode')}
                    style={{cursor: 'pointer'}}
                  >
                    QR Code
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'total_fee'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('total_fee')}
                    style={{cursor: 'pointer'}}
                  >
                    Lump sum
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'paid_fee'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('paid_fee')}
                    style={{cursor: 'pointer'}}
                  >
                    Paid amount
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'balance'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('balance')}
                    style={{cursor: 'pointer'}}
                  >
                    Outstanding amount
                  </div>
                </th>
                <th className='text-center'>
                  <div
                    className={
                      pagination.orderBy === 'order_status_id'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('order_status_id')}
                    style={{cursor: 'pointer'}}
                  >
                    Order status
                  </div>
                </th>
                <th className='text-end'>Action</th>
              </tr>
            </thead>
            <tbody>
              <OrdersTableBody listData={listData} setListData={setListData} />
            </tbody>
          </table>
          {listData.length === 0 && (
            <div
              className='w-25 text-center text-muted fw-bold fs-6'
              style={{position: 'absolute', top: '100px'}}
            >
              No matching records found
            </div>
          )}
        </div>
        <div className='d-flex justify-content-end my-7'>
          <OrdersPagination />
        </div>
      </div>
    </KTCardBody>
  )
}

export {OrdersTable}
