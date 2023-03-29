import {usePaymentsListView} from '../core/PaymentsListViewProvider'
import {paymentPaidApi, paymentCancelledApi} from '../../../../store/apis/admin'
import {useNavigate} from 'react-router-dom'

export const PaymentsTableBody = (props: any) => {
  const {listData, setListData, paymentRemarkId} = props
  const navigateTo = useNavigate()
  const {setClientIdForUpdate, setOrderIdForUpdate, fetchPaymentsFunc} = usePaymentsListView()

  const selectHandler = (index: number, state: boolean) => {
    let __data = listData[index]
    __data.checked = state
    setListData([...listData.slice(0, index), __data, ...listData.slice(index + 1)])
  }

  const onPaidHandler = (id: number) => {
    paymentPaidApi({id: id}).then(() => {
      fetchPaymentsFunc()
    })
  }

  const onMarkHandler = (id: number) => {
    paymentCancelledApi({id: id}).then(() => {
      fetchPaymentsFunc()
    })
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
                      // navigateTo(
                      //   `/admin/retrieval-order/edit?retrievalOrderId=${
                      //     data.retrieval_order_id ? data.retrieval_order_id : data.order_id
                      //   }`
                      // )
                    }}
                  >
                    {data.code}
                  </span>
                </div>
              </td>
              <td className='text-center'>
                <span
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    navigateTo('/admin/clients/edit?clientId=' + data.order.client.id)
                    setClientIdForUpdate(index)
                  }}
                >
                  {data.order?.client?.name}
                </span>
              </td>
              <td className='text-center'>
                <span
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setOrderIdForUpdate(index)
                    if (paymentRemarkId === 1) {
                      navigateTo('/admin/orders/edit?orderId=' + data.order_id)
                    } else if (paymentRemarkId === 3) {
                      navigateTo(
                        '/admin/retrieval-order/edit?retrievalOrderId=' + data.retrieval_order_id
                      )
                    }
                  }}
                >
                  {paymentRemarkId === 1 ? data.order?.code : data.retrieval_order?.code}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.amount}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.status.description}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.completed_at}</span>
              </td>
              {!data.completed_at && (
                <td>
                  <div className='d-flex justify-content-around flex-shrink-0'>
                    <button
                      className='btn btn-success btn-sm w-100px'
                      onClick={() => onPaidHandler(data.id)}
                    >
                      Mark as Paid
                    </button>
                    <button
                      className='btn btn-danger btn-sm w-100px'
                      onClick={() => onMarkHandler(data.id)}
                    >
                      Mark as Cancelled
                    </button>
                  </div>
                </td>
              )}
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
