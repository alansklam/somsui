import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {useParams, Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {Grid, RadioGroup} from '@mui/material'
// import CustomColorRadio from '../../components/custom-components/RadioButton'
// import CssFormControlLabel from '../../components/custom-components/FormControlLabel'
// import {loadStripe} from '@stripe/stripe-js'
// import {Elements} from '@stripe/react-stripe-js'
// import PaymentForm from '../../components/payment'
// import {orderSubmit} from '../../store/apis/ordering'
import {fetchCurrentOrder} from '../../store/actions/client'
import {getPaymentMethod} from '../../store/actions/order'
import LoadingSpinner from '../../components/loading-spinner'
// import {payConfirm} from '../../store/apis/ordering'
// import {PaymentType} from '../../constants/payment-type'
import {useDispatch, useSelector} from 'react-redux'
import RetrievalEdit from './components/RetrievalEdit'
import RetrievalCart from './components/RetrievalCart'
import PaymentMethod from './components/PaymentMethod'

export default function RetrievalPage(props) {
  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const {t} = useTranslation()
  const [lang, setLang] = useState('')
  const dispatch = useDispatch()
  const order = useSelector((state) => state.client.currentOrder)
  const products = useSelector((state) => state.client.products)
  const [initial, setInitial] = useState(false)
  const [cartInfo, setCartInfo] = useState({
    delivery_items: [],
    per_delivery_fee: 0,
    min_delivery_fee: 0,
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

  const __lang = JSON.parse(localStorage.getItem('ubox-lang'))

  useEffect(() => {
    setInitial(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initial) {
      setLang(JSON.parse(localStorage.getItem('ubox-lang')))
      dispatch(fetchCurrentOrder({id: id}))
      dispatch(getPaymentMethod())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  useEffect(() => {
    console.log('retrievalOrder', retrievalOrder)
  }, [retrievalOrder])

  const dateFormat = (date) => {
    let newDate = dayjs(date).format('DD/MM/YYYY')
    return newDate
  }

  const onCartHandler = (item, value) => {
    let __delivery_items = cartInfo.delivery_items
    let __delivery_fee = 0
    let __total_fee = 0
    let __min_delivery_fee = 0
    let __per_delivery_fee = parseInt(products.delivery_service[0].price)

    if (item.category === 'box') {
      __delivery_items[item.id] = {...item, count: value}
    }

    Object.keys(__delivery_items).forEach((iter, index) => {
      __delivery_fee =
        __delivery_fee +
        Number.parseFloat(__delivery_items[iter].delivery_fee).valueOf() *
          __delivery_items[iter].count
      __min_delivery_fee = __min_delivery_fee + __per_delivery_fee
    })
    if (__delivery_fee < __min_delivery_fee) {
      __delivery_fee = __min_delivery_fee
    }
    console.log('delivery_fee', __delivery_fee)
    console.log('min_delivery_fee', __min_delivery_fee)

    __delivery_fee = Math.round(__delivery_fee * 100) / 100
    __total_fee = __total_fee + __delivery_fee

    setCartInfo({
      ...cartInfo,
      payment_type: 3,
      per_delivery_fee: parseInt(products.delivery_service[0].price),
      per_floor_fee: parseInt(products.floor_service[0].price),
      min_delivery_fee: __min_delivery_fee,
      delivery_items: __delivery_items,
      delivery_fee: __delivery_fee,
      total_fee: __total_fee,
    })
  }

  return (
    <>
      <LoadingSpinner isLoading={isLoading}></LoadingSpinner>
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
              date: dateFormat(order.created_at ? order.created_at : '', 2),
            })}
          </span>
        </div>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={7} className='pr-[20px]'>
            <RetrievalEdit
              order={order}
              products={products}
              retrievalOrder={retrievalOrder}
              setRetrievalOrder={setRetrievalOrder}
              cartInfo={cartInfo}
              setCartInfo={setCartInfo}
              onCartHandler={onCartHandler}
            />
            <PaymentMethod cartInfo={cartInfo} retrievalOrder={retrievalOrder} orderId={id} />
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <RetrievalCart cartInfo={cartInfo} retrievalOrder={retrievalOrder} />
          </Grid>
        </Grid>
      </div>
    </>
  )
}
