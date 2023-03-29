import {useState, useEffect} from 'react'
import ContentOrder from '../components/content'
import {useSearchParams} from 'react-router-dom'
import {getOrderApi} from '../../../../store/apis/admin'

const EditOrder = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState({})
  const [orderInfo, setOrderInfo] = useState({
    emptyout_location_other: '',
    emptyout_date_other: '',
    emptyout_time_other: '',
    checkin_location_other: '',
    checkin_date_other: '',
    checkin_time_other: '',
    checkout_location_other: '',
    checkout_date_other: '',
    checkout_time_other: '',
    special_instruction: '',
    paid_fee: '',
  })

  useEffect(() => {
    getOrderApi({id: orderId})
      .then((res) => {
        let __order = res.data.result
        setOrder({
          ...order,
          ...__order,
        })
        setOrderInfo({
          ...orderInfo,
          emptyout_location_other: __order.emptyout_location_other,
          emptyout_date_other: __order.emptyout_date_other,
          emptyout_time_other: __order.emptyout_time_other,
          checkin_location_other: __order.checkin_location_other,
          checkin_date_other: __order.checkin_date_other,
          checkin_time_other: __order.checkin_time_other,
          checkout_location_other: __order.checkout_location_other,
          checkout_date_other: __order.checkout_date_other,
          checkout_time_other: __order.checkout_time_other,
          special_instruction: __order.special_instruction,
          paid_fee: __order.paid_fee,
        })
      })
      .catch((err) => {
        console.log('err', err.data.msg)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  return <>{orderInfo.paid_fee !== '' && <ContentOrder orderInfo={orderInfo} order={order} />}</>
}

export default EditOrder
