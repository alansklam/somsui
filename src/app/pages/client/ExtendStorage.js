import {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useParams, Link} from 'react-router-dom'
import {useSelector} from 'react-redux/es/exports'
import {useDispatch} from 'react-redux'
import {Grid, Slider, RadioGroup} from '@mui/material'
import CustomColorRadio from '../../components/custom-components/RadioButton'
import CssFormControlLabel from '../../components/custom-components/FormControlLabel'
import {loadStripe} from 'react-stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import PaymentForm from '../../components/payment'
import NumberInput from '../../components/quantity/NumberInput'
import LoadingSpinner from '../../components/loading-spinner'
import dayjs from 'dayjs'
import {fetchCurrentOrder} from '../../store/actions/client'
import {PaymentType} from '../../constants/payment-type'
import {payConfirm} from '../../store/apis/ordering'
import {extendDateApi} from '../../store/apis/client'
import ContentPage6 from '../order/ContentPage6'
import {ShowNotification} from '../../components/notification'

export const ExtendStorage = () => {
  const {id} = useParams()
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const order = useSelector((state) => state.client.currentOrder)
  const isDispatchLoading = useSelector((state) => state.client.loading)
  const extendDate = useSelector((state) => state.client.extendDate)
  const [paymentType, setPaymentType] = useState(PaymentType.CREDITCARD)
  const [paymentCode, setPaymentCode] = useState('')
  const [payStatus, setPayStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notify, setNotify] = useState({title: '', message: '', visible: false, status: 0})
  const [extendedDate, setExtendedDate] = useState('')
  const [totalFee, setTotalFee] = useState()
  const [lang, setLang] = useState('')

  const [initial, setInitial] = useState(false)
  const [duration, setDuration] = useState(1)

  useEffect(() => {
    setInitial(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (initial) {
      setLang(JSON.parse(localStorage.getItem('ubox-lang')))
      dispatch(fetchCurrentOrder({id: id}))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  useEffect(() => {
    console.log('extendDate', extendDate)

    if (extendDate !== undefined && order !== undefined) {
      if (extendDate === '') {
        let expired_date = dayjs(order?.storage_expired_date)
          .add(duration, 'month')
          .format('YYYY-MM-DD')
        setExtendedDate(expired_date)
        getTotalOutstandingFee()
        return
      }
      let month = dayjs(extendDate) - dayjs(order?.storage_expired_date)
      month = Math.ceil(month / (30 * 24 * 3600000))
      setDuration(month)
      setExtendedDate(dayjs(extendDate).format('YYYY-MM-DD'))
      getTotalOutstandingFee()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extendDate, order])

  useEffect(() => {
    if (duration === '' || duration === undefined) {
    } else {
      let expired_date = dayjs(order?.storage_expired_date)
        .add(duration, 'month')
        .format('YYYY-MM-DD')
      setExtendedDate(expired_date)
      getTotalOutstandingFee()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  const dateFormat = (date) => {
    let newDate = dayjs(date).format('DD/MM/YYYY')
    return newDate
  }

  const getTotalOutstandingFee = () => {
    let total = parseInt(order?.balance) + parseInt(order?.product_total_fee) * duration
    total = total.toFixed(2)
    setTotalFee(total)
  }

  const handleSliderChange = (e) => {
    setDuration(e.target.value)
  }

  const handleInputChange = (newValue) => {
    const value = newValue === '' ? 1 : Number(newValue)
    setDuration(value)
  }

  const PrettoSliderStyle = {
    color: '#FFBE3D',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#FFBE3D',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      display: 'none',
    },
  }

  useEffect(() => {
    if (paymentCode !== undefined && paymentCode !== '') {
      if (paymentType === PaymentType.CREDITCARD) return
      const payConfirmTimer = setInterval(() => {
        payConfirm({code: paymentCode})
          .then((res) => {
            if (res.data.success === true) {
              setIsLoading(false)
              clearInterval(payConfirmTimer)
              setPayStatus(true)
            }
          })
          .catch((err) => {
            setIsLoading(false)
            console.log('error', err)
          })
      }, 3000)
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false)
          showNotification({
            title: 'warning',
            message: 'No connect.',
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
          clearInterval(payConfirmTimer)
        }
      }, 60000)
    } else {
      clearInterval()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentCode])

  const showNotification = ({title, message, visible, status}) => {
    setNotify({title, message, visible, status})
  }

  const closeNotify = () => {
    setNotify({
      ...notify,
      visible: false,
    })
  }

  const getStripe = () => {
    const stripeKey = process.env.REACT_APP_STRIPE_KEY
    const stripePromise = loadStripe(stripeKey)
    return stripePromise
  }

  const handleRadioChange = (event) => {
    let type = parseInt(event.target.value)
    setPaymentType(type)
    setPaymentCode('')
  }

  const onNextHandler = (e) => {
    if (duration === 0) return
    clearInterval()
    if (paymentType === PaymentType.CREDITCARD) {
      document.querySelector('form').requestSubmit()
      setIsLoading(true)
    } else {
      setIsLoading(true)
      extendDateApi({
        stripeToken: '',
        order_id: id,
        payment_code: paymentCode,
        payment_type: paymentType,
        months: duration,
        total_fee: totalFee,
        extend_date: extendedDate,
        lang: lang,
      })
        .then((res) => {
          if (res.data.success === true) {
            openCheckoutUrl(res.data.data)
            setPaymentCode(res.data.code)
            // setOrder(res.data.order);
          } else {
            setPaymentCode('')
            console.log('responseError', res.data)
            showNotification({
              title: 'warning',
              message: 'No connect.',
              visible: true,
              status: Math.floor(Math.random() * 100000),
            })
          }
        })
        .catch((err) => {
          setIsLoading(false)
          console.log('errors_message', err)
          showNotification({
            title: 'error',
            message: err.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
        })
    }
  }

  const orderSubmitHandler = (stripeToken) => {
    setPaymentCode('')
    extendDateApi({
      stripeToken: stripeToken,
      order_id: id,
      payment_code: paymentCode,
      payment_type: paymentType,
      months: duration,
      total_fee: totalFee,
      extend_date: extendedDate,
      lang: lang,
    })
      .then((res) => {
        if (res.data.code === 'success') {
          showNotification({
            title: res.data.code,
            message: res.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
          // setOrder(res.data.order);
          setPayStatus(true)
        } else if (res.data.code === 'error') {
          console.log('responseError', res.data)
          setPaymentCode(res.data.payment_code)
          showNotification({
            title: 'warning',
            message: res.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
        }
      })
      .catch((err) => {
        console.log('errors_message', err)
        showNotification({
          title: 'error',
          message: err.data.message,
          visible: true,
          status: Math.floor(Math.random() * 100000),
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onCallbackFunc = (error, token) => {
    setIsLoading(false)
    if (!error) {
      // Backend is not implemented yet, but once there isn’t any errors,
      // you can pass the token and payment data to the backend to complete
      // the charge
      setIsLoading(true)
      let stripeToken = token.id
      orderSubmitHandler(stripeToken)
    } else {
      showNotification({
        title: 'error',
        message: error.message,
        visible: true,
        status: Math.floor(Math.random() * 100000),
      })
    }
  }

  const openCheckoutUrl = (url) => window.open(url, '_blank')?.focus()

  return (
    <>
      {payStatus ? (
        <ContentPage6 order={order} />
      ) : (
        <div className='content-container'>
          <div className='content-page'>
            <div className='flex flex-row-reverse mt-[30px] mr-[20px]'>
              <Link to='/' className='custom-btn hand'>
                {t('common.wd-new-boxes')}
              </Link>
            </div>
            <div className='text-normal text-black py-[20px]'>
              <span>
                {t('customer-extend.no-title', {
                  order: order.code ? order.code : '',
                  date: dateFormat(order.created_at ? order.created_at : '', 2),
                  monthlyFee: order?.product_total_fee,
                })}
              </span>
            </div>
            <div className='text-header text-black py-[10px]'>{t('page1.qu-how-long')}</div>
            <div className='text-normal text-black'>{t('customer_extend.an-how-long')}</div>
            <div className='mx-[0px] mt-[36px]'>
              <Grid container item spacing={0} xs={12} sm={12} md={9}>
                <Grid item xs={4} sm={12} md={4}>
                  <div className='flex'>
                    <NumberInput
                      className='mr-[14px]'
                      value={duration}
                      onChange={handleInputChange}
                    />
                    <div className='flex my-auto'>
                      <span className='text-normal'>{t('common.wd-months')}</span>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={8} sm={12} md={8}>
                  <div className='flex my-auto w-[100%] xs:mt-[20px] pl-[20px]'>
                    <Slider
                      value={duration}
                      aria-label='pretto slider'
                      valueLabelDisplay='auto'
                      min={1}
                      max={18}
                      sx={PrettoSliderStyle}
                      onChange={handleSliderChange}
                    />
                  </div>
                </Grid>
                <div className='pl-[30px] pt-[30px] w-[100%]'>
                  <div className='flex justify-content-between align-items-center width-[100%] pb-[10px]'>
                    <span className='text-header text-black'>
                      {t('customer-extend.wd-before-extension')}
                    </span>
                    <span className='text-normal text-black'>
                      {dateFormat(order?.storage_expired_date)}
                    </span>
                  </div>
                  <div className='flex justify-content-between align-items-center width-[100%] pb-[10px]'>
                    <span className='text-header text-black'>
                      {t('customer-extend.wd-after-extension')}
                    </span>
                    <span className='text-normal text-black'>{dateFormat(extendedDate)}</span>
                  </div>
                  <div className='flex justify-content-between align-items-center width-[100%] pb-[10px]'>
                    <span className='text-header text-black'>
                      {t('customer-extend.wd-outstanding-fee')}
                    </span>
                    <span className='text-normal text-black'>${order?.balance}</span>
                  </div>
                  <div className='flex justify-content-between align-items-center width-[100%] pb-[10px]'>
                    <span className='text-header text-black'>
                      {t('customer-extend.wd-storage-fee-per-month')}
                    </span>
                    <span className='text-normal text-black'>${order?.product_total_fee}</span>
                  </div>
                  <div className='flex justify-content-between align-items-center width-[100%] pb-[10px]'>
                    <span className='text-header text-black'>
                      {t('customer-extend.wd-no-of-month')}
                    </span>
                    <span className='text-normal text-black'>
                      {duration + t('customer-extend.wd-months')}
                    </span>
                  </div>
                  <div className='flex justify-content-between align-items-center width-[100%] pb-[10px]'>
                    <span className='text-header text-black'>
                      {t('customer-extend.wd-total-outstanding-fee')}
                    </span>
                    <span className='text-normal text-black'>${totalFee}</span>
                  </div>
                </div>
              </Grid>
            </div>
            <div className='text-header text-black py-[20px]'>
              {t('customer-extend.qu-which-payment')}
            </div>
            <div className='mx-[0px]'>
              <Grid container item spacing={0} xs={12} sm={12} md={9} className='mt-[10px]'>
                <Grid item xs={12} sm={12} md={12} className='pl-[30px]'>
                  <RadioGroup
                    aria-labelledby='payment-type-radio-buttons-group'
                    name='radio-buttons-group'
                    value={paymentType}
                    onChange={handleRadioChange}
                  >
                    <CssFormControlLabel
                      value={PaymentType.CREDITCARD}
                      control={<CustomColorRadio />}
                      label={t('common.wd-credit-card')}
                    />
                    <Grid item xs={12} sm={12} md={12}>
                      <div className='flex items-center'>
                        {paymentType === PaymentType.CREDITCARD && (
                          <div className='h-[20px] w-[100%] my-[10px]'>
                            <Elements stripe={getStripe()}>
                              <PaymentForm onCallbackHandler={onCallbackFunc} />
                            </Elements>
                          </div>
                        )}
                      </div>
                    </Grid>
                    <CssFormControlLabel
                      value={PaymentType.WECHATPAY}
                      control={<CustomColorRadio />}
                      label={t('common.wd-wechat-pay')}
                    />
                    <CssFormControlLabel
                      value={PaymentType.ALIPAY}
                      control={<CustomColorRadio />}
                      label={t('common.wd-alipay')}
                    />
                  </RadioGroup>
                  <div className='flex item-center my-[30px] w-[100%]'>
                    <span
                      className={duration === 0 ? 'custom-btn disabled-btn' : 'custom-btn hand'}
                      onClick={onNextHandler}
                    >
                      {t('common.wd-extend-now')}
                    </span>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      )}
      <LoadingSpinner isLoading={isLoading || isDispatchLoading} />
      <ShowNotification
        title={notify.title}
        message={notify.message}
        visible={notify.visible}
        status={notify.status}
        closeNotify={closeNotify}
      />
    </>
  )
}
