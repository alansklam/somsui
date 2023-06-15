import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {KTCardBody} from '../../../../../_metronic/helpers'

import {ItemsTableBody} from './ItemsTableBody'
import {useListView} from '../core/ItemsListViewProvider'
import {ItemsPagination} from '../components/pagination/ItemsPagination'
import {fetchItems} from '../../../../store/actions/admin'

const ItemsTable = () => {
  const dispatch = useDispatch()
  const {data, setSelected, isAllSelected, pagination, filterData} = useListView()
  const [listData, setListData] = useState(Array(0))

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
      fetchItems({
        filterData,
        ...pagination,
        sort: __sort,
        orderBy: order,
      })
    )
  }

  useEffect(() => {
    let __data = data
    if(!__data) return;
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
    <KTCardBody className='py-4'>
      <div className='card-body py-3' style={{position: 'relative'}}>
        <div className='table-responsive min-h-300px'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted align-middle fs-5'>
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
                <th className='min-w-150px'>
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
                <th className='min-w-100px text-center'>
                  <div
                    className={
                      pagination.orderBy === 'category'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('category')}
                    style={{cursor: 'pointer'}}
                  >
                    Category
                  </div>
                </th>
                <th className='min-w-350px text-center'>
                  <div
                    className={
                      pagination.orderBy === 'description'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    // onClick={() => onSortHandler('description')}
                    // style={{cursor: 'pointer'}}
                  >
                    Description
                  </div>
                </th>
                <th className='min-w-80px text-center'>
                  <div
                    className={
                      pagination.orderBy === 'price'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('price')}
                    style={{cursor: 'pointer'}}
                  >
                    Price
                  </div>
                </th>
                <th className='min-w-80px text-center'>
                  <div
                    className={
                      pagination.orderBy === 'delivery_fee'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('delivery_fee')}
                    style={{cursor: 'pointer'}}
                  >
                    Delivery fee
                  </div>
                </th>
                <th className='min-w-100px text-center'>
                  <div
                    className={
                      pagination.orderBy === 'qr_code'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('qr_code')}
                    style={{cursor: 'pointer'}}
                  >
                    QR Code
                  </div>
                </th>
                <th className='min-w-80px text-center'>
                  <div
                    className={
                      pagination.orderBy === 'top_state'
                        ? pagination.sort
                          ? pagination.sort === 'asc'
                            ? 'table-sort-asc'
                            : 'table-sort-desc'
                          : ''
                        : ''
                    }
                    onClick={() => onSortHandler('top_state')}
                    style={{cursor: 'pointer'}}
                  >
                    Top State
                  </div>
                </th>
                <th className='min-w-80px text-end'>Action</th>
              </tr>
            </thead>
            <tbody>
              <ItemsTableBody listData={listData} setListData={setListData} />
            </tbody>
          </table>
          {listData.length === 0 && (
            <div
              className='w-100 text-center text-muted fw-bold fs-6'
              style={{position: 'absolute', top: '100px'}}
            >
              No matching records found
            </div>
          )}
        </div>
        <div className='d-flex justify-content-end my-7'>
          <ItemsPagination />
        </div>
      </div>
    </KTCardBody>
  )
}

export {ItemsTable}
