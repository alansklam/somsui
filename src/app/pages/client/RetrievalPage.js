import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {useParams, Link} from 'react-router-dom'
import {Trans, useTranslation} from 'react-i18next'
import {Grid} from '@mui/material'
import {fetchCurrentOrder} from '../../store/actions/client'
import {getPaymentMethod} from '../../store/actions/order'
import {useDispatch, useSelector} from 'react-redux'
import RetrievalEdit from './components/RetrievalEdit'
import RetrievalCart from './components/RetrievalCart'
import PaymentMethod from './components/PaymentMethod'

export default function RetrievalPage(props) {
  const {id} = useParams()
  const {t} = useTranslation()
  const email = JSON.parse(localStorage?.getItem('ubox-user')).email
  const dispatch = useDispatch()
  const order = useSelector((state) => state.client.currentOrder)
  const products = useSelector((state) => state.client.products)
  const [initial, setInitial] = useState(false)
  const [cartInfo, setCartInfo] = useState({
    delivery_items: [],
    per_delivery_fee: 0,
    min_delivery_fee: 0,
    min_delivery_state: false,
    delivery_fee: 0,
    floors: 0,
    per_floor_fee: 0,
    floor_fee: 0,
    retrieval_next_day: false,
    next_day_fee: 0,
    total_fee: 0,
    payment_type: 3,
  })
  const [retrievalOrder, setRetrievalOrder] = useState({
    retrieval_date: '',
    retrieval_time: '',
    empty_box_return_date: '',
    empty_box_return_time: '',
    storage_month: '',
    retrieval_address: '',
    special_instruction: '',
    qr_code: '',
  })
  const [orderState, setOrderState] = useState(false)
  const [confirmOrder, setComfirmOrder] = useState({})

  useEffect(() => {
    setInitial(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initial) {
      dispatch(fetchCurrentOrder({id: id}))
      dispatch(getPaymentMethod())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  const dateFormat = (date) => {
    let newDate = dayjs(date).format('DD/MM/YYYY')
    return newDate
  }

  const onCartHandler = (item, value) => {
    let __delivery_items = cartInfo.delivery_items
    let __delivery_fee = 0
    let __total_fee = 0
    let __min_delivery_state = false
    let __min_delivery_fee = parseInt(products.min_delivery_service.price)
    let __per_delivery_fee = parseInt(products.delivery_service.price)

    if (item.category === 'box') {
      __delivery_items[item.id] = {...item, count: value}
    }

    Object.keys(__delivery_items).forEach((iter, index) => {
      __delivery_fee =
        __delivery_fee +
        __per_delivery_fee +
        Number.parseFloat(__delivery_items[iter].delivery_fee).valueOf() *
          __delivery_items[iter].count
    })
    if (__delivery_fee < __min_delivery_fee) {
      __delivery_fee = __min_delivery_fee
      __min_delivery_state = true
    }

    __delivery_fee = Math.round(__delivery_fee * 100) / 100
    __total_fee = __total_fee + __delivery_fee

    setCartInfo({
      ...cartInfo,
      payment_type: 3,
      per_delivery_fee: __per_delivery_fee,
      per_floor_fee: parseInt(products.floor_service.price),
      min_delivery_fee: __min_delivery_fee,
      min_delivery_state: __min_delivery_state,
      delivery_items: __delivery_items,
      delivery_fee: __delivery_fee,
      total_fee: __total_fee,
    })
  }

  const onOderStatusHandler = (e) => {
    window.location.href = '/client/order/' + order.id
  }

  return (
    <>
      <div className='content-container'>
        <div className='flex flex-row-reverse mt-[30px] mr-[20px]'>
          <Link to='/' className='custom-btn hand'>
            {t('common.wd-new-boxes')}
          </Link>
        </div>
        <div className='text-normal text-black py-[20px]'>
          <span>
            {t('customer-retrieval.no-title', {
              order: order.code ? order.code : '',
              date: dateFormat(order.storage_expired_date ? order.storage_expired_date : '', 2),
            })}
          </span>
        </div>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={7} className='pr-[20px]'>
            {orderState === false ? (
              <>
                <RetrievalEdit
                  order={order}
                  products={products}
                  retrievalOrder={retrievalOrder}
                  setRetrievalOrder={setRetrievalOrder}
                  cartInfo={cartInfo}
                  setCartInfo={setCartInfo}
                  onCartHandler={onCartHandler}
                />
                <PaymentMethod
                  cartInfo={cartInfo}
                  retrievalOrder={retrievalOrder}
                  orderId={id}
                  confirmOrder={confirmOrder}
                  setComfirmOrder={setComfirmOrder}
                  setOrderState={setOrderState}
                />
              </>
            ) : (
              <div className='content-container thanks'>
                <div className='content-page'>
                  <div className='text-header text-black'>{t('common.wd-thank-you')}</div>
                  <div className='text-normal text-black'>{t('common.wd-thank-you')}</div>
                  <div className='text-normal text-black mt-[110px]'>
                    {t('page6.no-paragraph1', {
                      order: confirmOrder.code ? confirmOrder.code : '',
                      email: email,
                    })}
                  </div>
                  <div className='text-normal text-black mt-[36px]'>
                    <Trans i18nKey='page6.no-paragraph2'>
                      Click for your{' '}
                      <span className='hand text-blue' onClick={onOderStatusHandler}>
                        order status.
                      </span>
                    </Trans>
                  </div>
                </div>
              </div>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <RetrievalCart cartInfo={cartInfo} retrievalOrder={retrievalOrder} />
          </Grid>
        </Grid>
      </div>
    </>
  )
}
