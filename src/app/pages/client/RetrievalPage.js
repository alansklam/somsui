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
import LoadingSpinner from '../../components/loading-spinner'

export default function RetrievalPage(props) {
  const {id} = useParams()
  const {t} = useTranslation()
  const email = JSON.parse(localStorage?.getItem('ubox-user')).email
  const dispatch = useDispatch()
  const order = useSelector((state) => state.client.currentOrder)
  const products = useSelector((state) => state.client.products)
  const isLoading = useSelector((state) => state.client.loading);
  const [initial, setInitial] = useState(false)
  const [cartInfo, setCartInfo] = useState({
    delivery_items: [],
    free_delivery_state: false,
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
  const [confirmOrder, setConfirmOrder] = useState({})
  const [permitRetrieve, setPermitRetrieve] = useState(true)
  const [isPaidFee, setIsPaidFee] = useState(true)

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

  useEffect(() => {
    let paid_fee = parseFloat(order.paid_fee)
    let total_fee = parseFloat(order.total_fee)

    if (!isNaN(paid_fee) || !isNaN(total_fee)) {
      if (paid_fee < total_fee) {
        setIsPaidFee(false)
      } else {
        setIsPaidFee(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.payment_status_id])

  const onCartHandler = (item, value, isFree) => {
    let __delivery_items = cartInfo.delivery_items
    let __delivery_fee = 0
    let __total_fee = 0
    let __min_delivery_state = false
    let __min_delivery_fee = parseInt(products?.min_delivery_service?.price)
    let __per_delivery_fee = parseInt(products?.delivery_service?.price)
    let __isFreeDeliveryFee = false
    let __next_day_fee = cartInfo.next_day_fee
    let __floor_fee = cartInfo.floor_fee

    if (item && item?.category !== 'bag') {
      __delivery_items[item.id] = {...item, count: value}
    }

    Object.keys(__delivery_items).forEach((iter, index) => {
      __delivery_fee =
        __delivery_fee +
        Number.parseFloat(__delivery_items[iter].delivery_fee).valueOf() *
          __delivery_items[iter].count
    })
    __delivery_fee = __delivery_fee + __per_delivery_fee
    if (__delivery_fee < __min_delivery_fee) {
      __delivery_fee = __min_delivery_fee
      __min_delivery_state = true
    }
    if (isNaN(__delivery_fee)) {
      __delivery_fee = 0
    }

    __delivery_fee = Math.round(__delivery_fee * 100) / 100

    if (isFree && isFree === true) {
      __delivery_fee = 0
      __per_delivery_fee = 0
      __isFreeDeliveryFee = true
      __min_delivery_state = false
      __floor_fee = 0
    } else {
      if (isNaN(__per_delivery_fee)) __per_delivery_fee = 0
    }

    __total_fee = __total_fee + __delivery_fee + __next_day_fee + __floor_fee

    setCartInfo({
      ...cartInfo,
      payment_type: 3,
      free_delivery_state: __isFreeDeliveryFee,
      per_delivery_fee: __per_delivery_fee,
      per_floor_fee: parseInt(products?.floor_service?.price),
      min_delivery_fee: __min_delivery_fee,
      min_delivery_state: __min_delivery_state,
      delivery_items: __delivery_items,
      delivery_fee: __delivery_fee,
      total_fee: __total_fee,
    })
  }

  const onOrderStatusHandler = (e) => {
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
        {!isPaidFee && (
          <div className='border !border-red-400 rounded-lg bg-red-100 p-4 my-4'>
            <span>It appears that you have outstanding fee has not been paid. Please kindly proceed with the payment before placing on retrieval order.</span>
          </div>
        )}
        <div className='text-normal text-black py-[20px]'>
          <span>
            {t('customer-retrieval.no-title', {
              order: order.code ? order.code : '',
              date: order.storage_expired_date
                ? dayjs(order.storage_expired_date).format('DD/MM/YYYY')
                : '',
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
                  setPermitRetrieve={setPermitRetrieve}
                />
                {permitRetrieve && isPaidFee && (
                  <PaymentMethod
                    cartInfo={cartInfo}
                    retrievalOrder={retrievalOrder}
                    orderId={id}
                    confirmOrder={confirmOrder}
                    setConfirmOrder={setConfirmOrder}
                    setOrderState={setOrderState}
                  />
                )}
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
                      <span className='hand text-blue' onClick={onOrderStatusHandler}>
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
        <LoadingSpinner isLoading={isLoading} />
      </div>
    </>
  )
}
