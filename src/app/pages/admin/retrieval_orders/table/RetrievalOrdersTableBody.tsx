import {useRetrievalOrdersListView} from '../core/RetrievalOrdersListViewProvider'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {RootState} from '../../../../store/reducers'

export const RetrievalOrdersTableBody = (props: any) => {
  const {listData, setListData} = props
  const navigateTo = useNavigate()
  const {setClientIdForUpdate, setRetrievalOrderIdForUpdate} = useRetrievalOrdersListView()
  const products = useSelector((state: RootState) => state.admin.products)

  const selectHandler = (index: number, state: boolean) => {
    let __data = listData[index]
    __data.checked = state
    setListData([...listData.slice(0, index), __data, ...listData.slice(index + 1)])
  }
  // const onSendInvoiceHandler = (id: number) => {
  //   sendInvoiceApi({id: id})
  //     .then(() => {
  //       notification.success({
  //         message: 'Success',
  //         description: 'Send Invoice successfully',
  //         placement: 'topRight',
  //         duration: 2,
  //       });
  //     })
  //     .catch(() => {
  //       notification.error({
  //         message: 'Error',
  //         description: 'Send Invoice is failed',
  //         placement: 'topRight',
  //         duration: 2,
  //       });
  //     })
  // }

  const getItem = (selectItem: any, items: any[]) => {
    let __quantity = 0
    items.forEach((item) => {
      if (selectItem.id === item.item_id) {
        __quantity = item.item_qty
      }
    })
    return __quantity
  }

  return (
    <>
      {listData.length > 0 ? (
        listData.map((data: any, index: number) => {
          return (
            <tr key={index}>
              <td>
                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                  <input
                    className='form-check-input widget-9-check'
                    type='checkbox'
                    checked={data.checked ? data.checked : false}
                    onChange={(e) => {
                      selectHandler(index, e.target.checked)
                    }}
                  />
                </div>
              </td>
              <td>
                <div className='d-flex align-items-center'>
                  <span
                    className='text-blue fw-bold fs-6'
                    style={{cursor: 'pointer'}}
                    onClick={() => {
                      setClientIdForUpdate(index)
                      navigateTo('/admin/clients/edit?clientId=' + data.client.id)
                    }}
                  >
                    {data.client?.name}
                  </span>
                </div>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.client?.student_id}</span>
              </td>
              <td>
                <span className='text-dark fw-bold d-block fs-6'>{data.client?.email}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.client?.contact}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {data.client?.mobile_phone_cn}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.client?.wechat}</span>
              </td>

              <td className='text-center'>
                <span
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setRetrievalOrderIdForUpdate(index)
                    navigateTo('edit?retrievalOrderId=' + data.id)
                  }}
                >
                  {data.code}
                </span>
              </td>
              <td className='text-center'>
                <span
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setRetrievalOrderIdForUpdate(index)
                    navigateTo('/admin/orders/edit?orderId=' + data.order.id)
                  }}
                >
                  {data.order?.code}
                </span>
              </td>
              {products &&
                products.length > 0 &&
                products.map((item, index) =>
                  item.top_state === 1 ? (
                    <td className='text-center' key={index}>
                      <span className='text-dark fw-bold d-block fs-6' key={index}>
                        {getItem(item, data.items)}
                      </span>
                    </td>
                  ) : (
                    <th
                      key={index}
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('padding', '0px', 'important')
                        }
                      }}
                    ></th>
                  )
                )}
              {/* <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.vacuumBags}</span>
              </td> */}
              {/* <td className='text-center'>
                  <span className='text-dark fw-bold d-block fs-6'>
                    {data.storage_month}
                  </span>
              </td> */}
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.walkup}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.checkout_date_other}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {data.empty_return_date_other}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {data.checkout_location_other}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.special_instruction}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.remark_qr_code}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.total_fee}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.paid_fee}</span>
              </td>
              <td className='text-center'>
                <Link
                  to={'/admin/payments?retrieval_order_id=' + data.id}
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                >
                  {data.balance}
                </Link>
              </td>
              {/* <td className='text-center'>
                  <span className='text-dark fw-bold d-block fs-6'>
                    {data.status.code}
                  </span>
              </td> */}
              {/* <td>
                <div className='d-flex justify-content-end flex-shrink-0'>
                  {
                    parseInt(data.balance) !== 0 && 
                    <button 
                      className='btn btn-primary'
                      onClick={() => {onSendInvoiceHandler(data.id)}}
                    >
                      Send invoice
                    </button>
                  }
                </div>
              </td> */}
            </tr>
          )
        })
      ) : (
        <tr>
          <></>
        </tr>
      )}
    </>
  )
}
