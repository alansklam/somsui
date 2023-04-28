import {useOrdersListView} from '../core/OrdersListViewProvider'
import {Link} from 'react-router-dom'
import {sendInvoiceApi} from '../../../../store/apis/admin'
import {notification} from 'antd'
import {useNavigate} from 'react-router-dom'
import {RootState} from '../../../../store/reducers'
import {useSelector} from 'react-redux'
import dayjs from 'dayjs'
import {OrderActionList} from '../components/action'

export const OrdersTableBody = (props: any) => {
  const {listData, setListData} = props
  const navigateTo = useNavigate()
  const {setItemIdForUpdate, setClientIdForUpdate} = useOrdersListView()
  const products = useSelector((state: RootState) => state.admin.products)
  const materialItems = useSelector((state: RootState) => state.admin.ref.materialItems)

  const selectHandler = (index: number, state: boolean) => {
    let __data = listData[index]
    __data.checked = state
    setListData([...listData.slice(0, index), __data, ...listData.slice(index + 1)])
  }
  const onSendInvoiceHandler = (id: number) => {
    sendInvoiceApi({id: id})
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Send Invoice successfully',
          placement: 'topRight',
          duration: 2,
        })
      })
      .catch(() => {
        notification.error({
          message: 'Error',
          description: 'Send Invoice is failed',
          placement: 'topRight',
          duration: 2,
        })
      })
  }
  const getItem = (selectItem: any, items: any[]) => {
    let __quantity = 0
    items.forEach((item) => {
      if (item.item_id === selectItem.id) {
        __quantity = item.item_qty
      }
    })
    return __quantity
  }
  const getStatus = (id: number) => {
    switch (id) {
      case 1:
        return 'New'
      case 4:
        return 'In Progress'
      case 8:
        return 'Empty Delivery'
      case 14:
        return 'Sched Check-In'
      case 16:
        return 'Check-in'
      case 20:
        return 'Sch Check-Out'
      case 24:
        return 'Check-Out'
      case 25:
        return 'Sch Empty Return'
      case 28:
        return 'Completed'
      case 30:
        return 'Hold'
      case 32:
        return 'Cancelled'
      default:
        return ''
    }
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
                      navigateTo('/admin/clients/edit?clientId=' + data.client.id)
                      setClientIdForUpdate(index)
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
                    navigateTo('/admin/orders/edit?orderId=' + data.id)
                    setItemIdForUpdate(index)
                  }}
                >
                  {data?.code}
                </span>
              </td>
              {products &&
                products.length > 0 &&
                products.map((item, index) =>
                  item.top_state === 1 ? (
                    <td className='text-center' key={index}>
                      <span className='text-dark fw-bold d-block fs-6'>
                        {getItem(item, data.items)}
                      </span>
                    </td>
                  ) : (
                    <td key={index} style={{padding: '0px'}}></td>
                  )
                )}
              {materialItems &&
                materialItems.length > 0 &&
                materialItems.map((item: any, index: number) =>
                  item.top_state === 1 ? (
                    <td className='text-center' key={index}>
                      <span className='text-dark fw-bold d-block fs-6'>
                        {getItem(item, data.items)}
                      </span>
                    </td>
                  ) : (
                    <td key={index} style={{padding: '0px'}}></td>
                  )
                )}
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.storage_month}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {dayjs(data.emptyout_date_other).format('DD-MM-YYYY')}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {dayjs(data.checkin_date_other).format('DD-MM-YYYY')}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {dayjs(data.checkout_date_other).format('DD-MM-YYYY')}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {data.storage_expired_date
                    ? dayjs(data.storage_expired_date).format('DD-MM-YYYY')
                    : ''}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.client?.address1}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.special_instruction}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.remark_qrcode}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.total_fee}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.paid_fee}</span>
              </td>
              <td className='text-center'>
                <Link
                  to={'/admin/payments?order_id=' + data.id}
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                >
                  {data.balance}
                </Link>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {getStatus(data.order_status_id)}
                </span>
              </td>
              <td>
                <div className='d-flex justify-content-end flex-shrink-0'>
                  <OrderActionList id={data.id} sendInvoice={onSendInvoiceHandler} data={data} />
                </div>
              </td>
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
